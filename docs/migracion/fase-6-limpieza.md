# Fase 6 · Limpieza y cierre de la migración

## Auditoría de restos del sistema antiguo
Búsqueda en código, pruebas y configuración de `legacy-pages`, `public/js` (salvo `vendor/`), `window.OKI`, `OKI_API`, `OKI3D`, `OKI_EMBLEMA`, `html-react-parser`, `ReactPreview`, `?react=1`, `comun.js`, `datos.js` e `iconos.js`: no queda ninguna dependencia activa. Las menciones que siguen en comentarios y en estas notas son históricas.

## Retirado
- Dependencia `html-react-parser` (ya no se importa en ningún sitio).
- Bloque de ESLint para los scripts clásicos de `public/js/` (globales `OKI`, `OKI3D`, `OKI_API`…): ya no existen esos scripts.
- `abrirMiniCarrito` de `src/store/ui.js` (solo lo usaba el puente con los scripts clásicos) y los campos del store que nadie usaba (`revision`, `toast`, `read`, `save`, `forget`; los tres últimos eran del antiguo `AccountPage`).
- Exportación innecesaria de `PAGINAS_SIMPLES` en `src/rutas.js`.
- Nombre heredado `OKI3D` en `src/visual/carrusel3d.js` (ahora `modelos`).
- Pruebas que comparaban la "vista antigua" con la "vista React" mediante `?react=1`: sustituidas por pruebas de persistencia del estado al navegar y al recargar.

## Dependencias
- `dependencies`: `react` y `react-dom` (`^19.3.1`, lo que exige React Router 8) y `react-router` (`8.5.1`, versión fija).
- `devDependencies`: Vite, ESLint (con `eslint-plugin-react` y `globals`) y Playwright.
- `engines.node`: `>=22.22.0` (requisito de React Router 8).
- `public/`: `assets/favicon.svg` (index.html), `assets/emblema.svg` (`css/base.css`) y `js/vendor/three.min.js` con su licencia. Todos en uso.

## Verificación final
- Instalación desde cero en una copia limpia del proyecto (`npm ci`), `npm run lint`, `npm run build` y suite completa de Playwright.
- `dist/` contiene un único `index.html`, los recursos empaquetados en `assets/` y los estáticos de `public/`.

## Comportamientos de la versión original que se conservan a propósito
- La cabecera no refleja el inicio o cierre de sesión hasta el siguiente cambio de carrito/favoritos o una recarga.
- El login valida contraseñas de 3 caracteres aunque el mensaje diga «al menos 6», y exige correos terminados en `.com`; guarda el correo como nombre.
- Las cards de la tienda son las de la maqueta original.

## Único cambio de comportamiento
- Las URLs con ancla bajan a su sección (fase 5): resolvía un fallo que ya existía antes de la migración.
