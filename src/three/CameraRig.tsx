import { useThree, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { view } from '../lib/viewStore'

/* Кинематографичная камера для срезанной модели (~8 ед.).
   Модель оптимизирована под один ракурс (задние грани срезаны), поэтому движение
   КАМЕРЫ держим фронтальным и небольшим: медленный наезд + лёгкий параллакс/дрейф.
   Никакого облёта вокруг — иначе покажутся «дыры» сзади. */

// Камера чуть ниже и сдвинута вправо — здания читаются под лёгким углом
// (не фронтально в лоб). Угол маленький, срезанные грани сзади не показываются.
const INTRO_POS = new THREE.Vector3(3.0, 4.4, 21)
const INTRO_LOOK = new THREE.Vector3(0.3, 3.0, 0)
const HERO_POS = new THREE.Vector3(2.6, 3.5, 16.5)
const HERO_LOOK = new THREE.Vector3(0.3, 2.7, 0)
// скролл: лёгкий наезд, угол сохраняем
const END_POS = new THREE.Vector3(2.0, 3.1, 12.5)
const END_LOOK = new THREE.Vector3(0.3, 2.5, 0)

const INTRO_DUR = 4.5
const smoothstep = (x: number) => x * x * (3 - 2 * x)

export default function CameraRig() {
  const { camera } = useThree()
  const introT = useRef(0)
  const curPos = useRef(INTRO_POS.clone())
  const curLook = useRef(INTRO_LOOK.clone())
  const base = useRef(new THREE.Vector3())
  const baseLook = useRef(new THREE.Vector3())
  const tp = useRef(new THREE.Vector3())
  const tl = useRef(new THREE.Vector3())

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    introT.current = Math.min(INTRO_DUR, introT.current + (view.ready ? dt : 0))
    const ie = smoothstep(introT.current / INTRO_DUR)
    base.current.lerpVectors(INTRO_POS, HERO_POS, ie)
    baseLook.current.lerpVectors(INTRO_LOOK, HERO_LOOK, ie)

    const p = THREE.MathUtils.clamp(view.scrollY / (view.vh * 1.6), 0, 1)
    const pe = smoothstep(p)
    tp.current.lerpVectors(base.current, END_POS, pe)
    tl.current.lerpVectors(baseLook.current, END_LOOK, pe)

    // мелкий дрейф + параллакс (амплитуды малы — фронтальность сохраняется)
    const drift = (1 - pe) * (0.3 + 0.7 * ie)
    tp.current.x += Math.sin(t * 0.22) * 0.5 * drift
    tp.current.y += Math.sin(t * 0.17 + 1.0) * 0.22 * drift
    tp.current.x += view.mx * 0.8
    tp.current.y += -view.my * 0.5
    tl.current.x += view.mx * 0.5

    const k = 1 - Math.exp(-3.2 * dt)
    curPos.current.lerp(tp.current, k)
    curLook.current.lerp(tl.current, k)
    camera.position.copy(curPos.current)
    camera.lookAt(curLook.current)
  })

  return null
}
