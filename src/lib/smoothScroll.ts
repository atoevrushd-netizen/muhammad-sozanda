import { useEffect } from 'react'
import Lenis from 'lenis'
import { view } from './viewStore'

/* Плавный скролл (Lenis) + мост к 3D-сцене через viewStore. */

let lenis: Lenis | null = null

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { duration: 1.2, offset: 0 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

export function useSmoothScroll() {
  useEffect(() => {
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

    return () => {
      cancelAnimationFrame(raf)
      l.destroy()
      lenis = null
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', onResize)
    }
  }, [])
}
