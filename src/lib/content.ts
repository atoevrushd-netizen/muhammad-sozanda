/* ============================================================
   КОНТЕНТ САЙТА (таджикский)
   Здесь собран весь текст. Заглушки помечены TODO — заменишь
   реальными данными, когда пришлёшь их.
   ============================================================ */

import { asset } from './asset'

export const brand = {
  name: 'МУҲАММАД СОЗАНДА',
  nameLatin: 'MUHAMMAD SOZANDA',
  kicker: 'Ширкати меъморӣ',
  logoFull: asset('assets/Logo/logo-full.png'),
  logoMark: asset('assets/Logo/logo-monogram.png'),
}

export type NavLink = { id: string; label: string }

export const nav: NavLink[] = [
  { id: 'home', label: 'Асосӣ' },
  { id: 'about', label: 'Дар бораи мо' },
  { id: 'services', label: 'Самтҳо' },
  { id: 'projects', label: 'Лоиҳаҳо' },
  { id: 'contact', label: 'Тамос' },
]

export const hero = {
  eyebrow: 'Ширкати меъморӣ · Тоҷикистон',
  titleTop: 'МУҲАММАД',
  titleBottom: 'СОЗАНДА',
  subtitle:
    'Меъмории оянда бо рӯҳияи Тоҷикистон. Мо фазоеро тарроҳӣ мекунем, ки илҳом мебахшад ва наслҳоро мемонад.',
  ctaPrimary: 'Лоиҳаҳои мо',
  ctaSecondary: 'Тамос',
  scrollHint: 'Поён ҳаракат кунед',
}

export const about = {
  index: '01',
  eyebrow: 'Дар бораи мо',
  title: 'Мо фазоро эҷод мекунем',
  lead:
    '«Муҳаммад Созанда» — дастаи меъморон ва тарроҳон, ки биноҳои муосирро бо эҳтироми анъанаҳои миллӣ эҷод мекунанд.',
  paragraphs: [
    'Ҳар як лоиҳа барои мо ҳикоят аст — дар бораи одамон, шаҳр ва оянда. Мо аз ғоя то таҳвили калид ҳамроҳии пурра пешниҳод мекунем.',
    'Технологияҳои муосири моделсозии 3D ба мизоҷон имкон медиҳанд, ки натиҷаро пеш аз оғози сохтмон бо чашми худ бубинанд.',
  ],
  // TODO: уточнить реальные цифры
  stats: [
    { value: '10+', label: 'соли таҷриба' },
    { value: '120+', label: 'лоиҳаи иҷрошуда' },
    { value: '40+', label: 'шарикони мо' },
    { value: '100%', label: 'диққат ба сифат' },
  ],
}

export type Service = { title: string; text: string }

export const services = {
  index: '02',
  eyebrow: 'Самтҳои фаъолият',
  title: 'Хадамоти мо',
  items: <Service[]>[
    {
      title: 'Лоиҳакашии меъморӣ',
      text: 'Тарҳрезии биноҳои истиқоматӣ ва тиҷоратӣ — аз ғоя то нақшаи омодаи корӣ.',
    },
    {
      title: 'Тарроҳии дохилӣ',
      text: 'Фазоҳои дохилии муосир, бароҳат ва функсионалӣ бо назардошти ҳар тафсил.',
    },
    {
      title: 'Визуализатсияи 3D',
      text: 'Тасвирҳо ва аниматсияи воқеъгароёна пеш аз оғози сохтмон.',
    },
    {
      title: 'Тарҳрезии шаҳрсозӣ',
      text: 'Ҳалли маҷмаавӣ барои маҳаллаҳо ва фазои шаҳрии бароҳат.',
    },
    {
      title: 'Тарроҳии манзара',
      text: 'Боғ, ҳавлӣ ва фазои сабз дар ҳамоҳангии комил бо бино.',
    },
    {
      title: 'Назорати муаллифӣ',
      text: 'Ҳамроҳӣ ва назорат дар тамоми марҳилаҳои сохтмон.',
    },
  ],
}

export type Project = { name: string; category: string; year: string }

export const projects = {
  index: '03',
  eyebrow: 'Корҳои мо',
  title: 'Лоиҳаҳои мунтахаб',
  // TODO: заменить на реальные проекты и добавить фото
  items: <Project[]>[
    { name: 'Бурҷи Душанбе', category: 'Бинои бисёрошёна', year: '2025' },
    { name: 'Маркази тиҷоратии «Сомон»', category: 'Тиҷоратӣ', year: '2024' },
    { name: 'Маҷмааи «Боғи Заррин»', category: 'Истиқоматӣ', year: '2024' },
    { name: 'Осоишгоҳи кӯҳии «Помир»', category: 'Меҳмонхона', year: '2023' },
    { name: 'Маркази фарҳангӣ', category: 'Ҷамъиятӣ', year: '2023' },
    { name: 'Виллаи муосир', category: 'Хусусӣ', year: '2022' },
  ],
}

export const contact = {
  index: '04',
  eyebrow: 'Тамос',
  title: 'Биёед якҷоя эҷод кунем',
  lead: 'Лоиҳаи нав доред? Бо мо дар тамос шавед — мо онро ба воқеият табдил медиҳем.',
  // TODO: заменить на реальные контакты
  phone: '+992 00 000 00 00',
  email: 'info@sozanda.tj',
  address: 'ш. Душанбе, Тоҷикистон',
  socials: <{ label: string; href: string }[]>[
    { label: 'Instagram', href: '#' },
    { label: 'Telegram', href: '#' },
    { label: 'Facebook', href: '#' },
  ],
  form: {
    name: 'Ном',
    contact: 'Телефон ё почта',
    message: 'Паёми шумо',
    submit: 'Фиристодан',
  },
}

export const footer = {
  rights: '© 2026 Муҳаммад Созанда. Ҳамаи ҳуқуқҳо ҳифз шудаанд.',
  madeWith: 'Тарроҳӣ ва таҳия бо диққат ба тафсил.',
  // Атрибуция используемых ассетов (HDRI — Poly Haven CC0; модели — Sketchfab)
  credits:
    'Осмон: Poly Haven (CC0) · Моделҳои 3D: муаллифони Sketchfab',
}
