// RUTAS DE LA SPA Y COMPATIBILIDAD CON LAS URLS DE LA ANTIGUA WEB MULTIPÁGINA.

// CLAVES DE PÁGINA CON RUTA PROPIA (/tienda, /colecciones…). La portada es "/" y el producto "/producto/:id".
const PAGINAS_SIMPLES = ['tienda', 'colecciones', 'carrito', 'favoritos', 'cuenta', 'ayuda', 'journal', 'nosotros', 'legal', 'incidencias'];

// DEVUELVE LA CLAVE DE PÁGINA (index, tienda, producto…) DE UNA RUTA, O null SI NO EXISTE.
export function claveDeRuta(pathname) {
    if (pathname === '/') return 'index';
    const [, primero, segundo, ...resto] = pathname.split('/');
    if (resto.length) return null;
    if (primero === 'producto') return 'producto';
    if (PAGINAS_SIMPLES.includes(primero) && !segundo) return primero;
    return null;
}

// TRADUCE UNA URL ANTIGUA (/tienda.html#marine, /producto.html#luna-acero, /index.html) A SU RUTA NUEVA.
// Devuelve null si la ruta no corresponde a ninguna página antigua.
export function rutaDesdeAntigua(pathname, hash) {
    const coincidencia = /^\/([a-z]+)\.html$/.exec(pathname);
    if (!coincidencia) return null;
    const clave = coincidencia[1];
    if (clave === 'index') return '/' + hash;
    if (clave === 'producto') {
        const id = decodeURIComponent(hash.slice(1));
        return id ? `/producto/${encodeURIComponent(id)}` : '/producto';
    }
    if (PAGINAS_SIMPLES.includes(clave)) return `/${clave}${hash}`;
    return null;
}
