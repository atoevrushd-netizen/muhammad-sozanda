import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { brand } from '../lib/content'
import { asset } from '../lib/asset'

/* Прелоадер: ждём загрузки геройских картинок (без three.js).
   Минимальная выдержка ~1.1с — чтобы успел проиграться бренд-интро. */
export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [done, setDone] = useState(false)
  const [pct, setPct] = useState(8)

  useEffect(() => {
    let cancelled = false
    const start = performance.now()
    const MIN_MS = 1100
    const srcs = [asset('hero/hero-desktop.webp'), asset('hero/hero-mobile.webp')]
    let loaded = 0

    const finish = () => {
      if (cancelled) return
      const wait = Math.max(0, MIN_MS - (performance.now() - start))
      setTimeout(() => !cancelled && setDone(true), wait + 350)
    }
    const onOne = () => {
      loaded++
      setPct(Math.max(8, Math.round((loaded / srcs.length) * 100)))
      if (loaded >= srcs.length) finish()
    }

    srcs.forEach((s) => {
      const img = new Image()
      img.onload = onOne
      img.onerror = onOne
      img.src = s
    })

    // страховка от зависания
    const safety = setTimeout(() => !cancelled && setDone(true), 8000)
    return () => {
      cancelled = true
      clearTimeout(safety)
    }
  }, [])

  // сообщаем «готово» сразу при завершении — герой проявляется, пока лоадер уходит
  useEffect(() => {
    if (done) onComplete()
  }, [done, onComplete])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="grain fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ background: 'radial-gradient(120% 120% at 50% 35%, #0b0d11 0%, #06070a 70%)' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
        >
          <motion.img
            src={brand.logoMark}
            alt={brand.name}
            className="h-24 w-24 rounded-md object-cover anim-float"
            style={{ boxShadow: '0 0 60px -10px rgba(201,180,136,0.5)' }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />

          <div className="mt-8 text-center">
            <div className="text-gold-gradient text-lg font-extrabold tracking-[0.32em]">
              {brand.nameLatin}
            </div>
            <div className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.4em] text-fg-dim">
              {brand.kicker}
            </div>
          </div>

          {/* прогресс */}
          <div className="mt-10 w-56">
            <div className="h-px w-full overflow-hidden bg-ink-600">
              <motion.div
                className="h-full bg-gradient-to-r from-gold-600 to-gold-200"
                animate={{ width: `${pct}%` }}
                transition={{ ease: 'linear', duration: 0.25 }}
              />
            </div>
            <div className="mt-3 flex justify-between font-mono text-[0.6rem] tracking-widest text-fg-dim">
              <span>БОРГИРӢ</span>
              <span>{pct}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
