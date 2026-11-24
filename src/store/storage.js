import { buscarProducto, existeProducto } from '../catalogo.js';

// ÚNICA IMPLEMENTACIÓN DEL ESTADO COMPARTIDO (CARRITO, FAVORITOS Y DATOS GUARDADOS).
// La usan el StoreProvider de React y, a través de window.OKI, los scripts heredados.
// Conserva exactamente el comportamiento de public/js/comun.js: mismas claves,
// mismos formatos en localStorage y mismos eventos 'oki:carrito' / 'oki:favoritos'.

const PREFIJO = 'okidokei.';
const memoria = {};

// LEE Y PARSEA UN VALOR GUARDADO, CON UN VALOR ALTERNATIVO SI NO ESTÁ DISPONIBLE.
export function leer(clave, valorPorDefecto) {
    try {
        const valorGuardado = localStorage.getItem(PREFIJO + clave);
        return valorGuardado == null ? valorPorDefecto : JSON.parse(valorGuardado);
    } catch {
        return clave in memoria ? memoria[clave] : valorPorDefecto;
    }
}

// GUARDA UN VALOR EN MEMORIA Y, SI ES POSIBLE, EN LOCALSTORAGE.
export function guardar(clave, valor) {
    memoria[clave] = valor;
    try { localStorage.setItem(PREFIJO + clave, JSON.stringify(valor)); } catch { }
}

// ELIMINA UN VALOR DEL ALMACENAMIENTO LOCAL Y DE LA MEMORIA ALTERNATIVA.
export function borrar(clave) {
    delete memoria[clave];
    try { localStorage.removeItem(PREFIJO + clave); } catch { }
}

// NOTIFICA A LA PÁGINA QUE HA CAMBIADO UN DATO COMPARTIDO.
function avisarCambio(nombreDato) { document.dispatchEvent(new CustomEvent('oki:' + nombreDato)); }

export const carrito = {
    // DEVUELVE LOS ARTÍCULOS VÁLIDOS QUE HAY EN EL CARRITO.
    items() {
        return leer('carrito', []).filter((articulo) => existeProducto(articulo.id) && articulo.qty > 0);
    },
    // CALCULA EL NÚMERO TOTAL DE UNIDADES DEL CARRITO.
    cantidad() {
        return carrito.items().reduce((cantidadAcumulada, articulo) => cantidadAcumulada + articulo.qty, 0);
    },
    // CALCULA EL PRECIO TOTAL DE LOS ARTÍCULOS DEL CARRITO.
    total() {
        // SI EL CATÁLOGO AÚN NO HA LLEGADO, LOS PRODUCTOS QUE NO SE CONOCEN TODAVÍA NO SUMAN.
        return carrito.items().reduce((totalAcumulado, articulo) => totalAcumulado + (buscarProducto(articulo.id)?.precio || 0) * articulo.qty, 0);
    },
    // AÑADE UNA CANTIDAD DEL PRODUCTO AL CARRITO.
    anadir(identificadorProducto, cantidad) {
        const articulos = carrito.items();
        const articuloExistente = articulos.filter((articulo) => articulo.id === identificadorProducto)[0];
        if (articuloExistente) articuloExistente.qty += cantidad || 1;
        else articulos.push({ id: identificadorProducto, qty: cantidad || 1 });
        guardar('carrito', articulos); avisarCambio('carrito');
    },
    // ESTABLECE LA CANTIDAD DE UN PRODUCTO Y QUITA LOS ARTÍCULOS SIN UNIDADES.
    poner(identificadorProducto, cantidad) {
        const articulos = carrito.items()
            .map((articulo) => articulo.id === identificadorProducto ? { id: identificadorProducto, qty: cantidad } : articulo)
            .filter((articulo) => articulo.qty > 0);
        guardar('carrito', articulos); avisarCambio('carrito');
    },
    // ELIMINA UN PRODUCTO DEL CARRITO.
    quitar(identificadorProducto) {
        guardar('carrito', carrito.items().filter((articulo) => articulo.id !== identificadorProducto));
        avisarCambio('carrito');
    },
    // ELIMINA TODOS LOS ARTÍCULOS DEL CARRITO.
    vaciar() { guardar('carrito', []); avisarCambio('carrito'); }
};

export const favoritos = {
    // DEVUELVE LOS IDENTIFICADORES DE PRODUCTOS FAVORITOS EXISTENTES.
    lista() { return leer('favoritos', []).filter((identificadorProducto) => existeProducto(identificadorProducto)); },
    // INDICA SI UN PRODUCTO FORMA PARTE DE FAVORITOS.
    tiene(identificadorProducto) { return favoritos.lista().indexOf(identificadorProducto) > -1; },
    // AÑADE O QUITA UN PRODUCTO DE LA LISTA DE FAVORITOS.
    alternar(identificadorProducto) {
        const identificadoresFavoritos = favoritos.lista();
        const indiceFavorito = identificadoresFavoritos.indexOf(identificadorProducto);
        if (indiceFavorito > -1) identificadoresFavoritos.splice(indiceFavorito, 1);
        else identificadoresFavoritos.push(identificadorProducto);
        guardar('favoritos', identificadoresFavoritos); avisarCambio('favoritos');
        return indiceFavorito === -1;
    }
};
