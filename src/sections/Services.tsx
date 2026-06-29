import { motion } from 'framer-motion'
import Reveal from '../components/Reveal'
import { services } from '../lib/content'

export default function Services() {
  return (
    <section id="services" className="relative py-28 sm:py-36">
      <div className="container-x">
        <Reveal>
          <div className="mb-6 flex items-center gap-4">
            <span className="section-index">{services.index}</span>
            <span className="eyebrow">{services.eyebrow}</span>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="section-title mb-14 max-w-2xl text-fg sm:mb-20">{services.title}</h2>
        </Reveal>

        <div className="grid gap-px overflow-hidden rounded-lg bg-gold-400/10 sm:grid-cols-2 lg:grid-cols-3">
          {services.items.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 0.08}>
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                data-cursor
                className="group relative h-full overflow-hidden bg-ink-900 p-8 sm:p-10"
              >
                {/* фоновое свечение при наведении */}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: 'radial-gradient(120% 80% at 50% 0%, rgba(201,180,136,0.10), transparent 60%)' }} />

                <div className="relative">
                  <div className="mb-7 flex items-center justify-between">
                    <span className="font-mono text-xs tracking-widest text-gold-600">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-gold-500 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 -translate-x-2">
                      →
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-fg">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-fg-muted">{s.text}</p>
                </div>

                {/* нижняя золотая линия */}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-gold-500 to-gold-200 transition-all duration-500 group-hover:w-full" />
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
