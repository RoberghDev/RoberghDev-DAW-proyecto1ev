// CANAL DEL AVISO TEMPORAL GLOBAL.
// El StoreProvider las escucha y pinta el resultado.

const oyentes = new Set();

function emitir(orden) { oyentes.forEach((oyente) => oyente(orden)); }

// MUESTRA UN MENSAJE TEMPORAL EN EL AVISO GLOBAL.
export function aviso(texto) { emitir({ tipo: 'aviso', texto }); }

// REGISTRA UN OYENTE Y DEVUELVE LA FUNCIÓN PARA RETIRARLO.
export function suscribirUI(oyente) {
    oyentes.add(oyente);
    return () => oyentes.delete(oyente);
}
