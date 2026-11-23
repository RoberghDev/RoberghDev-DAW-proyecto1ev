# Fase 3 · Migración de páginas

Regla general: **ningún cambio de funcionalidad, estilo, efecto 3D ni conexión a la API**.

## Estado

| Orden | Página | Estado | Plantilla y script heredados |
| --- | --- | --- | --- |
| 1 | Nosotros, Legal | Migradas | Eliminados |
| 2 | Journal, Ayuda | Migradas (newsletter y contacto en `src/components/Forms.jsx`) | Eliminados (`ayuda.js`) |
| 3 | Colecciones | Migrada; las 6 fichas se generan desde `src/data.js` | Eliminada |
| 4 | Tienda | Migrada (filtros, orden, URL, cards desde el catálogo) | Eliminados (`tienda.js`) |
| 5 | Producto | Migrada (hash, galería, variantes, cantidad, relacionados) | Eliminados (`producto.js`) |
| 6 | Favoritos, Carrito | Migradas | Eliminados (`favoritos.js`, `carrito.js`) |
| 7 | Cuenta | Migrada; usa `login` y `registrarNuevoUsuario` de `services/api.js` sin modificarlo | Eliminados (`cuenta.js`) |
| 8 | Inicio | Migrada; el carrusel 3D y los engranajes siguen en `hero.js`, `relojes3d.js` y `engranajes.js` sobre el mismo HTML (fase 4) | Eliminados (`index.html`, `comun.js`) |

Las once páginas son React (`paginasReact` en `src/main.jsx`). Ya no existen `src/legacy-pages/`, `comun.js` ni el montaje de plantillas con `html-react-parser` (la dependencia se retira del `package.json` en la fase 6). Los únicos scripts clásicos son los visuales de la portada, que reciben lo que necesitan de `src/legacy/puente.js`.

## Cómo se ha verificado cada página

1. Antes de migrar, se guardaron instantáneas del DOM de `<main>` generado por la versión heredada (con y sin datos, y en las variantes de URL con `#hash`), además del título y la meta descripción: `tests/paginas.spec.js`.
2. Pruebas de comportamiento fijadas también con la versión heredada: `formularios.spec.js`, `tienda.spec.js`, `producto.spec.js`, `carrito-favoritos.spec.js`, `estado.spec.js`, `cuenta.spec.js` (con la API simulada mediante `page.route`, sin llamadas reales) e `inicio.spec.js` (hero 3D, engranajes y destacados).
3. La versión React debe producir el mismo DOM y pasar las mismas pruebas.
4. Comparación píxel a píxel con la versión del último commit (a4edbd3) a 390 px y 1280 px, incluidas las páginas con datos, la cuenta con y sin sesión y los paneles abiertos (buscador, menú móvil, desplegable y minicarrito): 28 de 28 capturas idénticas. En la portada se tapan los dos canvas, que se animan y muestran la hora real.
5. Consola sin errores ni avisos de React.

## Detalles reproducidos a propósito
- La cantidad de la ficha y la casilla "Solo novedades" se manejan por propiedad del DOM (como los scripts), sin reescribir los atributos `value`/`checked`.
- Las cards ocultas por los filtros siguen en el DOM con `hidden` y también se reordenan.
- El título de la ficha es el nombre del reloj.
- Las tarjetas de relacionados y favoritos usan el HTML de `OKI.tarjetaHTML` (`TarjetaSimple`), distinto del de las cards de la tienda (`ProductCard`).
- Los textos compuestos se generan como un único nodo de texto para que el suavizado de las letras sea idéntico al original.

## Cuenta y API
- Mismas validaciones, mensajes (incluido «La contraseña tiene al menos 6 caracteres» con la comprobación de 3), cuerpos enviados, `console.error`, datos guardados (`token`, `usuario`, `cuentas`) y avisos que `cuenta.js`.
- Como antes, el panel de cuenta solo se repinta al cargar, entrar, registrarse o salir, y la cabecera no refleja la sesión hasta el siguiente cambio de carrito/favoritos o recarga.

## Fallo previo documentado (no corregido)
- Al abrir una URL con ancla (por ejemplo `legal.html#privacidad` desde el pie), el navegador no desplaza hasta la sección porque el contenido lo pinta React después de cargar el documento. Ya ocurría antes de la migración; `tests/pages.spec.js` lo deja registrado.

## Código retirado
Componentes React previos que no se usaban y duplicaban páginas ya migradas: `StorePage`, `FavoritesPage`, `ProductPage`, `CartPageContent`, `CartLine`, el `Checkout` del shell, `AccountPage` y los hooks `usePageEvents` y `useStoreRevision`. `FeaturedProducts` y los `Hero`/`GearCanvas` aproximados de `Visuals.jsx` solo los usa la vista previa `?react=1`.
