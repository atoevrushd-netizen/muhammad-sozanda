import { useThree, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { view } from '../lib/viewStore'

/* ============================================================
   Кинематографичная камера.
   1) медленный «въезд» в начале (после ухода лоадера),
   2) облёт над городом по скроллу,
   3) параллакс от мыши + лёгкий дрейф.

   ⤷ Если в будущем GLB будет содержать камеру с анимацией —
     можно проигрывать её через AnimationMixer вместо этого блока.
   ============================================================ */

const INTRO_POS = new THREE.Vector3(230, 135, 300)
const INTRO_LOOK = new THREE.Vector3(-20, 52, -10)
const HERO_POS = new THREE.Vector3(150, 72, 200)
const HERO_LOOK = new THREE.Vector3(-15, 40, -10)
const OVER_POS = new THREE.Vector3(20, 360, 380)
const OVER_LOOK = new THREE.Vector3(0, 8, -10)

const INTRO_DUR = 5.5 // сек, медленно и приятно

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

    // «въезд» стартует только когда сцена готова и лоадер ушёл
    introT.current = Math.min(INTRO_DUR, introT.current + (view.ready ? dt : 0))
    const ie = smoothstep(introT.current / INTRO_DUR)

    base.current.lerpVectors(INTRO_POS, HERO_POS, ie)
    baseLook.current.lerpVectors(INTRO_LOOK, HERO_LOOK, ie)

    // прогресс скролла: герой-вид → облёт сверху
    const p = THREE.MathUtils.clamp(view.scrollY / (view.vh * 1.6), 0, 1)
    const pe = smoothstep(p)

    tp.current.lerpVectors(base.current, OVER_POS, pe)
    tl.current.lerpVectors(baseLook.current, OVER_LOOK, pe)

    // медленный дрейф (нарастает после въезда, гаснет при скролле)
    const drift = (1 - pe) * (0.3 + 0.7 * ie)
    tp.current.x += Math.sin(t * 0.11) * 9 * drift
    tp.current.y += Math.sin(t * 0.08 + 1.3) * 3 * drift
    tp.current.z += Math.cos(t * 0.1) * 6 * drift

    // параллакс от мыши
    tp.current.x += view.mx * 12
    tp.current.y += -view.my * 7
    tl.current.x += view.mx * 16
    tl.current.y += -view.my * 10

    const k = 1 - Math.exp(-3.0 * dt)
    curPos.current.lerp(tp.current, k)
    curLook.current.lerp(tl.current, k)
    camera.position.copy(curPos.current)
    camera.lookAt(curLook.current)
  })

  return null
}
