# Fase 2 · Funcionalidades compartidas en React

Regla general: **ningún cambio de funcionalidad, estilo, efecto 3D ni conexión a la API**. El DOM de las partes comunes que genera React es idéntico al que producían las plantillas + `comun.js`; lo prueba `tests/shell.spec.js` con instantáneas tomadas de la versión heredada antes del cambio.

## Qué ha pasado a React

| Parte | Antes | Ahora |
| --- | --- | --- |
| Sprite de iconos y emblema | `public/js/iconos.js` (eliminado) | `src/components/IconSprite.jsx` + `src/components/emblema.js` |
| Cabecera (enlaces activos, contadores, `aria-label`, cuenta, `scrolled`) | HTML de cada plantilla + `comun.js` | `Header` en `src/components/SiteShell.jsx` |
| Buscador (foco, filtrado, Enter, Escape) | `comun.js` | `Header` |
| Menú móvil (foco en el primer enlace, cierre, Escape) | plantilla + `comun.js` | `Header` |
| Pie (año actual) | plantilla + `comun.js` | `Footer` |
| Minicarrito (líneas, cantidades, total, foco y retorno del foco, Escape, fotos ausentes) | plantilla + `comun.js` | `CartDrawer` |
| Aviso temporal (transición, reinicio del temporizador) | `#toast` + `comun.js` | `Toast` en `src/store.jsx`, controlado por `src/store/ui.js` |

Las 11 plantillas de `src/legacy-pages/` ya solo contienen su `<main>` y los scripts propios. `src/main.jsx` monta `Header`, el contenido heredado, `Footer` y `CartDrawer` dentro de `StoreProvider`.

## Qué sigue en el legado (y por qué)

`public/js/comun.js` (114 líneas, antes 361) solo actúa sobre el contenido heredado de cada página, que aún no es React:
`OKI.$`/`OKI.$$`, `OKI.tarjetaHTML`, `OKI.prepararFotos`, `OKI.pintarCorazones`, los botones `data-add`/`data-fav` del contenido y la newsletter (portada y journal). Se irá vaciando al migrar cada página (fase 3).

`src/legacy/puente.js` entrega a los scripts heredados: catálogo, estado (`OKI.leer/guardar/borrar/carrito/favoritos`), `OKI.aviso`, `OKI.abrirMiniCarrito` y `window.OKI_EMBLEMA`.

## Comportamientos heredados conservados a propósito
- La cabecera **no** refleja el inicio/cierre de sesión hasta el siguiente cambio de carrito/favoritos o recarga (en el legado `pintarContadores` solo se ejecutaba con esos eventos). React lee el usuario solo cuando cambia el estado compartido para mantenerlo igual.
- El aviso conserva su último texto al ocultarse.
- Los resultados del buscador no existen en el DOM hasta abrirlo por primera vez.
