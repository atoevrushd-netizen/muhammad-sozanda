/* Сжатие GLB-модели города для веба:
   WebP-текстуры (≤1024) + meshopt-геометрия → ~11 МБ вместо ~70 МБ.
   На вебе подхватывается автоматически: WebP читает three, meshopt — drei.

   Запуск:  npm run compress
   Вход:    model-source/<твой>.glb   (по умолчанию — первый .glb в папке)
   Выход:   public/models/city.glb

   После ре-экспорта из Blender положи новый .glb в model-source/ и запусти команду. */

import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { dedup, prune, weld, textureCompress, meshopt } from '@gltf-transform/functions'
import { MeshoptEncoder } from 'meshoptimizer'
import sharp from 'sharp'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const SRC_DIR = 'model-source'
const OUT = 'public/models/city.glb'
const MAX_TEXTURE = 1024
const WEBP_QUALITY = 82

function pickInput() {
  if (process.argv[2]) return process.argv[2]
  const glbs = readdirSync(SRC_DIR).filter((f) => f.toLowerCase().endsWith('.glb'))
  if (!glbs.length) throw new Error(`Нет .glb в ${SRC_DIR}/`)
  return join(SRC_DIR, glbs[0])
}

const input = pickInput()
console.log('источник:', input)

await MeshoptEncoder.ready
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.encoder': MeshoptEncoder })

const doc = await io.read(input)
await doc.transform(
  dedup(),
  prune(),
  weld(),
  textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [MAX_TEXTURE, MAX_TEXTURE], quality: WEBP_QUALITY }),
  meshopt({ encoder: MeshoptEncoder, level: 'high' }),
)
await io.write(OUT, doc)

const mb = (statSync(OUT).size / 1024 / 1024).toFixed(1)
console.log(`готово → ${OUT} (${mb} МБ)`)
