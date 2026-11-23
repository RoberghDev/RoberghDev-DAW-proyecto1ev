# Fase 4 · Animaciones y Three.js

Regla general: **ningún cambio de funcionalidad, estilo, efecto 3D ni conexión a la API**.

## Qué se ha convertido

| Antes (script clásico en `public/js/`) | Ahora |
| --- | --- |
| `relojes3d.js` (global `window.OKI3D`) | `src/visual/relojes3d.js`: `crearRelojes3D(THREE)` con los mismos cálculos de geometría, texturas y animación; importa catálogo y emblema; añade `liberar()` para sus cachés de texturas y geometrías. |
| `hero.js`, motor 3D (`iniciar3D`) | `src/visual/carrusel3d.js`: `iniciarCarrusel3D(opciones)`, mismo código de cámara, arrastre, inercia, giro automático, polvo y animación de entrada; devuelve `destruir()`. |
| `hero.js`, interfaz (pestañas, textos, flechas, teclado, giro) | `src/components/HeroColecciones.jsx`: mismo HTML; la colección activa y el botón de giro son estado React. |
| `engranajes.js` | `src/visual/engranajes.js` (`iniciarEngranajes(canvas)` → `destruir()`) y `src/components/Engranajes.jsx`. |
| `three.min.js` | Se mantiene local en `public/js/vendor/` como dependencia; `src/visual/three.js` la carga una sola vez cuando la portada la necesita. |

Retirados: `public/js/hero.js`, `relojes3d.js`, `engranajes.js`, el puente `src/legacy/` (ya no hay scripts clásicos que lo necesiten) y las aproximaciones `Hero`/`GearCanvas` de `src/components/Visuals.jsx` y `FeaturedProducts`, que duplicaban estos efectos.

## Ciclo de vida

Al desmontarse, el carrusel 3D cancela su `requestAnimationFrame`, retira sus listeners (un `AbortController`), desconecta sus `ResizeObserver` e `IntersectionObserver`, libera geometrías, materiales, texturas y el mapa de entorno, y llama a `renderer.dispose()` y `renderer.forceContextLoss()`. Los modelos liberan sus cachés y la comprobación de soporte WebGL ya no deja un contexto de prueba vivo. Los engranajes cancelan su animación y desconectan sus observers.

`tests/ciclo-vida.spec.js` monta y desmonta el hero y los engranajes tres veces sobre una página sin animaciones y comprueba, espiando las APIs del navegador, que tras cada desmontaje no queda ningún `requestAnimationFrame`, que todos los contextos WebGL están perdidos y que no quedan observers ni listeners de `document` activos.

## Verificación de comportamiento
- `tests/inicio.spec.js` (pestañas, flechas, teclado, giro, destacados, canvas activos) y las instantáneas de `paginas.spec.js` y `shell.spec.js` pasan igual que con la versión heredada.
- Captura del carrusel en el mismo estado en la versión original y en la React: misma escena; solo cambian la hora de las agujas y el balanceo, que dependen del instante.
- Diferencia de arranque inevitable: la interfaz del hero responde antes de que termine de cargar Three.js. Si se elige otra colección o se activa el giro en ese intervalo, el carrusel se sitúa en ella al arrancar.

## Rendimiento y pruebas
Con 6 portadas a la vez (WebGL por software en el navegador de pruebas) la máquina se satura; la versión original falla igual en esas condiciones. `playwright.config.js` limita las pruebas a 3 workers; con eso la suite completa (83 pruebas) pasa de forma estable.
