import { leer } from './store/storage.js';

// DATOS DE LA SESIÓN SACADOS DEL TOKEN: { token, id, email, rol } O null SI NO HAY SESIÓN.
// Un JWT tiene tres partes separadas por puntos (cabecera.datos.firma); la del medio son los
// datos en base64. Leerlos aquí sirve para decidir qué se pinta (por ejemplo, la vista del MOD),
// pero NO es seguridad: quien de verdad comprueba el token y el rol es el backend.
export function datosDeSesion() {
    const token = leer('token', '');
    if (!token) return null;
    try {
        const datos = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const { id, email, rol } = JSON.parse(atob(datos));
        return { token, id, email, rol };
    } catch {
        return null;
    }
}
