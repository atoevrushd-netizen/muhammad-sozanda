/* Префикс базового пути для ассетов.
   Нужно, чтобы сайт работал не только в корне домена, но и в под-папке
   (GitHub Pages обычно отдаёт проект по адресу username.github.io/<repo>/).
   В деве import.meta.env.BASE_URL = '/', в проде = значение vite `base`. */
export const asset = (path: string) =>
  import.meta.env.BASE_URL.replace(/\/$/, '') + '/' + path.replace(/^\//, '')
