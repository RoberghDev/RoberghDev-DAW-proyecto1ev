# OKIDOKEI — Frontend

Frontend multipágina para OKIDOKEI, una tienda y escaparate de relojes. El proyecto combina React y Vite para servir las páginas con una capa de JavaScript tradicional que conserva las interacciones del sitio.

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

Se necesita Node.js y npm. Desde la raíz del frontend:

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
| `npm run build` | Genera el sitio multipágina en `dist/`. |
| `npm run preview` | Sirve localmente el contenido de `dist/` para previsualizarlo. |

No hay scripts de tests ni de lint configurados en este frontend.

## Tecnologías

- **React 19** y **React DOM**: montaje de la aplicación y creación de la vista.
- **Vite 6**: servidor de desarrollo, empaquetado y generación de entradas multipágina.
- **html-react-parser**: conversión del HTML heredado importado como texto a nodos que se montan dentro de React.
- **JavaScript**: lógica de interacción, catálogo, persistencia local y API.
- **Three.js**: modelos y carrusel 3D del inicio. La biblioteca está incluida localmente en `public/js/vendor/`; no se descarga desde un CDN.
- **CSS**: estilos propios organizados por tokens, elementos comunes, layouts y páginas.

Las versiones de dependencias y los scripts están en `package.json`; `package-lock.json` fija el árbol instalado.

## Estructura del proyecto

```text
Frontend/
├── index.html                 # Entrada raíz de la página de inicio
├── tienda.html                # Entradas HTML multipágina (una por vista)
├── producto.html
├── colecciones.html
├── carrito.html
├── favoritos.html
├── cuenta.html
├── ayuda.html
├── journal.html
├── nosotros.html
├── legal.html
├── package.json
├── package-lock.json
├── vite.config.js             # Configura automáticamente las entradas *.html
├── services/
│   └── api.js                 # Cliente HTTP de login y registro
├── src/
│   ├── main.jsx               # Carga la plantilla correspondiente y monta React
│   └── legacy-pages/          # Contenido HTML de las páginas, importado como texto
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
│       ├── iconos.js          # Sprite SVG de iconos y emblema
│       ├── datos.js           # Datos de colecciones y productos
│       ├── comun.js           # Estado, utilidades e interacciones comunes
│       ├── cuenta.js          # Formularios de cuenta
│       ├── tienda.js          # Filtros y ordenación del catálogo
│       ├── producto.js        # Ficha de producto
│       ├── carrito.js         # Página del carrito
│       ├── favoritos.js       # Página de favoritos
│       ├── ayuda.js           # Validación del formulario de contacto
│       ├── hero.js            # Carrusel 3D de la portada
│       ├── relojes3d.js       # Geometría, materiales y animación de relojes
│       ├── engranajes.js      # Animación 2D de engranajes
│       └── vendor/
│           ├── three.min.js
│           └── three-LICENSE.txt
└── docs/
    └── Okidokei_FRONTEND.pptx.pdf  # Presentación del proyecto
```

Los once HTML de la raíz son documentos de entrada ligeros con el contenedor `#root`. El contenido de cada página se mantiene en `src/legacy-pages/`. `dist/` es la salida generada por Vite, no el código fuente.

## Arquitectura de la aplicación

1. `vite.config.js` descubre los archivos `*.html` de la raíz y los registra como entradas independientes de Rollup. Por ello, cada página tiene una URL propia y no depende de un router SPA.
2. Cada entrada HTML carga `src/main.jsx` y contiene el elemento `#root`.
3. `src/main.jsx` determina la página a partir del nombre del archivo, importa las plantillas de `src/legacy-pages/` con `?raw` y extrae su título, descripción, contenido y referencias a scripts.
4. React monta el contenido de la plantilla en `#legacy-page-content`. Los scripts inline se eliminan del HTML importado; los scripts externos declarados por la plantilla se cargan en el orden original.
5. Los estilos se importan desde `main.jsx`. La lógica de las páginas continúa en scripts clásicos de `public/js/`, que se sirven como recursos estáticos.

Los scripts comunes se apoyan en datos globales de `datos.js` y en el objeto `OKI` inicializado por `comun.js`. Las páginas incorporan después su módulo específico. La portada carga además Three.js, `relojes3d.js`, `hero.js` y `engranajes.js`.

Los fragmentos de URL (`#...`) identifican el producto en `producto.html` y pueden seleccionar colección o novedades en `tienda.html`; no son rutas del router.

## Páginas

| URL | Plantilla | Funcionalidad principal |
| --- | --- | --- |
| `/` o `/index.html` | `index.html` | Portada, selección de colecciones, carrusel 3D, categorías, productos destacados y contenidos editoriales. |
| `/tienda.html` | `tienda.html` | Catálogo de 12 variantes con filtros de colección, material de caja, correa y novedades; ordenación por destacados, precio o nombre. |
| `/colecciones.html` | `colecciones.html` | Presentación de las seis colecciones: Esqueleto, Heritage, Marine, Noir, Luna y Origine. |
| `/producto.html#<id>` | `producto.html` | Ficha seleccionada por hash, galería, variantes, especificaciones y productos relacionados. |
| `/carrito.html` | `carrito.html` | Líneas del carrito, cantidades, eliminación, subtotal e IVA informativo. |
| `/favoritos.html` | `favoritos.html` | Lista de productos guardados y acción para añadirlos al carrito. |
| `/cuenta.html` | `cuenta.html` | Formularios de inicio de sesión y registro, y panel de sesión. |
| `/ayuda.html` | `ayuda.html` | Información de ayuda y formulario de contacto con validación en el navegador. |
| `/journal.html` | `journal.html` | Artículos editoriales y formulario de newsletter. |
| `/nosotros.html` | `nosotros.html` | Información sobre la marca y el taller. |
| `/legal.html` | `legal.html` | Aviso legal, privacidad y cookies. |

## Datos y persistencia

`public/js/datos.js` define en el cliente seis colecciones y doce productos, con precios, referencias, características y parámetros de representación 3D. Las operaciones de búsqueda y formato de precios también se implementan en ese archivo; no se consulta un servicio de catálogo.

`public/js/comun.js` centraliza:

- API de selección de elementos DOM (`OKI.$`, `OKI.$$`).
- Carrito y favoritos, almacenados en `localStorage` con el prefijo `okidokei.`.
- Contadores, tarjetas de producto, avisos temporales y eventos `oki:carrito` / `oki:favoritos`.
- Minicarrito, menú móvil, buscador, newsletter y detección de imágenes no disponibles.
- Sincronización de la interfaz ante cambios de `localStorage` en otras pestañas.

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
- `public/js/iconos.js` inserta el sprite SVG con el emblema y los iconos usados por las plantillas.
- `public/js/relojes3d.js` genera los modelos con geometría y texturas Canvas; el inicio ofrece una alternativa cuando WebGL no está disponible. Las animaciones consideran la preferencia de movimiento reducido y la visibilidad.

Las páginas hacen referencia a imágenes bajo `public/assets/relojes/`, `public/assets/journal/` y `public/assets/nosotros/`. En el estado actual del árbol, `public/assets/` contiene el emblema y el favicon, pero no esas imágenes. El código muestra un tratamiento alternativo para imágenes fallidas, aunque para completar el diseño visual hay que incorporar los recursos esperados respetando las rutas referenciadas.

## Build y despliegue

`npm run build` genera una salida estática multipágina en `dist/`. El servidor de producción debe publicar los HTML de cada página y sus recursos estáticos conservando la estructura de rutas. No requiere una reescritura general a `index.html` para navegar entre las páginas existentes.

Antes de desplegar:

1. Configura `VITE_API_URL` con la URL accesible del backend y permite CORS si corresponde.
2. Comprueba que las imágenes están disponibles en las rutas bajo `public/assets/`.
3. Ejecuta `npm run build` y verifica la salida con `npm run preview`.

## Estado y límites funcionales

- El catálogo, colecciones y ficha de producto usan datos estáticos del frontend.
- El carrito y favoritos son locales al navegador; no se sincronizan con una cuenta ni con un servidor.
- El inicio de sesión y el registro sí realizan peticiones al backend descrito arriba.
- El envío del formulario de contacto y la suscripción al newsletter solo validan los campos y muestran una confirmación en la página; no envían datos a un servicio.
- El checkout es demostrativo: no procesa pagos ni crea pedidos.
- Las imágenes de producto, journal y taller están referenciadas por las plantillas, pero no están presentes actualmente bajo `public/assets/`.
