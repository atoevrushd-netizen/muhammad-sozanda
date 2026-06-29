import { useMemo } from 'react'
import * as THREE from 'three'
import { MeshReflectorMaterial } from '@react-three/drei'
import {
  makeTowerGeometry,
  makeInstancedTowerGeometry,
  makeWindowTexture,
  buildSkylineLayout,
  mulberry32,
} from './procedural'

type Props = { lowPower?: boolean }

export default function City({ lowPower = false }: Props) {
  const windowTex = useMemo(() => {
    const t = makeWindowTexture(7)
    t.repeat.set(2, 7)
    return t
  }, [])

  // ---- материалы --------------------------------------------------------
  const mats = useMemo(() => {
    const glass = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0e141c'),
      metalness: 0.92,
      roughness: 0.22,
      envMapIntensity: 1.25,
      emissive: new THREE.Color('#c9b488'),
      emissiveMap: windowTex,
      emissiveIntensity: 0.55,
    })
    const glass2 = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#121a22'),
      metalness: 0.85,
      roughness: 0.3,
      envMapIntensity: 1.1,
      emissive: new THREE.Color('#9aa6c0'),
      emissiveMap: windowTex,
      emissiveIntensity: 0.4,
    })
    // «герой» — тёмная зеркальная башня (как длинное лондонское здание)
    const hero = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#05080c'),
      metalness: 1.0,
      roughness: 0.12,
      envMapIntensity: 1.5,
      emissive: new THREE.Color('#c9b488'),
      emissiveMap: windowTex,
      emissiveIntensity: 0.35,
    })
    const instanced = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0c1219'),
      metalness: 0.8,
      roughness: 0.35,
      envMapIntensity: 0.95,
      emissive: new THREE.Color('#b9a06a'),
      emissiveMap: windowTex,
      emissiveIntensity: 0.3,
    })
    return { glass, glass2, hero, instanced }
  }, [windowTex])

  // ---- уникальные башни переднего плана ---------------------------------
  const unique = useMemo(() => {
    const rng = mulberry32(11)
    const towers: { pos: [number, number, number]; geo: THREE.BufferGeometry; mat: THREE.Material }[] = [
      {
        pos: [-6, 0, -34],
        geo: makeTowerGeometry(rng, { width: 7, depth: 7, height: 64, setbacks: 2, taper: 0.84, antenna: true }),
        mat: mats.hero,
      },
      {
        pos: [9, 0, -42],
        geo: makeTowerGeometry(rng, { width: 9, depth: 9, height: 44, setbacks: 1, taper: 0.8 }),
        mat: mats.glass,
      },
      {
        pos: [18, 0, -50],
        geo: makeTowerGeometry(rng, { width: 8, depth: 8, height: 54, setbacks: 2, taper: 0.78, antenna: true }),
        mat: mats.glass,
      },
      {
        pos: [2.5, 0, -56],
        geo: makeTowerGeometry(rng, { width: 10, depth: 10, height: 38, setbacks: 1, taper: 0.84 }),
        mat: mats.glass2,
      },
      {
        pos: [-18, 0, -48],
        geo: makeTowerGeometry(rng, { width: 8, depth: 8, height: 48, setbacks: 2, taper: 0.8, antenna: true }),
        mat: mats.glass2,
      },
      {
        pos: [-31, 0, -62],
        geo: makeTowerGeometry(rng, { width: 11, depth: 11, height: 60, setbacks: 2, taper: 0.8 }),
        mat: mats.glass,
      },
    ]
    return towers
  }, [mats])

  // ---- инстансированный фон ---------------------------------------------
  const instanced = useMemo(() => {
    const layout = buildSkylineLayout(lowPower ? 48 : 96)
    const geo = makeInstancedTowerGeometry()
    const mesh = new THREE.InstancedMesh(geo, mats.instanced, layout.length)
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const p = new THREE.Vector3()
    const s = new THREE.Vector3()
    const e = new THREE.Euler()
    layout.forEach((t, i) => {
      e.set(0, t.rotY, 0)
      q.setFromEuler(e)
      p.set(t.x, 0, t.z)
      s.set(t.sx, t.sy, t.sz)
      m.compose(p, q, s)
      mesh.setMatrixAt(i, m)
    })
    mesh.instanceMatrix.needsUpdate = true
    mesh.castShadow = !lowPower
    mesh.receiveShadow = true
    mesh.frustumCulled = false
    return mesh
  }, [mats.instanced, lowPower])

  return (
    <group>
      {/* Земля с реальными отражениями (мокрый утренний асфальт) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[900, 900]} />
        {lowPower ? (
          <meshStandardMaterial color="#070a0e" metalness={0.6} roughness={0.5} envMapIntensity={0.6} />
        ) : (
          <MeshReflectorMaterial
            resolution={1024}
            mixBlur={1}
            mixStrength={18}
            blur={[420, 110]}
            mirror={0.55}
            minDepthThreshold={0.3}
            maxDepthThreshold={1.2}
            depthScale={1.1}
            metalness={0.7}
            roughness={0.5}
            color="#06080c"
            envMapIntensity={0.5}
          />
        )}
      </mesh>

      {/* Фоновые башни (инстансинг) */}
      <primitive object={instanced} />

      {/* Уникальные башни переднего плана */}
      {unique.map((t, i) => (
        <mesh key={i} geometry={t.geo} material={t.mat} position={t.pos} castShadow receiveShadow />
      ))}
    </group>
  )
}
