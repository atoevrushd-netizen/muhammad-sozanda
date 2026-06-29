import { motion, useMotionValue, useSpring } from 'framer-motion'
import Reveal from '../components/Reveal'
import { projects, type Project } from '../lib/content'

function ProjectCard({ p, i }: { p: Project; i: number }) {
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 150, damping: 18 })
  const sry = useSpring(ry, { stiffness: 150, damping: 18 })

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * 9)
    rx.set(-py * 9)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000 }}
      className="group relative"
      data-cursor
    >
      {/* Визуал-плейсхолдер (заменишь фото проекта) */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg hairline">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(160deg, #11161d 0%, #0a0d12 55%, #070a0e 100%)',
          }}
        />
        <div className="grid-overlay absolute inset-0 opacity-40" />
        {/* силуэт «башни» */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-2 px-10 pb-0 opacity-30">
          <div className="h-28 w-7 bg-gradient-to-t from-gold-700/40 to-transparent" />
          <div className="h-44 w-9 bg-gradient-to-t from-gold-600/50 to-transparent" />
          <div className="h-32 w-6 bg-gradient-to-t from-gold-700/40 to-transparent" />
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: 'radial-gradient(90% 60% at 50% 30%, rgba(201,180,136,0.16), transparent 60%)' }}
        />
        <span className="absolute left-5 top-4 font-mono text-5xl font-bold text-fg/5 transition-colors duration-500 group-hover:text-gold-400/20">
          {String(i + 1).padStart(2, '0')}
        </span>
        <div className="absolute right-4 top-4 translate-y-1 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-400/40 text-gold-300">
            ↗
          </span>
        </div>
      </div>

      {/* Подпись */}
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-fg transition-colors group-hover:text-gold-200">
            {p.name}
          </h3>
          <p className="mt-1 text-sm text-fg-muted">{p.category}</p>
        </div>
        <span className="font-mono text-sm text-gold-600">{p.year}</span>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="relative py-28 sm:py-36">
      <div className="container-x">
        <Reveal>
          <div className="mb-6 flex items-center gap-4">
            <span className="section-index">{projects.index}</span>
            <span className="eyebrow">{projects.eyebrow}</span>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="section-title mb-14 max-w-2xl text-fg sm:mb-20">{projects.title}</h2>
        </Reveal>

        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {projects.items.map((p, i) => (
            <Reveal key={p.name} delay={(i % 3) * 0.08}>
              <ProjectCard p={p} i={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
