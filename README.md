# OKIDOKEI — Frontend

Frontend de OKIDOKEI, una tienda y escaparate de relojes: una SPA con React, React Router y Vite. Las once páginas y los efectos visuales de la portada (carrusel 3D y engranajes) son componentes React servidos desde un único `index.html`.

## Contenido

- [Requisitos y puesta en marcha](#requisitos-y-puesta-en-marcha)
- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Arquitectura de la aplicación](#arquitectura-de-la-aplicación)
- [Páginas](#páginas)
- [Datos y persistencia](#datos-y-persistencia)
- [API](#api)
- [Estilos, fuentes y recursos](#estilos-fuentes-y-recursos)
- [Build y despliegue](#build-y-despliegue)
- [Estado y límites funcionales](#estado-y-límites-funcionales)

## Requisitos y puesta en marcha

Se necesita Node.js 22.22 o superior (lo exige React Router 8) y npm. Desde la raíz del frontend:

```bash
npm install
npm run dev
```

Vite muestra en la terminal la dirección local de desarrollo. Para generar y previsualizar la versión de producción:

```bash
npm run build
npm run preview
```

Los comandos disponibles están definidos en `package.json`:

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo de Vite. |
| `npm run build` | Genera la SPA en `dist/` (un único `index.html` y sus recursos). |
| `npm run preview` | Sirve localmente el contenido de `dist/` para previsualizarlo. |
| `npm test` | Ejecuta las pruebas de navegador con Playwright. |
| `npm run lint` | Analiza JavaScript y JSX con ESLint. |

### Pruebas y lint

Playwright comprueba las once rutas (carga directa y navegación interna), las redirecciones de las URLs antiguas y la paridad con la versión original: DOM, comportamiento de cada página, estado compartido y ciclo de vida de los efectos 3D. La primera vez, instala Chromium con:

```bash
npx playwright install chromium
```

Después ejecuta las comprobaciones con:

```bash
npm test
npm run lint
```

Las pruebas arrancan Vite automáticamente en `127.0.0.1:4173` y lo detienen al terminar. Se ejecutan con 3 workers porque la portada usa WebGL por software en el navegador de pruebas.

enlace de la web en producción: https://robergh-dev-daw-proyecto1ev.vercel.app/

## Tecnologías

- **React 19** y **React DOM**: montaje de la aplicación y creación de la vista.
- **Vite 6**: servidor de desarrollo y empaquetado de la SPA.
- **React Router 8**: rutas de las once páginas y navegación sin recargar el documento.
- **JavaScript (JSX)**: componentes, catálogo, estado compartido, persistencia local y API.
- **Three.js**: modelos y carrusel 3D del inicio. La biblioteca está incluida localmente en `public/js/vendor/` y `src/visual/three.js` la carga una sola vez cuando la portada la necesita; no se descarga desde un CDN.
- **CSS**: estilos propios organizados por tokens, elementos comunes, layouts y páginas.
- **Vercel**: servicios de hosting

Las versiones de dependencias y los scripts están en `package.json`; `package-lock.json` fija el árbol instalado.

## Estructura del proyecto

```text
Frontend/
├── index.html                 # Única entrada de la SPA (contenedor #root)
├── package.json
├── package-lock.json
├── vite.config.js             # Configuración de Vite para la SPA
├── services/
│   └── api.js                 # Cliente HTTP de login y registro
├── src/
│   ├── main.jsx               # Punto único de montaje (BrowserRouter + App)
│   ├── App.jsx                # Layout, rutas y navegación interna
│   ├── rutas.js               # Claves de página y traducción de URLs antiguas
│   ├── navegacion.js          # Contexto con la función de navegación
│   ├── data.js                # Catálogo único (colecciones y productos)
│   ├── store.jsx              # Contexto React del estado compartido y aviso global
│   ├── store/                 # storage.js (carrito, favoritos, localStorage) y ui.js (aviso global)
│   ├── pages/                 # Las once páginas (index.jsx, tienda.jsx, producto.jsx…)
│   ├── components/            # SiteShell (cabecera, pie, minicarrito), tarjetas, formularios, iconos
│   └── visual/                # Motor del carrusel 3D, modelos de relojes, engranajes y carga de Three.js
├── css/
│   ├── tokens.css             # Colores, tipografías y medidas compartidas
│   ├── base.css               # Reset, estilos base, fuentes y accesibilidad
│   ├── components.css         # Componentes reutilizables
│   ├── layouts.css            # Estructuras y composiciones
│   ├── hero.css               # Hero y carrusel de portada
│   ├── pages.css              # Estilos específicos de las páginas
│   └── responsive.css         # Adaptaciones a tamaños de pantalla
├── fonts/                     # Fuentes WOFF2 locales
├── public/
│   ├── assets/                # Recursos estáticos servidos desde /assets
│   └── js/
│       └── vendor/
│           ├── three.min.js
│           └── three-LICENSE.txt
├── tests/                     # Pruebas de Playwright (paridad con la versión original)
└── docs/
    ├── Okidokei_FRONTEND-V1.0.pptx.pdf  # Presentación del proyecto
    ├── Plan_migracion_React_OKIDOKEI.pdf  # Plan de migración a React
    └── migracion/             # Registro de la migración a React (una nota por fase)
```

`index.html` es la única entrada y solo contiene el contenedor `#root`. El contenido de cada página es un componente de `src/pages/`. `dist/` es la salida generada por Vite, no el código fuente.

## Arquitectura de la aplicación

1. `index.html` carga `src/main.jsx`, que monta `App` dentro de `BrowserRouter` (React Router) e importa los estilos.
2. `src/App.jsx` define las rutas de las once páginas y un layout común: cabecera, página, pie y minicarrito dentro de `StoreProvider`. Cada página exporta su título y meta descripción.
3. Los enlaces internos son `<a href="/ruta">` normales: el layout intercepta sus clics y navega con el router, sin recargar el documento. Ir a otra página reinicia la interfaz (menús, buscador, minicarrito, filtros) y la sitúa arriba o en la sección del `#fragmento`, como al cargar una página; cambiar solo el fragmento de la página actual, o pasar de un producto a otro, no la reinicia.
4. Las URLs antiguas (`/tienda.html`, `/producto.html#<id>`…) se redirigen a su ruta nueva y las desconocidas a la portada (`src/rutas.js`).
5. La portada monta `HeroColecciones` (carrusel 3D, con `src/visual/carrusel3d.js` y `src/visual/relojes3d.js`) y `Engranajes` (`src/visual/engranajes.js`). Ambos crean su animación al montarse y la destruyen al desmontarse: cancelan el `requestAnimationFrame`, retiran listeners y observers y liberan las geometrías, texturas, materiales y el contexto WebGL.

El producto se identifica por la ruta (`/producto/<id>`). En la tienda, el fragmento (`/tienda#marine`, `/tienda#novedades`, `/tienda#limitadas`) selecciona colección o novedades, como antes.

## Páginas

| Ruta | Componente | Funcionalidad principal |
| --- | --- | --- |
| `/` | `src/pages/index.jsx` | Portada, selección de colecciones, carrusel 3D, categorías, productos destacados y contenidos editoriales. |
| `/tienda` | `src/pages/tienda.jsx` | Catálogo de 12 variantes con filtros de colección, material de caja, correa y novedades; ordenación por destacados, precio o nombre. |
| `/colecciones` | `src/pages/colecciones.jsx` | Presentación de las seis colecciones: Esqueleto, Heritage, Marine, Noir, Luna y Origine. |
| `/producto/<id>` | `src/pages/producto.jsx` | Ficha seleccionada por la ruta, galería, especificaciones y productos relacionados. |
| `/carrito` | `src/pages/carrito.jsx` | Líneas del carrito, cantidades, eliminación, subtotal e IVA informativo. |
| `/favoritos` | `src/pages/favoritos.jsx` | Lista de productos guardados y acción para añadirlos al carrito. |
| `/cuenta` | `src/pages/cuenta.jsx` | Formularios de inicio de sesión y registro, y panel de sesión. |
| `/ayuda` | `src/pages/ayuda.jsx` | Información de ayuda y formulario de contacto con validación en el navegador. |
| `/journal` | `src/pages/journal.jsx` | Artículos editoriales y formulario de newsletter. |
| `/nosotros` | `src/pages/nosotros.jsx` | Información sobre la marca y el taller. |
| `/legal` | `src/pages/legal.jsx` | Aviso legal, privacidad y cookies. |

Las URLs de la antigua web multipágina siguen funcionando: `/index.html` → `/`, `/<página>.html#<fragmento>` → `/<página>#<fragmento>` y `/producto.html#<id>` → `/producto/<id>`. Cualquier otra ruta desconocida lleva a la portada.

## Datos y persistencia

`src/data.js` es la única fuente del catálogo: define en el cliente seis colecciones y doce productos, con precios, referencias, características y parámetros de representación 3D. Las operaciones de búsqueda y formato de precios también se implementan en ese archivo; no se consulta un servicio de catálogo.

El estado compartido se reparte así:

- `src/store/storage.js`: carrito y favoritos, almacenados en `localStorage` con el prefijo `okidokei.`, y eventos `oki:carrito` / `oki:favoritos`.
- `src/store/ui.js`: canal del aviso temporal global.
- `src/store.jsx`: contexto React sobre los dos módulos anteriores; sincroniza la interfaz ante cambios de `localStorage` en otras pestañas.

La clave `usuario` mantiene los datos básicos visibles de la sesión y `token` almacena el token devuelto por el login. Si `localStorage` no está disponible, las utilidades compartidas recurren a memoria para esa carga de página; ese estado alternativo no persiste al recargar.

## API

El cliente está en `services/api.js`. La URL base se configura con la variable de entorno de Vite `VITE_API_URL`; si no se define, se utiliza:

```text
http://localhost:3000/api
```

Endpoints usados:

| Método | Endpoint | Datos enviados |
| --- | --- | --- |
| `POST` | `/usuarios/login` | `{ "email": "...", "password": "..." }` |
| `POST` | `/usuarios/registro` | `{ "nombreUsuario": "...", "password": "...", "email": "...", "numTlf": "...", "rol": "USER" }` |

El inicio de sesión espera una respuesta JSON con `token`. El registro trata el cuerpo de respuesta como texto; después, la página de cuenta inicia sesión con las credenciales recién registradas. El backend no forma parte de este directorio. Si frontend y API se sirven desde distintos orígenes, el servidor de API debe permitir la petición mediante CORS.

Para configurar una URL propia, crea un archivo `.env.local` en la raíz:

```dotenv
VITE_API_URL=http://localhost:3000/api
```

Las variables `VITE_*` se incorporan al código cliente: no deben contener secretos.

## Estilos, fuentes y recursos

- `css/tokens.css` define la paleta cobre/negro/marfil, las familias tipográficas y medidas globales.
- `css/base.css` contiene reglas base, fuentes locales, foco visible y respeto por `prefers-reduced-motion`.
- `css/components.css`, `css/layouts.css` y `css/pages.css` separan componentes, estructuras y estilos de página.
- `css/hero.css` y `css/responsive.css` cubren el carrusel de portada y los breakpoints adaptables.
- `fonts/` contiene las familias Cinzel, Cormorant Garamond y Jost en WOFF2.
- `src/components/IconSprite.jsx` inserta el sprite SVG con el emblema y los iconos; el trazado del emblema está en `src/components/emblema.js` (también lo usan las esferas 3D de `src/visual/relojes3d.js`).
- `src/visual/relojes3d.js` genera los modelos con geometría y texturas Canvas; el inicio ofrece una alternativa cuando WebGL no está disponible. Las animaciones consideran la preferencia de movimiento reducido y la visibilidad.

Las páginas hacen referencia a imágenes bajo `public/assets/relojes/`, `public/assets/journal/` y `public/assets/nosotros/`. En el estado actual del árbol, `public/assets/` contiene el emblema y el favicon, pero no esas imágenes. El código muestra un tratamiento alternativo para imágenes fallidas, aunque para completar el diseño visual hay que incorporar los recursos esperados respetando las rutas referenciadas.

## Build y despliegue

`npm run build` genera la SPA en `dist/`: `index.html`, los recursos empaquetados en `dist/assets/` y los estáticos de `public/` (imágenes y `js/vendor/three.min.js`).

El servidor de producción debe servir los archivos que existan y devolver `dist/index.html` para cualquier otra ruta (*fallback* de SPA), de modo que `/tienda`, `/producto/origine` o las URLs antiguas `*.html` funcionen al abrirlas directamente o al recargar. `npm run preview` ya se comporta así. Ejemplo para nginx:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

La aplicación se sirve desde la raíz del dominio (rutas absolutas `/assets/…`, `/js/…`).

Antes de desplegar:

1. Configura `VITE_API_URL` con la URL accesible del backend y permite CORS si corresponde.
2. Comprueba que las imágenes están disponibles en las rutas bajo `public/assets/`.
3. Configura el *fallback* a `index.html` en el servidor.
4. Ejecuta `npm run build` y verifica la salida con `npm run preview`.

## Estado y límites funcionales

- El catálogo, colecciones y ficha de producto usan datos estáticos del frontend.
- El carrito y favoritos son locales al navegador; no se sincronizan con una cuenta ni con un servidor.
- El inicio de sesión y el registro sí realizan peticiones al backend descrito arriba.
- El envío del formulario de contacto y la suscripción al newsletter solo validan los campos y muestran una confirmación en la página; no envían datos a un servicio.
- El checkout es demostrativo: no procesa pagos ni crea pedidos.
- Las imágenes de producto, journal y taller están referenciadas por las páginas, pero no están presentes actualmente bajo `public/assets/`.
