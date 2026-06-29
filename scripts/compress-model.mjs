/* Сжатие GLB-модели города для веба. Делает ДВЕ версии:
   - public/models/city.glb        — десктоп: WebP-текстуры ≤1024
   - public/models/city-mobile.glb — телефон: WebP-текстуры ≤512 (легче по видеопамяти)
   Геометрия — meshopt. На вебе подхватывается автоматически (WebP — three, meshopt — drei).

   Запуск:  npm run compress
   Вход:    model-source/<твой>.glb   (по умолчанию — первый .glb в папке)

   После ре-экспорта из Blender положи новый .glb в model-source/ и запусти команду. */

import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { dedup, prune, weld, textureCompress, meshopt } from '@gltf-transform/functions'
import { MeshoptEncoder } from 'meshoptimizer'
import sharp from 'sharp'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const SRC_DIR = 'model-source'

function pickInput() {
  if (process.argv[2]) return process.argv[2]
  const glbs = readdirSync(SRC_DIR).filter((f) => f.toLowerCase().endsWith('.glb'))
  if (!glbs.length) throw new Error(`Нет .glb в ${SRC_DIR}/`)
  return join(SRC_DIR, glbs[0])
}

async function build(input, out, maxTexture, quality) {
  const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({ 'meshopt.encoder': MeshoptEncoder })
  const doc = await io.read(input)
  await doc.transform(
    dedup(),
    prune(),
    weld(),
    textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [maxTexture, maxTexture], quality }),
    meshopt({ encoder: MeshoptEncoder, level: 'high' }),
  )
  await io.write(out, doc)
  const mb = (statSync(out).size / 1024 / 1024).toFixed(1)
  console.log(`  ${out}  (${mb} МБ, текстуры ≤${maxTexture})`)
}

const input = pickInput()
console.log('источник:', input)
await MeshoptEncoder.ready

await build(input, 'public/models/city.glb', 1024, 82)
await build(input, 'public/models/city-mobile.glb', 512, 75)
console.log('готово')
