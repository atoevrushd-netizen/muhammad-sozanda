import { useEffect, useRef, useState } from 'react'
import { asset } from '../lib/asset'

/* Фиксированный фон-герой: заранее отрендеренный в Blender ролик (камера-наезд
   город), без WebGL — на телефоне нечего считать, лагать нечему. Видео декодит
   железо, проигрывается один раз и замирает на финальном широком кадре.
   Десктоп — горизонтальный ролик, телефон — вертикальный (выбор по ориентации,
   монтируется только нужный). Постер = первый кадр → бесшовный старт. Сверху —
   скримы и виньетка для читабельности текста + лёгкий дрейф через CSS. */
export default function Background3D() {
  const [portrait, setPortrait] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(orientation: portrait)').matches,
  )
  const videoRef = useRef<HTMLVideoElement>(null)

  // следим за сменой ориентации — монтируем нужный ролик
  useEffect(() => {
    const mq = window.matchMedia('(orientation: portrait)')
    const onChange = (e: MediaQueryListEvent) => setPortrait(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const key = portrait ? 'mobile' : 'desktop'

  // подстраховка автоплея: пробуем стартовать вручную при монтировании ролика
  useEffect(() => {
    videoRef.current?.play().catch(() => {})
  }, [key])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-ink-950">
      <video
        key={key}
        ref={videoRef}
        className="hero-video absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        playsInline
        preload="auto"
        poster={asset(`hero/hero-${key}.webp`)}
        aria-hidden="true"
      >
        <source src={asset(`hero/hero-${key}.webm`)} type="video/webm" />
        <source src={asset(`hero/hero-${key}.mp4`)} type="video/mp4" />
      </video>

      {/* затемнение книзу — чтобы контент читался */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(6,7,10,0.32) 0%, rgba(6,7,10,0.06) 24%, transparent 46%, rgba(6,7,10,0.66) 78%, rgba(6,7,10,0.97) 100%)',
        }}
      />
      {/* затемнение слева — под геройский заголовок */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, rgba(6,7,10,0.62) 0%, rgba(6,7,10,0.2) 32%, transparent 58%)',
        }}
      />
      {/* мягкая виньетка по краям */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: 'inset 0 0 220px 50px rgba(0,0,0,0.55)' }}
      />
    </div>
  )
}
