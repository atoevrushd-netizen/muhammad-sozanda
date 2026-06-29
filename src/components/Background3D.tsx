import SceneCanvas from '../three/SceneCanvas'

/* Фиксированный 3D-фон + скримы для читабельности текста поверх сцены. */
export default function Background3D() {
  return (
    <div className="fixed inset-0 z-0">
      <SceneCanvas />

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
