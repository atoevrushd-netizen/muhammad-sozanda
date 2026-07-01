import { useEffect, useRef } from 'react'
import { asset } from '../lib/asset'
import { isLowPower } from '../lib/viewStore'

/* Фиксированный фон-герой: отрендеренный в Blender наезд камеры по городу,
   управляемый СКРОЛЛОМ (не автоплей). Сверху страницы виден 1-й кадр; по мере
   прокрутки первого экрана кадры идут 1→100, вверх — назад. Это секвенция WebP,
   которую рисуем в <canvas> (Apple-style scrubbing) — на мобиле надёжнее, чем
   перемотка <video> (нет джанка с video.seek на iOS). Никакого WebGL.

   Сглаживание: на десктопе скролл уже сглаживает Lenis — там кадр ведём 1:1
   (двойное сглаживание давало «плавающий» отстающий скруб). На мобиле Lenis нет,
   поэтому добавляем собственное лёгкое экспоненциальное сглаживание (rAF).

   Производительность: requestAnimationFrame крутится ТОЛЬКО во время скролл-докрутки
   на мобиле и гаснет, когда кадр «доехал». Кадры декодятся один раз; рисование —
   это блит уже декодированного битмапа.

   Доступность: при prefers-reduced-motion скруб отключаем — показываем один
   статичный кадр. */

const FRAME_COUNT = 100
const pad4 = (n: number) => String(n).padStart(4, '0')

export default function Background3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const lowPower = isLowPower() // mobile/native-scroll → нужно своё сглаживание; десктоп с Lenis → 1:1
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const mq = window.matchMedia('(orientation: portrait)')
    let variant: 'mobile' | 'desktop' = mq.matches ? 'mobile' : 'desktop'

    let frames: HTMLImageElement[] = []
    let loaded: boolean[] = []
    let loadToken = 0
    let cw = 0
    let ch = 0
    let lastDrawn = -1

    // целевой и отображаемый прогресс (0..1)
    let target = 0
    let displayed = 0
    let raf = 0
    let running = false

    const frameUrl = (v: 'mobile' | 'desktop', i: number) =>
      asset(`hero/seq/${v}/${pad4(i + 1)}.webp`)

    function nearestLoaded(idx: number): number {
      if (loaded[idx]) return idx
      for (let d = 1; d < FRAME_COUNT; d++) {
        if (idx - d >= 0 && loaded[idx - d]) return idx - d
        if (idx + d < FRAME_COUNT && loaded[idx + d]) return idx + d
      }
      return -1
    }

    function drawCover(img: HTMLImageElement) {
      const iw = img.naturalWidth || img.width
      const ih = img.naturalHeight || img.height
      if (!iw || !ih || !cw || !ch) return
      const scale = Math.max(cw / iw, ch / ih)
      const w = iw * scale
      const h = ih * scale
      const x = (cw - w) / 2
      const y = (ch - h) / 2
      ctx!.fillStyle = '#06070a'
      ctx!.fillRect(0, 0, cw, ch)
      ctx!.drawImage(img, x, y, w, h)
    }

    function draw() {
      const idx = Math.round(displayed * (FRAME_COUNT - 1))
      const use = nearestLoaded(idx)
      if (use < 0 || use === lastDrawn) return
      drawCover(frames[use])
      lastDrawn = use
    }

    // rAF-сглаживание — только для мобайла (нативный скролл без Lenis)
    function tick() {
      displayed += (target - displayed) * 0.16
      if (Math.abs(target - displayed) < 0.0006) {
        displayed = target
        draw()
        running = false
        raf = 0
        return
      }
      draw()
      raf = requestAnimationFrame(tick)
    }
    function wake() {
      if (!running) {
        running = true
        raf = requestAnimationFrame(tick)
      }
    }

    function computeTarget() {
      const p = window.scrollY / Math.max(1, window.innerHeight)
      target = p < 0 ? 0 : p > 1 ? 1 : p
      if (lowPower) {
        wake() // мобайл: лёгкое сглаживание через rAF
      } else {
        displayed = target // десктоп: Lenis уже сгладил — ведём кадр 1:1
        draw()
      }
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      cw = window.innerWidth
      ch = window.innerHeight
      canvas!.width = Math.round(cw * dpr)
      canvas!.height = Math.round(ch * dpr)
      canvas!.style.width = cw + 'px'
      canvas!.style.height = ch + 'px'
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      lastDrawn = -1
      draw()
    }

    function loadSet(v: 'mobile' | 'desktop') {
      // погасить обработчики прошлого набора, чтобы «опоздавшие» декоды не писали в новые массивы
      for (const im of frames) {
        if (im) {
          im.onload = null
          im.onerror = null
        }
      }
      const token = ++loadToken
      frames = new Array(FRAME_COUNT)
      loaded = new Array(FRAME_COUNT).fill(false)
      lastDrawn = -1
      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image()
        img.decoding = 'async'
        img.onload = () => {
          if (token !== loadToken) return
          loaded[i] = true
          draw() // подтянуть/проявить кадр, даже если rAF уже погас
        }
        img.onerror = () => {
          if (token !== loadToken) return
          loaded[i] = true
        }
        img.src = frameUrl(v, i)
        frames[i] = img
      }
    }

    const onScroll = () => computeTarget()
    const onResize = () => {
      resize()
      if (!reduceMotion) computeTarget()
    }
    const onOrient = (e: MediaQueryListEvent) => {
      const nv: 'mobile' | 'desktop' = e.matches ? 'mobile' : 'desktop'
      if (nv !== variant) {
        variant = nv
        loadSet(nv)
        resize()
        if (!reduceMotion) computeTarget()
      }
    }

    resize()
    loadSet(variant)

    if (reduceMotion) {
      // без движения: статичный первый кадр (совпадает с постером)
      target = 0
      displayed = 0
      draw()
    } else {
      computeTarget() // учитывает восстановленную браузером позицию скролла
      window.addEventListener('scroll', onScroll, { passive: true })
    }
    window.addEventListener('resize', onResize)
    mq.addEventListener('change', onOrient)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      for (const im of frames) {
        if (im) {
          im.onload = null
          im.onerror = null
        }
      }
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      mq.removeEventListener('change', onOrient)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-ink-950">
      {/* Постер (1-й кадр) — мгновенная картинка, пока грузится секвенция; canvas рисуется поверх */}
      <picture>
        <source media="(orientation: portrait)" srcSet={asset('hero/hero-mobile.webp')} />
        <img
          src={asset('hero/hero-desktop.webp')}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>

      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />

      {/* затемнение книзу — чтобы контент читался */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(6,7,10,0.32) 0%, rgba(6,7,10,0.06) 24%, transparent 46%, rgba(6,7,10,0.66) 78%, rgba(6,7,10,0.97) 100%)',
        }}
      />
      {/* затемнение слева — под геройский заголовок */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, rgba(6,7,10,0.62) 0%, rgba(6,7,10,0.2) 32%, transparent 58%)',
        }}
      />
      {/* мягкая виньетка по краям */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: 'inset 0 0 220px 50px rgba(0,0,0,0.55)' }}
      />
    </div>
  )
}
