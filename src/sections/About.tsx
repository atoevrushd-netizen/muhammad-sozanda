import Reveal from '../components/Reveal'
import Stat from '../components/Stat'
import { about } from '../lib/content'

export default function About() {
  return (
    <section id="about" className="relative py-28 sm:py-36">
      <div className="container-x">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          {/* Левая колонка */}
          <div>
            <Reveal>
              <div className="mb-6 flex items-center gap-4">
                <span className="section-index">{about.index}</span>
                <span className="eyebrow">{about.eyebrow}</span>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <h2 className="section-title max-w-xl text-fg">{about.title}</h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-fg">{about.lead}</p>
            </Reveal>

            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.15 + i * 0.05}>
                <p className="mt-5 max-w-xl leading-relaxed text-fg-muted">{p}</p>
              </Reveal>
            ))}
          </div>

          {/* Правая колонка — статистика */}
          <Reveal delay={0.15} className="self-end">
            <div className="glass rounded-lg p-8 sm:p-10">
              <div className="grid grid-cols-2 gap-8">
                {about.stats.map((s) => (
                  <Stat key={s.label} value={s.value} label={s.label} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
