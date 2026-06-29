import Reveal from '../components/Reveal'
import { contact } from '../lib/content'

export default function Contact() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('name') || '')
    const c = String(fd.get('contact') || '')
    const msg = String(fd.get('message') || '')
    const body = `Ном: ${name}\nТамос: ${c}\n\n${msg}`
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
      'Дархост аз сомона',
    )}&body=${encodeURIComponent(body)}`
  }

  const fieldCls =
    'w-full border-b border-gold-400/20 bg-transparent py-3 text-fg placeholder:text-fg-dim outline-none transition-colors focus:border-gold-400'

  return (
    <section id="contact" className="relative py-28 sm:py-36">
      <div className="container-x">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Левая колонка — инфо */}
          <div>
            <Reveal>
              <div className="mb-6 flex items-center gap-4">
                <span className="section-index">{contact.index}</span>
                <span className="eyebrow">{contact.eyebrow}</span>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="section-title max-w-md text-fg">{contact.title}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-7 max-w-md text-lg leading-relaxed text-fg-muted">{contact.lead}</p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-12 space-y-6">
                <ContactRow label="Телефон" value={contact.phone} href={`tel:${contact.phone.replace(/\s/g, '')}`} />
                <ContactRow label="Почтаи электронӣ" value={contact.email} href={`mailto:${contact.email}`} />
                <ContactRow label="Нишонӣ" value={contact.address} />
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-10 flex flex-wrap gap-4">
                {contact.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="btn-ghost px-5 py-2 text-sm"
                    data-cursor
                    target="_blank"
                    rel="noreferrer"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Правая колонка — форма */}
          <Reveal delay={0.12}>
            <form onSubmit={onSubmit} className="glass rounded-lg p-8 sm:p-10">
              <div className="space-y-7">
                <div>
                  <label className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-gold-600">
                    {contact.form.name}
                  </label>
                  <input name="name" required className={fieldCls} placeholder="—" data-cursor />
                </div>
                <div>
                  <label className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-gold-600">
                    {contact.form.contact}
                  </label>
                  <input name="contact" required className={fieldCls} placeholder="—" data-cursor />
                </div>
                <div>
                  <label className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-gold-600">
                    {contact.form.message}
                  </label>
                  <textarea name="message" rows={4} className={`${fieldCls} resize-none`} placeholder="—" data-cursor />
                </div>
                <button type="submit" className="btn-gold w-full justify-center" data-cursor>
                  {contact.form.submit}
                  <span aria-hidden>→</span>
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function ContactRow({ label, value, href }: { label: string; value: string; href?: string }) {
  const content = (
    <div className="group flex flex-col gap-1.5 border-b border-gold-400/10 pb-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-fg-dim">{label}</span>
      <span className="wrap-break-word text-lg text-fg transition-colors group-hover:text-gold-200 sm:text-right">
        {value}
      </span>
    </div>
  )
  return href ? (
    <a href={href} data-cursor>
      {content}
    </a>
  ) : (
    content
  )
}
