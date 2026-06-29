import { brand, nav, footer } from '../lib/content'
import { scrollToId } from '../lib/smoothScroll'

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-gold-400/10 bg-ink-950 pt-16">
      <div className="container-x">
        <div className="grid gap-10 pb-14 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Бренд */}
          <div>
            <div className="flex items-center gap-3">
              <img src={brand.logoMark} alt={brand.name} className="h-11 w-11 rounded-[6px] object-cover ring-1 ring-gold-400/25" />
              <div className="leading-none">
                <div className="text-sm font-extrabold tracking-[0.22em] text-fg">МУҲАММАД</div>
                <div className="text-gold-gradient text-sm font-extrabold tracking-[0.34em]">СОЗАНДА</div>
              </div>
            </div>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-fg-muted">{footer.madeWith}</p>
          </div>

          {/* Навигация */}
          <div>
            <div className="mb-5 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-gold-600">
              Навигатсия
            </div>
            <ul className="space-y-3">
              {nav.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => scrollToId(l.id)}
                    className="text-sm text-fg-muted transition-colors hover:text-gold-200"
                    data-cursor
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Наверх */}
          <div className="flex flex-col items-start md:items-end">
            <button
              onClick={() => scrollToId('home')}
              className="btn-ghost"
              data-cursor
            >
              <span aria-hidden>↑</span> Ба боло
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-gold-400/10 py-7 text-xs text-fg-dim sm:flex-row sm:items-center sm:justify-between">
          <span>{footer.rights}</span>
          <span className="font-mono tracking-wide">{footer.credits}</span>
        </div>
      </div>
    </footer>
  )
}
