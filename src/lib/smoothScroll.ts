import { useEffect } from 'react'
import Lenis from 'lenis'
import { view, isLowPower } from './viewStore'

/* Плавный скролл + мост к 3D-сцене через viewStore.
   На десктопе — Lenis (инерционный скролл).
   На телефоне Lenis НЕ запускаем: его постоянный requestAnimationFrame + интерполяция
   конкурируют с циклом R3F и дают джанк. Используем нативный скролл — он плавнее на мобиле
   и убирает целый always-on rAF с главного потока. */

let lenis: Lenis | null = null

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { duration: 1.2, offset: 0 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

export function useSmoothScroll() {
  useEffect(() => {
    const lowPower = isLowPower()

    const onMove = (e: PointerEvent) => {
      view.mx = (e.clientX / window.innerWidth) * 2 - 1
      view.my = (e.clientY / window.innerHeight) * 2 - 1
      view.tmx = e.clientX
      view.tmy = e.clientY
    }
    const onResize = () => {
      view.vw = window.innerWidth
      view.vh = window.innerHeight
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('resize', onResize)
    onResize()

    // ── Мобайл: нативный скролл, без Lenis ──────────────────────────────
    if (lowPower) {
      const onScroll = () => {
        const doc = document.documentElement
        const max = doc.scrollHeight - window.innerHeight
        view.scrollY = window.scrollY
        view.scrollProgress = max > 0 ? window.scrollY / max : 0
        view.heroProgress = Math.min(1, window.scrollY / Math.max(1, window.innerHeight))
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
      return () => {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('resize', onResize)
      }
    }

    // ── Десктоп: Lenis ──────────────────────────────────────────────────
    const l = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    })
    lenis = l

    let raf = 0
    const loop = (t: number) => {
      l.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    l.on('scroll', (e: any) => {
      view.scrollY = e.scroll
      view.scrollProgress = e.limit > 0 ? e.scroll / e.limit : 0
      view.heroProgress = Math.min(1, e.scroll / Math.max(1, window.innerHeight))
    })

    return () => {
      cancelAnimationFrame(raf)
      l.destroy()
      lenis = null
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', onResize)
    }
  }, [])
}
