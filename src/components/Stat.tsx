import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'

/* Счётчик с анимацией от 0 до значения при появлении во вьюпорте.
   Поддерживает суффиксы вида «+», «%». */
export default function Stat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20%' })
  const target = parseInt(value, 10) || 0
  const suffix = value.replace(/[0-9]/g, '')
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, target, {
      duration: 1.7,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(v),
    })
    return () => controls.stop()
  }, [inView, target])

  return (
    <div ref={ref}>
      <div className="text-gold-gradient font-mono text-4xl font-bold tabular-nums sm:text-5xl">
        {Math.round(n)}
        {suffix}
      </div>
      <div className="mt-2 text-sm text-fg-muted">{label}</div>
    </div>
  )
}
