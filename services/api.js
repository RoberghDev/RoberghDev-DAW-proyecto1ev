const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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

export { login, registrarNuevoUsuario, verTodosLosProductos, buscarProductosPorID};