import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { asset } from '../lib/asset'
import { isLowPower } from '../lib/viewStore'

/* Реальная модель города (Blender → GLB), сжатая: WebP + meshopt.
   На телефоне грузим более лёгкую версию (текстуры 512 → меньше видеопамяти). */
const URL = asset(isLowPower() ? 'models/city-mobile.glb' : 'models/city.glb')
useGLTF.preload(URL)

type Props = { lowPower?: boolean }

export default function CityModel({ lowPower = false }: Props) {
  const { scene } = useGLTF(URL)

  // тени + отражения HDRI; на мобиле выключаем дорогое стекло (transmission)
  useEffect(() => {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (mesh.isMesh) {
        mesh.castShadow = !lowPower
        mesh.receiveShadow = !lowPower
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        for (const m of mats) {
          const sm = m as THREE.MeshPhysicalMaterial
          if (sm && 'envMapIntensity' in sm) sm.envMapIntensity = 1.15
          // transmission — самый тяжёлый эффект; на слабых устройствах отключаем
          if (lowPower && sm && 'transmission' in sm && sm.transmission > 0) {
            sm.transmission = 0
            sm.thickness = 0
            sm.roughness = Math.min(sm.roughness ?? 0.4, 0.3)
            sm.metalness = Math.max(sm.metalness ?? 0, 0.6)
          }
        }
      }
    })
  }, [scene, lowPower])

  // отцентровать по XZ и поставить на y=0 (вычисляем из bbox — устойчиво к ре-экспорту)
  const offset = useMemo<[number, number, number]>(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const c = new THREE.Vector3()
    box.getCenter(c)
    return [-c.x, -box.min.y, -c.z]
  }, [scene])

  return (
    <group dispose={null}>
      {/* модель, отцентрованная в мировом начале координат */}
      <group position={offset}>
        <primitive object={scene} />
      </group>

      {/* большая тёмная «земля» вокруг квартала: бесконечный пол + ловит тени, тонет в тумане */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow={!lowPower}>
        <planeGeometry args={[5000, 5000]} />
        <meshStandardMaterial
          color="#06080c"
          metalness={lowPower ? 0.2 : 0.45}
          roughness={lowPower ? 0.7 : 0.5}
          envMapIntensity={0.4}
        />
      </mesh>
    </group>
  )
}
