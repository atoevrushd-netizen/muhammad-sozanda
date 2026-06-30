import { Suspense, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment, AdaptiveDpr, BakeShadows } from '@react-three/drei'
import * as THREE from 'three'
import CityModel from './CityModel'
import CameraRig from './CameraRig'
import { makeSkyGradient } from './procedural'
import { isLowPower } from '../lib/viewStore'
import { asset } from '../lib/asset'

// Направление солнечного света (для света/теней). Масштаб под модель ~8 ед.
const LIGHT_POS: [number, number, number] = [-24, 18, -28]

/* Дешёвое небо для телефона: вместо ежекадрового рисования полноэкранного
   HDRI-скайбокса ставим лёгкий вертикальный градиент в scene.background.
   HDRI при этом остаётся для отражений/освещения (IBL), но не рисуется на весь экран. */
function MobileSky() {
  const scene = useThree((s) => s.scene)
  const tex = useMemo(() => makeSkyGradient(), [])
  useLayoutEffect(() => {
    const prev = scene.background
    scene.background = tex
    return () => {
      scene.background = prev
      tex.dispose()
    }
  }, [scene, tex])
  return null
}

export default function SceneCanvas() {
  const lowPower = useMemo(() => isLowPower(), [])

  // Пауза рендера, когда 3D-герой ушёл за контент (экономия GPU/батареи на телефоне)
  const [active, setActive] = useState(true)
  useEffect(() => {
    const onScroll = () => setActive(window.scrollY < window.innerHeight * 1.25)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <Canvas
      shadows={!lowPower}
      frameloop={active ? 'always' : 'never'}
      // мобайл: фиксированный низкий dpr — главный выигрыш по филлрейту; + авто-снижение
      dpr={lowPower ? 0.7 : [1, 1.85]}
      performance={{ min: 0.2 }}
      gl={{
        // MSAA — единственное сглаживание (постобработки/SMAA больше нет); на tile-GPU дёшев
        antialias: true,
        powerPreference: lowPower ? 'default' : 'high-performance',
        // mediump на мобиле снижает стоимость фрагментного шейдера; геометрии ~58 тр.
        precision: lowPower ? 'mediump' : 'highp',
        alpha: false,
        stencil: false,
        depth: true,
      }}
      camera={{ fov: 35, near: 0.1, far: 300, position: [0, 4.6, 17] }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.0
        scene.fog = new THREE.FogExp2(new THREE.Color('#b9b0a0'), lowPower ? 0.009 : 0.011)
      }}
    >
      <Suspense fallback={null}>
        {/* HDRI citrus_orchard_road_puresky:
            десктоп — фон + отражения; мобайл — только отражения (IBL), фон рисуем градиентом */}
        <Environment
          files={
            lowPower
              ? asset('assets/hdri/citrus_orchard_road_puresky_1k.hdr')
              : asset('assets/hdri/citrus_orchard_road_puresky_2k.hdr')
          }
          background={!lowPower}
          backgroundBlurriness={0}
        />
        {lowPower && <MobileSky />}

        {/* Солнце: направленный свет (тени только на десктопе) */}
        <directionalLight
          castShadow={!lowPower}
          position={LIGHT_POS}
          intensity={2.6}
          color={'#fff1d6'}
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={0.5}
          shadow-camera-far={90}
          shadow-camera-left={-14}
          shadow-camera-right={14}
          shadow-camera-top={16}
          shadow-camera-bottom={-4}
          shadow-bias={-0.0004}
          shadow-normalBias={0.03}
        />
        {/* мягкий заполняющий свет */}
        <ambientLight intensity={lowPower ? 0.34 : 0.25} color={'#aebfda'} />

        <CityModel lowPower={lowPower} />
        <CameraRig />

        <AdaptiveDpr pixelated />
        {!lowPower && <BakeShadows />}
      </Suspense>
    </Canvas>
  )
}
