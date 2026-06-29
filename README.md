# Муҳаммад Созанда — сайт-визитка

Архитектурная компания. Тёмный sci-fi дизайн, 3D-панорама города на старте
(Three.js / React Three Fiber), HDRI-небо, кинематографичная камера, плавные
анимации. Сайт на таджикском языке, шрифт Montserrat.

## Запуск

```bash
npm install
npm run dev      # http://localhost:5173 — режим разработки
npm run build    # production-сборка в dist/
npm run preview  # просмотр собранной версии
```

> Для 3D нужна видеокарта с WebGL. На реальном GPU bloom, отражения и фокусный
> блюр выглядят заметно чище, чем на встроенной графике.

## Где что менять

| Что | Файл |
|-----|------|
| **Все тексты, контакты, проекты, услуги** | [src/lib/content.ts](src/lib/content.ts) |
| Палитра, шрифты, общие стили | [src/index.css](src/index.css) |
| 3D-сцена (здания, материалы) | [src/three/City.tsx](src/three/City.tsx), [src/three/procedural.ts](src/three/procedural.ts) |
| Свет, солнце, HDRI, туман | [src/three/SceneCanvas.tsx](src/three/SceneCanvas.tsx) |
| Анимация камеры | [src/three/CameraRig.tsx](src/three/CameraRig.tsx) |
| Пост-обработка (EEVEE-эффекты) | [src/three/Effects.tsx](src/three/Effects.tsx) |

Места с заглушками помечены `TODO` в `content.ts` (телефон, e-mail, адрес,
цифры статистики, список и фото проектов).

## Готовые ассеты

- **Логотип** — извлечён из PDF: монограмма [logo-monogram.png](public/assets/Logo/logo-monogram.png),
  полный [logo-full.png](public/assets/Logo/logo-full.png).
- **Favicon** — набор в [public/favicon/](public/favicon/) (подключён в `index.html`).
- **HDRI-небо** — `citrus_orchard_road_puresky` (2k) в [public/assets/hdri/](public/assets/hdri/).

## 3D-город (реальная модель)

В сцене стоит реальная модель квартала (Blender → GLB). Камера — кодовая
(кинематографичный «въезд» + облёт по скроллу + параллакс), т.к. в модели
анимации камеры нет.

### Модель сжата для веба

- Исходник (~70 МБ) лежит в **`model-source/`** (в git не коммитится).
- В сборку идёт сжатая **`public/models/city.glb`** (~11 МБ): текстуры **WebP**
  (≤1024 px) + геометрия **meshopt**. На вебе подхватывается автоматически
  (WebP читает three, meshopt — drei) — никаких декодеров вручную не нужно.

**Пересжать после ре-экспорта из Blender:** положи новый `.glb` в `model-source/`
и выполни:

```bash
npm run compress   # → public/models/city.glb
```

> Через glTF не переносятся настройки рендера EEVEE (bloom, AO, SSR, туман,
> lens flare) — они воссоздаются в реальном времени пост-обработкой на сайте.
> Если позже сделаешь анимацию камеры в Blender (Export ▸ glTF: ✔ Cameras,
> ✔ Animation, ✔ Bake All) — камеру сайта можно посадить на неё.

### Оптимизация под мобильные

- Тяжёлый рендер **ставится на паузу**, когда 3D-герой уходит за контент.
- На слабых устройствах: 1k HDRI вместо 2k, отключается стекло (transmission),
  меньше тени, ниже dpr и часть эффектов (`isLowPower()` в `src/lib/viewStore.ts`).

## Производительность

На слабых/мобильных устройствах автоматически включается облегчённый режим
(меньше зданий, упрощённые отражения, без части эффектов) — см. `isLowPower()`
в [src/lib/viewStore.ts](src/lib/viewStore.ts).

## Лицензии ассетов

- HDRI — [Poly Haven](https://polyhaven.com/a/citrus_orchard_road_puresky) (CC0).
- 3D-модели зданий — со Sketchfab (сохраните attribution авторов, указан в подвале).
