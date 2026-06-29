import { useMemo } from 'react'
import * as THREE from 'three'
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
  SMAA,
  GodRays,
} from '@react-three/postprocessing'
import { BlendFunction, KernelSize } from 'postprocessing'

/* Пост-обработка — воссоздаём «вид EEVEE»:
   фокусный блюр (DOF), Bloom-свечение, лучи солнца (GodRays),
   лёгкая хроматическая аберрация линзы, виньетка, сглаживание. */

type Props = { sun: THREE.Mesh; lowPower: boolean }

export default function Effects({ sun, lowPower }: Props) {
  const caOffset = useMemo(() => new THREE.Vector2(0.0006, 0.0006), [])

  if (lowPower) {
    return (
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur intensity={0.55} luminanceThreshold={0.55} luminanceSmoothing={0.2} />
        <Vignette eskil={false} offset={0.3} darkness={0.9} />
        <SMAA />
      </EffectComposer>
    )
  }

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        mipmapBlur
        intensity={0.62}
        luminanceThreshold={0.62}
        luminanceSmoothing={0.25}
        kernelSize={KernelSize.LARGE}
      />
      <GodRays
        sun={sun}
        samples={60}
        density={0.95}
        decay={0.93}
        weight={0.5}
        exposure={0.45}
        clampMax={1}
        blur
        kernelSize={KernelSize.SMALL}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={caOffset}
        radialModulation={false}
        modulationOffset={0}
      />
      <Vignette eskil={false} offset={0.28} darkness={0.92} />
      <SMAA />
    </EffectComposer>
  )
}
