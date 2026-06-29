import { Suspense, useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, AdaptiveDpr, BakeShadows } from '@react-three/drei'
import * as THREE from 'three'
import CityModel from './CityModel'
import CameraRig from './CameraRig'
import Effects from './Effects'
import { makeGlowTexture } from './procedural'
import { isLowPower } from '../lib/viewStore'
import { asset } from '../lib/asset'

// Солнце далеко и невысоко — длинные утренние тени. Масштаб под модель (~248 ед.).
const SUN_POS: [number, number, number] = [-300, 180, -340]
const LIGHT_POS: [number, number, number] = [-240, 150, -270]

export default function SceneCanvas() {
  const [sun, setSun] = useState<THREE.Mesh | null>(null)
  const lowPower = useMemo(() => isLowPower(), [])

  // Пауза рендера, когда 3D-герой ушёл за контент (экономия GPU/батареи на телефоне)
  const [active, setActive] = useState(true)
  useEffect(() => {
    const onScroll = () => setActive(window.scrollY < window.innerHeight * 1.25)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const halo = useMemo(() => {
    const tex = makeGlowTexture('rgba(255,243,212,0.9)', 'rgba(255,243,212,0)')
    const mat = new THREE.SpriteMaterial({
      map: tex,
      color: 0xfff3d4,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
      toneMapped: false,
    })
    const s = new THREE.Sprite(mat)
    s.scale.set(340, 340, 1)
    return s
  }, [])

  return (
    <Canvas
      shadows
      frameloop={active ? 'always' : 'never'}
      dpr={[1, lowPower ? 1.3 : 1.85]}
      gl={{ antialias: false, powerPreference: 'high-performance', alpha: false, stencil: false }}
      camera={{ fov: 38, near: 1, far: 3500, position: [230, 135, 300] }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.0
        scene.fog = new THREE.FogExp2(new THREE.Color('#b9b0a0'), lowPower ? 0.0008 : 0.001)
      }}
    >
      <Suspense fallback={null}>
        {/* HDRI: ясное утреннее небо citrus_orchard_road_puresky */}
        <Environment
          files={
            lowPower
              ? asset('assets/hdri/citrus_orchard_road_puresky_1k.hdr')
              : asset('assets/hdri/citrus_orchard_road_puresky_2k.hdr')
          }
          background
          backgroundBlurriness={0}
        />

        {/* Солнце: направленный свет + длинные мягкие тени */}
        <directionalLight
          castShadow
          position={LIGHT_POS}
          intensity={2.6}
          color={'#fff1d6'}
          shadow-mapSize={[lowPower ? 1024 : 4096, lowPower ? 1024 : 4096]}
          shadow-camera-near={1}
          shadow-camera-far={900}
          shadow-camera-left={-240}
          shadow-camera-right={240}
          shadow-camera-top={260}
          shadow-camera-bottom={-160}
          shadow-bias={-0.0003}
          shadow-normalBias={0.6}
        />
        <ambientLight intensity={0.25} color={'#aebfda'} />

        {/* Видимое солнце (источник для GodRays) + мягкий ореол */}
        <mesh ref={setSun} position={SUN_POS}>
          <sphereGeometry args={[16, 24, 24]} />
          <meshBasicMaterial color={'#fff4d6'} toneMapped={false} />
        </mesh>
        <primitive object={halo} position={SUN_POS} />

        <CityModel lowPower={lowPower} />
        <CameraRig />

        {sun && <Effects sun={sun} lowPower={lowPower} />}

        <AdaptiveDpr pixelated />
        <BakeShadows />
      </Suspense>
    </Canvas>
  )
}
