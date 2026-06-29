import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { hero } from '../lib/content'
import { scrollToId } from '../lib/smoothScroll'
import { view } from '../lib/viewStore'

const lineMask = {
  hidden: { y: '110%' },
  show: (i: number) => ({
    y: '0%',
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.12 },
  }),
}

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.55 + i * 0.12 },
  }),
}

export default function Hero({ ready }: { ready: boolean }) {
  const parallax = useRef<HTMLDivElement>(null)
  const cur = useRef({ x: 0, y: 0 })

  useEffect(() => {
    let raf = 0
    const loop = () => {
      cur.current.x += (view.mx * -14 - cur.current.x) * 0.06
      cur.current.y += (view.my * -10 - cur.current.y) * 0.06
      if (parallax.current) {
        parallax.current.style.transform = `translate3d(${cur.current.x}px, ${cur.current.y}px, 0)`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section id="home" className="relative flex min-h-[100svh] items-center">
      <div className="container-x relative w-full pt-24">
        <div ref={parallax}>
          {/* Эйброу */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate={ready ? 'show' : 'hidden'}
            className="eyebrow mb-7"
          >
            {hero.eyebrow}
          </motion.div>

          {/* Кинетический заголовок */}
          <h1 className="select-none text-gold-gradient glow-gold font-black leading-[0.9]">
            <span className="block overflow-hidden">
              <motion.span
                className="block text-[clamp(3.2rem,12.5vw,11rem)] tracking-[-0.02em]"
                custom={0}
                variants={lineMask}
                initial="hidden"
                animate={ready ? 'show' : 'hidden'}
              >
                {hero.titleTop}
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="block text-[clamp(3.2rem,12.5vw,11rem)] tracking-[-0.02em]"
                custom={1}
                variants={lineMask}
                initial="hidden"
                animate={ready ? 'show' : 'hidden'}
              >
                {hero.titleBottom}
              </motion.span>
            </span>
          </h1>

          {/* Подзаголовок */}
          <motion.p
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate={ready ? 'show' : 'hidden'}
            className="mt-8 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg"
          >
            {hero.subtitle}
          </motion.p>

          {/* CTA */}
          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate={ready ? 'show' : 'hidden'}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <button onClick={() => scrollToId('projects')} className="btn-gold" data-cursor>
              {hero.ctaPrimary}
              <span aria-hidden>→</span>
            </button>
            <button onClick={() => scrollToId('contact')} className="btn-ghost" data-cursor>
              {hero.ctaSecondary}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Подсказка скролла */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      >
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.35em] text-fg-dim">
          {hero.scrollHint}
        </span>
        <span className="relative block h-12 w-px overflow-hidden bg-ink-600">
          <span className="absolute left-0 top-0 h-4 w-px bg-gold-400" style={{ animation: 'scroll-hint 2.2s ease-in-out infinite' }} />
        </span>
      </motion.div>

      {/* Sci-fi деталь справа */}
      <div className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 lg:block">
        <span
          className="font-mono text-[0.6rem] uppercase tracking-[0.4em] text-fg-dim"
          style={{ writingMode: 'vertical-rl' }}
        >
          41.2°N · 69.2°E — DUSHANBE
        </span>
      </div>
    </section>
  )
}
