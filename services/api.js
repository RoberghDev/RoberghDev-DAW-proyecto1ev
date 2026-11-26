const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// LARGO MÁXIMO DEL MOTIVO QUE SE ENSEÑA AL USUARIO.
const MAXIMO_MOTIVO = 80;

// CREA EL ERROR DE UNA RESPUESTA FALLIDA: el mensaje en español según el código HTTP
// y, detrás, el motivo que manda el backend, pero SOLO si es un texto corto
// ("se debe iniciar sesión"). Si el backend devuelve una página HTML (Express lo hace
// con las rutas que no existen) o un texto largo, se enseña solo el mensaje general.
async function errorDeLaApi(respuesta, mensajesPorEstado, mensajePorDefecto) {
    const mensaje = mensajesPorEstado[respuesta.status] || `${mensajePorDefecto} (${respuesta.status}).`;
    let motivo = '';
    try {
        // NO SE MIRA EL content-type: Express marca como text/html hasta un res.send("texto").
        const texto = await respuesta.text();
        try {
            const datos = JSON.parse(texto);
            motivo = datos.error || datos.message || datos.mensaje || '';
        } catch {
            motivo = texto;
        }
    } catch {
        // SIN CUERPO LEGIBLE: SE QUEDA SOLO EL MENSAJE GENERAL.
    }
    motivo = String(motivo).trim();
    const motivoCorto = motivo && motivo.length <= MAXIMO_MOTIVO && !motivo.includes('<');
    return new Error(motivoCorto ? `${mensaje} Motivo: ${motivo}.` : mensaje);
}

// ENVÍA LAS CREDENCIALES AL ENDPOINT DE INICIO DE SESIÓN.
async function login(correoElectronico, contrasena) {
    const respuesta = await fetch(`${API_URL}/usuarios/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: correoElectronico,
            password: contrasena
        })
    });

    const tipoContenido = respuesta.headers.get('content-type') || '';
    const datos = tipoContenido.includes('application/json') ? await respuesta.json() : null;

    if (!respuesta.ok) {
        const mensajesPorEstado = {
            400: 'Falta el correo electrónico o la contraseña.',
            401: 'Correo electrónico o contraseña incorrectos.',
            500: 'Error interno del servidor.'
        };
        const mensajeError = datos?.message || mensajesPorEstado[respuesta.status] || `Error al iniciar sesión (${respuesta.status}).`;
        throw new Error(mensajeError);
    }

    return datos;
}

// ENVÍA LOS DATOS DEL FORMULARIO AL ENDPOINT DE REGISTRO.
async function registrarNuevoUsuario(nombreUsuario, contrasena, correo, telefono) {
    const respuesta = await fetch(`${API_URL}/usuarios/registro`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombreUsuario: nombreUsuario,
            password: contrasena,
            email: correo,
            numTlf: telefono,
            rol: 'USER'
        })
    });

    const mensaje = await respuesta.text();

    if (!respuesta.ok) {
        throw new Error(
            mensaje || `Error al registrar el usuario (${respuesta.status}).`
        );
    }

    return mensaje;
}

// RECIBE TODOS LOS PRODUCTOS PARA PONERLOS EN LA TIENDA
async function verTodosLosProductos() {
    const respuesta = await fetch(`${API_URL}/productos/verTodos`)

    if (respuesta.ok) {
        const tipoContenido = respuesta.headers.get('content-type') || '';

        if (!tipoContenido.includes('application/json')) {
            throw new Error('El servidor no devolvió una respuesta JSON.');
        }

        return await respuesta.json();

    } else {
        throw new Error(`Error al obtener los productos (${respuesta.status}).`);
    }
}

// RECIBE UN PRODUCTO CONCRETO A PARTIR DE SU ID DE MONGODB
async function buscarProductosPorID(idProducto) {
    const respuesta = await fetch(`${API_URL}/productos/${idProducto}`)

    if (respuesta.ok) {
        const tipoContenido = respuesta.headers.get('content-type') || '';

        if (!tipoContenido.includes('application/json')) {
            throw new Error('El servidor no devolvió una respuesta JSON.');
        }

        return await respuesta.json();

    } else {
        const mensajesPorEstado = {
            400: 'El ID del producto no es válido.',
            404: 'Producto no encontrado.',
            500: 'Error interno del servidor.'
        };
        throw new Error(mensajesPorEstado[respuesta.status] || `Error al obtener el producto (${respuesta.status}).`);
    }
}

// RECIBE LAS INCIDENCIAS (TICKETS) DEL USUARIO QUE HA INICIADO SESIÓN.
// El token va en la cabecera Authorization: así el backend sabe quién pide los datos.
// PENDIENTE EN EL BACKEND: crear la ruta GET /tickets/misTickets (con verificarToken).
async function verMisTickets(token) {
    const respuesta = await fetch(`${API_URL}/tickets/misTickets`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (respuesta.ok) return await respuesta.json();

    const mensajesPorEstado = {
        401: 'El servidor no ha podido verificar tu sesión.',
        404: 'Todavía no se pueden consultar las incidencias.',
        500: 'Error interno del servidor.'
    };
    throw await errorDeLaApi(respuesta, mensajesPorEstado, 'Error al obtener las incidencias');
}

// CREA UNA INCIDENCIA (TICKET) PARA UN RELOJ.
// Se envía también el token para cuando el backend proteja la ruta con verificarToken.
async function crearTicket(token, idUsuario, idProducto, incidencia) {
    const respuesta = await fetch(`${API_URL}/tickets/crearTicket`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ idUsuario, idProducto, incidencia })
    });

    if (respuesta.ok) return await respuesta.text();

    const mensajesPorEstado = {
        400: 'El reloj o el usuario no son válidos.',
        401: 'El servidor no ha podido verificar tu sesión.',
        404: 'No se ha encontrado el reloj o el usuario.',
        500: 'El servidor no pudo crear la incidencia.'
    };
    throw await errorDeLaApi(respuesta, mensajesPorEstado, 'Error al crear la incidencia');
}

// RECIBE TODAS LAS INCIDENCIAS (TICKETS) DE TODOS LOS USUARIOS. PARA MOD Y ADMIN.
// PENDIENTE EN EL BACKEND: hoy la ruta solo deja pasar a ADMIN (verificarRol("ADMIN")).
async function verTodosLosTickets(token) {
    const respuesta = await fetch(`${API_URL}/tickets/verTodos`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (respuesta.ok) return await respuesta.json();

    const mensajesPorEstado = {
        401: 'El servidor no ha podido verificar tu sesión.',
        403: 'No tienes permiso para ver todas las incidencias.',
        500: 'Error interno del servidor.'
    };
    throw await errorDeLaApi(respuesta, mensajesPorEstado, 'Error al obtener las incidencias');
}

// CAMBIA UNA INCIDENCIA (TICKET). "cambios" es un objeto con los campos a modificar,
// por ejemplo { estado: 'en curso' } o { asignarme: true }. Devuelve el ticket ya actualizado.
async function editarUnTicket(token, idTicket, cambios) {
    const respuesta = await fetch(`${API_URL}/tickets/editarUno/${idTicket}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(cambios)
    });

    if (respuesta.ok) return await respuesta.json();

    const mensajesPorEstado = {
        400: 'El estado indicado no es válido.',
        401: 'El servidor no ha podido verificar tu sesión.',
        403: 'No tienes permiso para modificar incidencias.',
        404: 'Esta incidencia ya no existe.',
        500: 'El servidor no pudo guardar el cambio.'
    };
    throw await errorDeLaApi(respuesta, mensajesPorEstado, 'Error al modificar la incidencia');
}

// ELIMINA UNA INCIDENCIA (TICKET). En el backend lo pueden hacer MOD y ADMIN;
// en el frontend solo se le enseña el botón al ADMIN.
async function eliminarTicket(token, idTicket) {
    const respuesta = await fetch(`${API_URL}/tickets/eliminaUno/${idTicket}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });

    if (respuesta.ok) return await respuesta.text();

    const mensajesPorEstado = {
        400: 'La referencia de la incidencia no es válida.',
        401: 'El servidor no ha podido verificar tu sesión.',
        403: 'No tienes permiso para eliminar incidencias.',
        404: 'Esta incidencia ya no existe.',
        500: 'El servidor no pudo eliminar la incidencia.'
    };
    throw await errorDeLaApi(respuesta, mensajesPorEstado, 'Error al eliminar la incidencia');
}

export {
    login,
    registrarNuevoUsuario,
    verTodosLosProductos,
    buscarProductosPorID,
    verMisTickets,
    crearTicket,
    verTodosLosTickets,
    editarUnTicket,
    eliminarTicket,
};