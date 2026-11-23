// CANAL DE ÓRDENES DE INTERFAZ COMPARTIDAS (AVISO TEMPORAL Y MINICARRITO).
// El StoreProvider las escucha y pinta el resultado.

const oyentes = new Set();

function emitir(orden) { oyentes.forEach((oyente) => oyente(orden)); }

// MUESTRA UN MENSAJE TEMPORAL EN EL AVISO GLOBAL.
export function aviso(texto) { emitir({ tipo: 'aviso', texto }); }

// ABRE EL MINICARRITO.
export function abrirMiniCarrito() { emitir({ tipo: 'abrir-carrito' }); }

// REGISTRA UN OYENTE Y DEVUELVE LA FUNCIÓN PARA RETIRARLO.
export function suscribirUI(oyente) {
    oyentes.add(oyente);
    return () => oyentes.delete(oyente);
}
