# Fase 1 · Auditoría y unificación de los cimientos React

Regla general de la migración: **no cambia ninguna funcionalidad, estilo, efecto 3D ni la conexión a la API**. El comportamiento de las páginas heredadas (`src/legacy-pages/` + `public/js/`) es la referencia; si React diverge, se alinea React con el legado.

## Decisiones

| Ámbito | Fuente única | Cómo llega al legado |
| --- | --- | --- |
| Catálogo (colecciones, productos, textos, utilidades) | `src/data.js` | `src/legacy/puente.js` lo publica en `window` antes de cargar los scripts. `public/js/datos.js` (copia idéntica) se ha eliminado. |
| Estado (almacenamiento, carrito, favoritos) | `src/store/storage.js` | `puente.js` lo publica en `window.OKI`; `comun.js` lo reutiliza en vez de reimplementarlo. `src/store.jsx` es solo la capa React encima. |
| Iconos | `src/components/IconSprite.jsx` y `public/js/iconos.js` | Se mantienen ambos de momento: son equivalentes (mismos 40 símbolos y mismo emblema). `iconos.js` además define `window.OKI_EMBLEMA`, que usa `relojes3d.js`. Se unificará al migrar la cabecera. |
| API | `services/api.js` | Sin cambios. `cuenta.js` la recibe por `window.OKI_API` desde `main.jsx`. Integración aplazada por decisión del proyecto. |

`src/legacy/puente.js` es un adaptador temporal; se retira en la fase 6.

## Contrato de datos

### Colección (`COLECCIONES[]`)
`{ id, nombre, categoria, lema, titulo, sub (HTML con <br>), descripcion, principal (id de producto), modelo3d { bezel, dial, hands, handMat, secMat, screws?, applied?, moon?, tourbillon? } }`

### Producto (`PRODUCTOS[]`)
`{ id, coleccion, nombre, precio (entero, €), nuevo?, limitado?, caja ('cobre'|'acero'|'negro'), correa ('piel'|'acero'|'caucho'), mm, movimiento, reserva, agua, cristal, correaTexto, ref, modelo { caseMat, strap, strapColor?, stitch? } }`

Utilidades: `buscarProducto(id)`, `buscarColeccion(id)`, `productosDe(idColeccion)`, `fotoProducto(producto, n)` → `assets/relojes/<id>[-n].jpg`, `precioTexto(n)` → `"4.950 €"`, `resumenProducto(p)`.

### localStorage (prefijo `okidokei.`, valores JSON)

| Clave | Formato | Escriben |
| --- | --- | --- |
| `carrito` | `[{ id, qty }]` | carrito (tienda, ficha, minicarrito, página carrito, favoritos) |
| `favoritos` | `[id]` | botones corazón |
| `usuario` | `{ nombre, email }` | cuenta (login/registro); logout la borra |
| `token` | `string` | cuenta (login/registro); logout la borra |
| `cuentas` | `{ [emailEnMinúsculas]: { nombre, email } }` | registro |

Lectura: los ids que ya no existen en el catálogo y las líneas con `qty <= 0` se ignoran; al escribir carrito/favoritos se depuran. Sin `localStorage` se usa memoria (no persiste al recargar).

### Eventos
- `oki:carrito` y `oki:favoritos` (en `document`) tras cada escritura de carrito/favoritos.
- `storage` (en `window`) para sincronizar otras pestañas.

### API (`VITE_API_URL`, por defecto `http://localhost:3000/api`)
- `POST /usuarios/login` `{ email, password }` → JSON con `token`. Errores: `message` del cuerpo o texto por estado (400, 401, 500).
- `POST /usuarios/registro` `{ nombreUsuario, password, email, numTlf, rol: 'USER' }` → texto. Tras registrarse se hace login.

## Comportamientos heredados que se conservan tal cual
- El login guarda `usuario.nombre = email`.
- El login exige correo terminado en `.com` y contraseña de ≥ 3 caracteres, aunque el mensaje dice "al menos 6".
- Las cards repetidas de la tienda son intencionadas (maqueta).

## Pendiente para fases siguientes
- `src/pages/*.jsx` son transcripciones estáticas de las plantillas; las versiones con lógica (`StorePage`, `ProductPage`, `FavoritesPage`, `AccountPage`, `CartPageContent`) aún no se usan.
- El `Hero` de `src/components/Visuals.jsx` es una aproximación simplificada de `relojes3d.js`/`hero.js`; no debe sustituir al original (fase 4).
- `tests/estado.spec.js` fija el comportamiento de carrito, favoritos y sesión como regresión.
