import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { asset } from '../lib/asset'
import { isLowPower } from '../lib/viewStore'

/* Модель зданий (Blender → GLB), супер-лёгкая геометрия (~58 тр., фасады-оболочки),
   детализация в текстурах. WebP + meshopt. На телефоне — версия с текстурами 512.
   Модель срезана с невидимых сторон → смотреть только с фронтального ракурса.
   «Лицо» квартала в исходнике смотрит в +X — разворачиваем на −90° вокруг Y,
   чтобы фронт встал в +Z (камера-rig рассчитан на фронтальность по оси Z). */
const FRONT_Y_ROT: [number, number, number] = [0, -Math.PI / 2, 0]
const URL = asset(isLowPower() ? 'models/buildings-mobile.glb' : 'models/buildings.glb')
useGLTF.preload(URL)

type Props = { lowPower?: boolean }

export default function CityModel({ lowPower = false }: Props) {
  const { scene } = useGLTF(URL)

  useEffect(() => {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (mesh.isMesh) {
        mesh.castShadow = !lowPower
        mesh.receiveShadow = !lowPower
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        for (const m of mats) {
          const sm = m as THREE.MeshStandardMaterial
          if (sm && 'envMapIntensity' in sm) sm.envMapIntensity = 1.0
        }
      }
    })
  }, [scene, lowPower])

  // отцентровать по XZ и поставить на y=0 (из bbox — устойчиво к ре-экспорту)
  const offset = useMemo<[number, number, number]>(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const c = new THREE.Vector3()
    box.getCenter(c)
    return [-c.x, -box.min.y, -c.z]
  }, [scene])

  return (
    <group dispose={null}>
      <group rotation={FRONT_Y_ROT}>
        <group position={offset}>
          <primitive object={scene} />
        </group>
      </group>

      {/* тёмная земля под кварталом (масштаб модели ~8 ед.) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow={!lowPower}>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color="#06080c" metalness={0.4} roughness={0.55} envMapIntensity={0.35} />
      </mesh>
    </group>
  )
}
