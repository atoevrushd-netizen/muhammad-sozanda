/* Оптимизация GLB-модели города для веба. Делает ДВЕ версии:
   - public/models/buildings.glb        — десктоп: WebP, нормали lossless, остальное q95 (без потери качества)
   - public/models/buildings-mobile.glb — телефон: WebP ≤1024, q85 (легче по видеопамяти)
   Геометрия — meshopt. На вебе WebP читает three, meshopt — drei (автоматически).

   Запуск:  npm run compress
   Вход:    model-source/buildings.glb   (или путь первым аргументом)

   После ре-экспорта из Blender положи новый .glb в model-source/buildings.glb и запусти команду. */

import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { dedup, prune, weld, textureCompress, meshopt } from '@gltf-transform/functions'
import { MeshoptEncoder } from 'meshoptimizer'
import sharp from 'sharp'
import { statSync } from 'node:fs'

const INPUT = process.argv[2] || 'model-source/buildings.glb'

function newIO() {
  return new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({ 'meshopt.encoder': MeshoptEncoder })
}

async function buildDesktop(out) {
  const doc = await newIO().read(INPUT)
  await doc.transform(
    dedup(),
    prune(),
    weld(),
    // нормали — без потерь (чувствительны к артефактам компрессии)
    textureCompress({ encoder: sharp, targetFormat: 'webp', slots: /normalTexture/, lossless: true }),
    // цвет / эмиссия / metallic-roughness — практически без потерь
    textureCompress({
      encoder: sharp,
      targetFormat: 'webp',
      slots: /(baseColor|emissive|metallicRoughness|occlusion)/,
      quality: 95,
    }),
    meshopt({ encoder: MeshoptEncoder, level: 'high' }),
  )
  await newIO().write(out, doc)
  report(out, '2K, нормали lossless / q95')
}

async function buildMobile(out) {
  const doc = await newIO().read(INPUT)
  await doc.transform(
    dedup(),
    prune(),
    weld(),
    textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [1024, 1024], quality: 85 }),
    meshopt({ encoder: MeshoptEncoder, level: 'high' }),
  )
  await newIO().write(out, doc)
  report(out, '≤1024, q85')
}

function report(out, note) {
  const mb = (statSync(out).size / 1024 / 1024).toFixed(1)
  console.log(`  ${out}  (${mb} МБ, ${note})`)
}

console.log('источник:', INPUT)
await MeshoptEncoder.ready
await buildDesktop('public/models/buildings.glb')
await buildMobile('public/models/buildings-mobile.glb')
console.log('готово')
