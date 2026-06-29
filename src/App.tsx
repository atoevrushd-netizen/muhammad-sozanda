import { useState } from 'react'
import Background3D from './components/Background3D'
import Loader from './components/Loader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Footer from './components/Footer'
import About from './sections/About'
import Services from './sections/Services'
import Projects from './sections/Projects'
import Contact from './sections/Contact'
import { useSmoothScroll } from './lib/smoothScroll'
import { view } from './lib/viewStore'

export default function App() {
  const [ready, setReady] = useState(false)
  useSmoothScroll()

  const handleReady = () => {
    view.ready = true
    setReady(true)
  }

  return (
    <>
      <Cursor />
      <Loader onComplete={handleReady} />

      {/* Фиксированный 3D-фон */}
      <Background3D />

      <Nav />

      <main className="relative z-10">
        <Hero ready={ready} />

        {/* Контент-оболочка: плавный переход от 3D к тёмному фону */}
        <div style={{ background: 'linear-gradient(180deg, rgba(10,11,13,0) 0%, #0a0b0d 12rem)' }}>
          <About />
          <Services />
          <Projects />
          <Contact />
        </div>

        <Footer />
      </main>

      {/* Плёночный грейн поверх всего */}
      <div className="grain" />
    </>
  )
}
