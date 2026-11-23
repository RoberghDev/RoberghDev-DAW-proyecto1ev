# Fase 5 · Aplicación SPA con React Router

## Qué se ha hecho
- **React Router 8.5.1** (versión fija; la 8.5.2 era de hace menos de dos semanas).
- **Un único `index.html`**: se eliminan los otros diez HTML de la raíz. `vite.config.js` ya no registra entradas multipágina (`appType: 'spa'`).
- **`src/main.jsx`** es el punto único de montaje (`BrowserRouter` + `App`). Se retira la vista previa `?react=1` (`src/ReactPreview.jsx`).
- **`src/App.jsx`**: rutas de las once páginas y layout común (cabecera, página, pie, minicarrito).
- **Enlaces**: los `href` internos pasan de `tienda.html`/`producto.html#id` a `/tienda`/`/producto/id`. Se mantienen como `<a href>` (mismo HTML); el layout intercepta los clics y navega con el router. El buscador (Enter) y el clic en el reloj frontal del carrusel 3D usan la misma función de navegación.
- **Recursos con ruta absoluta** (`/assets/…`, `/js/vendor/three.min.js`): con rutas como `/producto/origine`, las relativas apuntarían a `/producto/assets/…`.

## Rutas

| Ruta | Página |
| --- | --- |
| `/` | Inicio |
| `/tienda` (con `#<colección>`, `#novedades`, `#limitadas`) | Tienda |
| `/colecciones` | Colecciones |
| `/producto/:id` (y `/producto`) | Ficha (id desconocido o ausente → primer reloj, como antes) |
| `/carrito`, `/favoritos`, `/cuenta`, `/ayuda`, `/journal`, `/nosotros`, `/legal` | Resto de páginas |

## Política de URLs antiguas
- `/index.html` → `/`
- `/<página>.html` y `/<página>.html#<fragmento>` → `/<página>` y `/<página>#<fragmento>`
- `/producto.html#<id>` → `/producto/<id>`; `/producto.html` → `/producto`
- Cualquier otra ruta → `/` (la web multipágina también mostraba la portada para páginas desconocidas).

Las redirecciones sustituyen la entrada del historial (no queda la URL antigua al volver atrás).

## Equivalencia con la navegación multipágina
- Ir a otra página equivale a cargarla: se reinicia la interfaz (menú móvil, buscador, minicarrito, aviso, filtros) y se empieza arriba o en la sección del `#fragmento`.
- Cambiar solo el `#fragmento` de la página actual no la reinicia (por ejemplo, `/tienda` → `/tienda#novedades` conserva los filtros de caja y correa, igual que antes).
- Pasar de un producto a otro no reinicia la página (antes era el `#id` dentro de `producto.html`): cantidad a 1 y subida suave, como hacía `producto.js`.
- Atrás/adelante funcionan entre páginas, fragmentos y productos.

## Cambio de comportamiento intencionado
- **Anclas**: al abrir una URL con fragmento (`/legal#privacidad`, `/ayuda.html#garantia`) la página baja a esa sección. Antes no ocurría porque el contenido se pintaba después de cargar el documento (fallo previo a la migración, documentado en la fase 3).

## Despliegue
El servidor debe devolver `index.html` para las rutas que no sean archivos (ver README). Comprobado con `vite preview`: `/tienda`, `/producto/origine`, `/tienda.html` y rutas desconocidas devuelven `index.html`; `/js/vendor/three.min.js` y `/assets/…` se sirven como archivos.

## Verificación
- `tests/spa.spec.js`: carga directa de las once rutas (contenido y título), redirecciones de URLs antiguas y desconocidas, navegación interna sin recargar el documento, atrás/adelante, reinicio de la interfaz al cambiar de página y no al cambiar el fragmento, menú móvil.
- Las instantáneas de las fases 2 y 3 (tomadas con la web multipágina) siguen pasando: el comparador traduce las rutas nuevas a su forma antigua (`/producto/x` ↔ `producto.html#x`).
- La suite completa (98 pruebas) pasa en desarrollo; las pruebas de rutas, páginas, estado y portada (37) pasan también contra el build de producción servido con `vite preview`. Consola sin errores ni avisos durante la navegación.
