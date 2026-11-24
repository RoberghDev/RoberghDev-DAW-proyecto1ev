import { PRODUCTOS, buscarColeccion, buscarProducto as buscarProductoLocal } from './data.js';
import { verTodosLosProductos } from '../services/api.js';

// CATÁLOGO DE PRODUCTOS DE LA API (GET /api/productos/verTodos).
// Se descarga UNA sola vez y lo comparten la tienda, la ficha, el buscador, el carrito y los favoritos.
// Las colecciones (textos, modelos 3D del hero) siguen en src/data.js porque la API no las tiene.
// Si un id no está en la API, se busca en src/data.js: así siguen funcionando los enlaces
// editoriales de la portada y de colecciones (que apuntan a ids como 'heritage-cobre').

let productos = [];
let estado = 'pendiente'; // 'pendiente' | 'cargando' | 'listo' | 'error'
let error = null;
let peticion = null;

// AVISA A LA PÁGINA DE QUE EL CATÁLOGO HA CAMBIADO (EL StoreProvider ESCUCHA ESTE EVENTO).
function avisarCambio() { document.dispatchEvent(new CustomEvent('oki:catalogo')); }

// DEDUCE LA CAJA Y LA CORREA A PARTIR DE LOS TEXTOS (LA API NO TIENE ESOS CAMPOS).
function deducirCaja(texto) {
    return texto.includes('negro') ? 'negro' : texto.includes('cobre') ? 'cobre' : 'acero';
}
function deducirCorrea(texto) {
    if (texto.includes('cuero') || texto.includes('piel')) return 'piel';
    if (texto.includes('caucho') || texto.includes('silicona') || texto.includes('resina')) return 'caucho';
    return 'acero';
}
// LA API GUARDA LA COLECCIÓN CON MAYÚSCULA ('Heritage'); LA WEB USA EL ID EN MINÚSCULAS ('heritage').
// SI NO VIENE O NO ES VÁLIDA, SE DEDUCE DEL TEXTO COMO ANTES.
function deducirColeccion(item, texto) {
    const coleccion = String(item.coleccion || '').toLowerCase();
    if (buscarColeccion(coleccion)) return coleccion;
    if (texto.includes('buceo') || texto.includes('diver') || texto.includes('buc')) return 'marine';
    if (texto.includes('negro')) return 'noir';
    if (texto.includes('luna')) return 'luna';
    return 'heritage';
}

// CONVIERTE UN PRODUCTO DE LA API A LA FORMA QUE USAN LAS TARJETAS Y LA FICHA.
export function normalizarProducto(item, indice = 0) {
    const materiales = item.materiales || '';
    const texto = `${item.nombreProducto || item.nombre || ''} ${item.descripcion || ''} ${materiales}`.toLowerCase();
    const caja = deducirCaja(texto);
    const correa = deducirCorrea(texto);
    const coleccion = deducirColeccion(item, texto);
    const milimetros = parseInt(item['tamañoEsfera'], 10);

    return {
        id: item._id || item.id || `producto-${indice}`,
        nombre: item.nombreProducto || item.nombre || 'Reloj',
        precio: Number(item.precio) || 0,
        descripcion: item.descripcion || '',
        cantidad: item.cantidad,
        materiales,
        nuevo: Boolean(item.nuevo),
        limitado: Boolean(item.limitado) || coleccion === 'origine',
        coleccion,
        caja,
        correa,
        correaTexto: correa === 'piel' ? 'Correa de piel'
            : correa === 'caucho' ? 'Correa de caucho'
                : 'Brazalete de acero',
        mm: milimetros || item.mm || 42,
        movimiento: item.tipoMovimiento || item.movimiento || 'Movimiento automático',
        reserva: item.reserva || '',
        agua: item.agua || '',
        cristal: item.cristal || '',
        ref: item.ref || item._id || item.id || `OK-${indice + 1}`,
        modelo: item.modelo || {},
        imagenUrl: item.imagenUrl || '' // URL DE FIREBASE STORAGE (VACÍA SI EL PRODUCTO NO TIENE FOTO)
    };
}

// ACEPTA UN ARRAY O UN OBJETO { productos } / { data } Y LO NORMALIZA.
export function normalizarProductos(datos) {
    const lista = Array.isArray(datos) ? datos : datos?.productos || datos?.data || [];
    return lista.map(normalizarProducto);
}

// DESCARGA EL CATÁLOGO (SOLO LA PRIMERA VEZ; LAS SIGUIENTES DEVUELVE LA MISMA PROMESA).
export function cargarCatalogo() {
    if (peticion) return peticion;
    estado = 'cargando';
    avisarCambio();
    peticion = verTodosLosProductos()
        .then((datos) => {
            productos = normalizarProductos(datos);
            estado = 'listo';
            error = null;
        })
        .catch((errorCarga) => {
            estado = 'error';
            error = errorCarga.message;
            peticion = null; // PERMITE REINTENTAR MÁS TARDE.
        })
        .finally(avisarCambio);
    return peticion;
}

// ESTADO ACTUAL DEL CATÁLOGO, PARA PINTAR "CARGANDO…" O EL ERROR.
export function estadoCatalogo() { return { productos, estado, error }; }

// TODOS LOS PRODUCTOS DE LA API.
export function productosCatalogo() { return productos; }

// PRODUCTOS DE LA API DE UNA COLECCIÓN.
export function productosDe(identificadorColeccion) {
    return productos.filter((producto) => producto.coleccion === identificadorColeccion);
}

// BUSCA UN PRODUCTO POR ID: PRIMERO EN LA API Y, SI NO ESTÁ, EN src/data.js.
export function buscarProducto(identificador) {
    return productos.find((producto) => producto.id === identificador) || buscarProductoLocal(identificador);
}

// ¿SE PUEDE CONSERVAR ESTE ID EN EL CARRITO / FAVORITOS? Mientras el catálogo no se haya cargado
// bien no se sabe, así que se conserva (si no, al recargar la página se perderían los de la API).
export function existeProducto(identificador) {
    return estado !== 'listo' || Boolean(buscarProducto(identificador));
}

// AÑADE AL CATÁLOGO UN PRODUCTO DESCARGADO APARTE (GET /api/productos/:id).
export function registrarProducto(producto) {
    if (productos.some((existente) => existente.id === producto.id)) return;
    productos = [...productos, producto];
    avisarCambio();
}

export { PRODUCTOS as PRODUCTOS_LOCALES };
