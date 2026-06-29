/* Лёгкий внешний стор: мост между DOM (скролл/мышь) и циклом рендера 3D.
   Обновляется слушателями в App, читается в useFrame без ре-рендеров React. */

export const view = {
  scrollY: 0, // пиксели
  scrollProgress: 0, // 0..1 по всей странице
  heroProgress: 0, // 0..1 в пределах первого экрана
  mx: 0, // нормализованная мышь X (-1..1)
  my: 0, // нормализованная мышь Y (-1..1)
  vw: typeof window !== 'undefined' ? window.innerWidth : 1280,
  vh: typeof window !== 'undefined' ? window.innerHeight : 800,
  // целевые значения для плавной интерполяции курсора/параллакса
  tmx: 0,
  tmy: 0,
  // сцена загружена и лоадер ушёл — можно запускать «въезд» камеры
  ready: false,
}

export function isLowPower(): boolean {
  if (typeof window === 'undefined') return false
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const small = Math.min(window.innerWidth, window.innerHeight) < 700
  const fewCores = (navigator.hardwareConcurrency ?? 8) <= 4
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return coarse || small || fewCores || reduced
}
