// DATOS COMUNES DE LAS INCIDENCIAS, PARA LAS VISTAS DE USUARIO Y DE MODERADOR.

// ESTADOS POSIBLES DE UN TICKET: "valor" ES EL QUE GUARDA EL BACKEND (enum del modelo)
// Y "texto" ES EL QUE SE ENSEÑA EN PANTALLA.
export const ESTADOS_TICKET = [
    { valor: 'abierto', texto: 'Abierta' },
    { valor: 'en curso', texto: 'En reparación' },
    { valor: 'resuelto', texto: 'Resuelta' },
    { valor: 'cerrado', texto: 'Cerrada' }
];

export function textoEstado(valor) {
    return ESTADOS_TICKET.find((estado) => estado.valor === valor)?.texto || valor;
}

// FECHA CORTA EN ESPAÑOL (26/11/2026).
export function fechaCorta(fecha) {
    return fecha ? new Date(fecha).toLocaleDateString('es-ES') : '—';
}

// LOS ID DE MONGODB SON LARGOS: SE ENSEÑAN SOLO LOS 6 ÚLTIMOS CARACTERES COMO REFERENCIA.
export function referenciaCorta(id) {
    return id ? '#' + String(id).slice(-6).toUpperCase() : '—';
}
