import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

/* ============================================================
   Процедурная генерация города (заглушка до Blender-GLB).
   Сидированный рандом → одинаковая сцена при каждой загрузке.
   ============================================================ */

export function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type TowerOpts = {
  width: number
  depth: number
  height: number
  setbacks?: number // число уступов
  antenna?: boolean
  taper?: number // во сколько раз сужается каждый уступ (0..1)
}

/** Небоскрёб из стопки коробок-уступов. База в y=0, центр по XZ. */
export function makeTowerGeometry(rng: () => number, o: TowerOpts): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = []
  const setbacks = o.setbacks ?? 1
  const taper = o.taper ?? 0.78

  let w = o.width
  let d = o.depth
  let y = 0
  const segH = o.height / (setbacks + 0.001)

  for (let i = 0; i <= setbacks; i++) {
    const h = i === 0 ? segH * (0.9 + rng() * 0.5) : segH * (0.5 + rng() * 0.6)
    const box = new THREE.BoxGeometry(w, h, d, 1, 1, 1)
    box.translate(0, y + h / 2, 0)
    parts.push(box)
    y += h
    w *= taper
    d *= taper
  }

  if (o.antenna) {
    const ah = o.height * (0.12 + rng() * 0.16)
    const aw = Math.min(o.width, o.depth) * 0.06
    const ant = new THREE.BoxGeometry(aw, ah, aw)
    ant.translate(0, y + ah / 2, 0)
    parts.push(ant)
  }

  const merged = mergeGeometries(parts, false)!
  parts.forEach((p) => p.dispose())
  merged.computeVertexNormals()
  return merged
}

/** Базовая геометрия для инстансированного фона (один меш — много копий). */
export function makeInstancedTowerGeometry(): THREE.BufferGeometry {
  const rng = mulberry32(99)
  return makeTowerGeometry(rng, {
    width: 1,
    depth: 1,
    height: 4,
    setbacks: 1,
    taper: 0.74,
    antenna: false,
  })
}

/** Текстура «окон»: тёмная сетка со слабо светящимися окошками. */
export function makeWindowTexture(seed = 7): THREE.Texture {
  const cols = 16
  const rows = 40
  const cell = 8
  const cv = document.createElement('canvas')
  cv.width = cols * cell
  cv.height = rows * cell
  const ctx = cv.getContext('2d')!
  ctx.fillStyle = '#05060a'
  ctx.fillRect(0, 0, cv.width, cv.height)

  const rng = mulberry32(seed)
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const r = rng()
      // большинство окон тёмные, часть — тёплый свет
      let color = 'rgba(20,24,32,1)'
      if (r > 0.82) color = 'rgba(232,214,168,0.95)' // тёплый золотой свет
      else if (r > 0.7) color = 'rgba(150,170,210,0.5)' // холодный отблеск
      ctx.fillStyle = color
      ctx.fillRect(x * cell + 1, y * cell + 1, cell - 2, cell - 3)
    }
  }

  const tex = new THREE.CanvasTexture(cv)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

/** Дешёвый вертикальный градиент неба для scene.background на телефоне
   (вместо ежекадрового рисования полноэкранного HDRI-скайбокса). */
export function makeSkyGradient(top = '#6f88a6', bottom = '#d8cfbe'): THREE.Texture {
  const cv = document.createElement('canvas')
  cv.width = 2
  cv.height = 256
  const ctx = cv.getContext('2d')!
  const g = ctx.createLinearGradient(0, 0, 0, cv.height)
  g.addColorStop(0, top)
  g.addColorStop(1, bottom)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, cv.width, cv.height)
  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.magFilter = THREE.LinearFilter
  tex.minFilter = THREE.LinearFilter
  tex.generateMipmaps = false
  return tex
}

export type TowerInstance = {
  x: number
  z: number
  rotY: number
  sx: number
  sy: number
  sz: number
}

/** Расстановка фоновых башен по «кольцам» вокруг центра, с разрежением в кадре. */
export function buildSkylineLayout(count: number, seed = 2024): TowerInstance[] {
  const rng = mulberry32(seed)
  const out: TowerInstance[] = []
  for (let i = 0; i < count; i++) {
    // полярная раскладка → плотный, но не строгий грид
    const ring = 14 + rng() * 120
    const ang = rng() * Math.PI * 2
    const x = Math.cos(ang) * ring + (rng() - 0.5) * 10
    const z = Math.sin(ang) * ring - rng() * 40 - 8
    // чем дальше — тем выше разброс высот
    const far = THREE.MathUtils.clamp(ring / 120, 0, 1)
    const sy = 2 + rng() * (6 + far * 22)
    const s = 1.6 + rng() * 3.2
    out.push({
      x,
      z,
      rotY: rng() * Math.PI,
      sx: s,
      sy,
      sz: s * (0.7 + rng() * 0.6),
    })
  }
  return out
}
