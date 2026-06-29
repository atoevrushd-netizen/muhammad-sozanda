import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { brand, nav } from '../lib/content'
import { scrollToId } from '../lib/smoothScroll'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const go = (id: string) => {
    setOpen(false)
    scrollToId(id)
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,border-color] duration-500 ${
          scrolled ? 'border-b border-gold-400/10 bg-ink-950/55 backdrop-blur-xl' : 'border-b border-transparent'
        }`}
      >
        <nav className="container-x flex h-[72px] items-center justify-between">
          {/* Лого */}
          <button onClick={() => go('home')} className="group flex items-center gap-3" data-cursor>
            <img
              src={brand.logoMark}
              alt={brand.name}
              className="h-9 w-9 rounded-[6px] object-cover ring-1 ring-gold-400/25 transition-transform duration-500 group-hover:scale-105"
            />
            <span className="hidden flex-col leading-none sm:flex">
              <span className="text-[0.78rem] font-extrabold tracking-[0.22em] text-fg">МУҲАММАД</span>
              <span className="text-gold-gradient text-[0.78rem] font-extrabold tracking-[0.34em]">
                СОЗАНДА
              </span>
            </span>
          </button>

          {/* Десктоп-меню */}
          <ul className="hidden items-center gap-9 md:flex">
            {nav.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => go(l.id)}
                  data-cursor
                  className="group relative py-1 text-sm text-fg-muted transition-colors hover:text-fg"
                >
                  {l.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold-400 transition-all duration-500 group-hover:w-full" />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button onClick={() => go('contact')} className="btn-gold hidden text-sm md:inline-flex" data-cursor>
              Тамос
            </button>

            {/* Бургер */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
              aria-label="Меню"
              data-cursor
            >
              <span
                className={`h-px w-6 bg-fg transition-all duration-300 ${open ? 'translate-y-[7px] rotate-45' : ''}`}
              />
              <span className={`h-px w-6 bg-fg transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
              <span
                className={`h-px w-6 bg-fg transition-all duration-300 ${open ? '-translate-y-[7px] -rotate-45' : ''}`}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Мобильное меню */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grain fixed inset-0 z-40 flex flex-col items-center justify-center bg-ink-950/95 backdrop-blur-2xl md:hidden"
          >
            <ul className="flex flex-col items-center gap-7">
              {nav.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i + 0.1, ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
                >
                  <button
                    onClick={() => go(l.id)}
                    className="text-3xl font-extrabold tracking-tight text-fg"
                    data-cursor
                  >
                    {l.label}
                  </button>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * nav.length + 0.1, duration: 0.6 }}
              >
                <button onClick={() => go('contact')} className="btn-gold mt-4" data-cursor>
                  Бо мо дар тамос шавед
                </button>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
