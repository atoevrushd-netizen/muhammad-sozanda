import { useEffect, useState } from 'react'
import { view } from '../lib/viewStore'

/* Кастомный курсор: точка точно по мыши + кольцо с инерцией,
   увеличивается над интерактивными элементами.
   Включается ТОЛЬКО на десктопе с мышью и широким экраном —
   на мобильных/планшетах и в узком окне его нет (системный курсор). */

const MQ = '(pointer: fine) and (hover: hover)'
const MIN_WIDTH = 768 // ниже — мобильная вёрстка, курсора нет

function shouldEnable() {
  if (typeof window === 'undefined') return false
  return window.matchMedia(MQ).matches && window.innerWidth >= MIN_WIDTH
}

export default function Cursor() {
  const [enabled, setEnabled] = useState(shouldEnable)

  // следим за сменой устройства/размера окна
  useEffect(() => {
    const update = () => setEnabled(shouldEnable())
    const mql = window.matchMedia(MQ)
    mql.addEventListener('change', update)
    window.addEventListener('resize', update)
    return () => {
      mql.removeEventListener('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  // прячем/возвращаем системный курсор
  useEffect(() => {
    document.body.style.cursor = enabled ? 'none' : ''
    return () => {
      document.body.style.cursor = ''
    }
  }, [enabled])

  // анимация курсора (только когда включён)
  useEffect(() => {
    if (!enabled) return
    const dot = document.getElementById('cursor-dot')
    const ring = document.getElementById('cursor-ring')
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    view.tmx = pos.x
    view.tmy = pos.y
    let hover = false
    let down = false

    let raf = 0
    const loop = () => {
      const tx = view.tmx
      const ty = view.tmy
      if (dot) dot.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`
      pos.x += (tx - pos.x) * 0.16
      pos.y += (ty - pos.y) * 0.16
      if (ring) {
        const s = (hover ? 2.5 : 1) * (down ? 0.8 : 1)
        ring.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%) scale(${s})`
        ring.style.borderColor = hover ? 'rgba(232,216,168,0.9)' : 'rgba(201,180,136,0.5)'
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const isInteractive = (t: EventTarget | null) =>
      t instanceof HTMLElement && !!t.closest('a, button, [data-cursor], input, textarea')
    const over = (e: PointerEvent) => {
      if (isInteractive(e.target)) hover = true
    }
    const out = (e: PointerEvent) => {
      if (isInteractive(e.target)) hover = false
    }
    const onDown = () => (down = true)
    const onUp = () => (down = false)

    document.addEventListener('pointerover', over)
    document.addEventListener('pointerout', out)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('pointerover', over)
      document.removeEventListener('pointerout', out)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div
        id="cursor-ring"
        className="pointer-events-none fixed left-0 top-0 z-[95] h-9 w-9 rounded-full border"
        style={{ borderColor: 'rgba(201,180,136,0.5)', transition: 'border-color .25s' }}
      />
      <div
        id="cursor-dot"
        className="pointer-events-none fixed left-0 top-0 z-[95] h-1.5 w-1.5 rounded-full bg-gold-200"
      />
    </>
  )
}
