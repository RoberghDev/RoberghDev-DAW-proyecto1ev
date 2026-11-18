var COLECCIONES = [
    {
        id: 'esqueleto', nombre: 'Esqueleto', categoria: 'Esqueleto', lema: 'El arte en movimiento',
        titulo: 'ESQUELETO', sub: 'Fuerza y elegancia<br>con el movimiento a la vista',
        descripcion: 'Puentes vaciados y un calibre automático que se deja ver entero a través de la esfera. Para quien quiere mirar cómo late el tiempo.',
        principal: 'esqueleto-cobre',
        modelo3d: { bezel: 'domed', screws: true, dial: 'skeleton', hands: 'dauphine', handMat: 'copper', secMat: 'copper' }
    },
    {
        id: 'heritage', nombre: 'Heritage', categoria: 'Vestir', lema: 'Elegancia atemporal',
        titulo: 'HERITAGE', sub: 'La esfera clásica<br>que nunca pasa de moda',
        descripcion: 'Esfera lacada blanca, números romanos con el IIII de los relojeros y una caja fina que se desliza bajo el puño de la camisa.',
        principal: 'heritage-cobre',
        modelo3d: { bezel: 'thin', dial: 'heritage', hands: 'leaf', handMat: 'blackPolish', secMat: 'copper' }
    },
    {
        id: 'marine', nombre: 'Marine', categoria: 'Deportivos', lema: 'Hechos para la acción',
        titulo: 'MARINE', sub: 'Hermético hasta 300 metros<br>con bisel giratorio',
        descripcion: 'Bisel unidireccional negro, índices luminiscentes y 300 metros de hermeticidad. Del barco a la oficina sin cambiar de reloj.',
        principal: 'marine-acero',
        modelo3d: { bezel: 'diver', dial: 'marine', hands: 'baton', handMat: 'steel', secMat: 'copper' }
    },
    {
        id: 'noir', nombre: 'Noir', categoria: 'Noir', lema: 'Negro y cobre',
        titulo: 'NOIR', sub: 'Acero negro e índices de cobre<br>para la noche',
        descripcion: 'Caja de acero con tratamiento negro, esfera rayos de sol e índices aplicados de cobre que atrapan la luz.',
        principal: 'noir-caucho',
        modelo3d: { bezel: 'stepped', dial: 'noir', hands: 'dauphine', handMat: 'copper', secMat: 'copper', applied: 'copperBrushed' }
    },
    {
        id: 'luna', nombre: 'Luna', categoria: 'Fases lunares', lema: 'El cielo en tu muñeca',
        titulo: 'LUNA', sub: 'Fases lunares<br>sobre esfera lacada blanca',
        descripcion: 'Una ventana a las 6 sigue el ciclo de 29,5 días de la luna, con dos lunas de cobre sobre un cielo negro.',
        principal: 'luna-acero',
        modelo3d: { bezel: 'thin', dial: 'luna', hands: 'dauphine', handMat: 'copper', secMat: 'copper', applied: 'copper', moon: true }
    },
    {
        id: 'origine', nombre: 'Origine', categoria: 'Ediciones limitadas', lema: 'Piezas numeradas',
        titulo: 'ORIGINE', sub: 'Tourbillon a la vista<br>edición limitada a 100 piezas',
        descripcion: 'Caja de cobre de 43 mm, esfera negra guilloché y un tourbillon que gira a la vista a las 6. Solo 100 piezas numeradas, cada una con su certificado.',
        principal: 'origine',
        modelo3d: { bezel: 'stepped', screws: true, dial: 'origine', hands: 'dauphine', handMat: 'copper', secMat: null, tourbillon: true }
    }
];

var PRODUCTOS = [
    { id: 'esqueleto-cobre', coleccion: 'esqueleto', nombre: 'Esqueleto Cobre', precio: 4950, nuevo: true,
      caja: 'cobre', correa: 'piel', mm: 42, movimiento: 'Automático esqueletado', reserva: '42 horas', agua: '5 ATM (50 m)',
      cristal: 'Zafiro abombado antirreflejos', correaTexto: 'Piel marrón con pespunte crudo', ref: 'OK-1201',
      modelo: { caseMat: 'copper', strap: 'leather', strapColor: '#4b2b1b', stitch: '#d3ab86' } },
    { id: 'esqueleto-acero', coleccion: 'esqueleto', nombre: 'Esqueleto Acero', precio: 4650,
      caja: 'acero', correa: 'piel', mm: 42, movimiento: 'Automático esqueletado', reserva: '42 horas', agua: '5 ATM (50 m)',
      cristal: 'Zafiro abombado antirreflejos', correaTexto: 'Piel negra con pespunte cobre', ref: 'OK-1202',
      modelo: { caseMat: 'steel', strap: 'leather', strapColor: '#141414', stitch: '#c98a5f' } },
    { id: 'heritage-cobre', coleccion: 'heritage', nombre: 'Heritage Cobre', precio: 1980,
      caja: 'cobre', correa: 'piel', mm: 40, movimiento: 'Automático', reserva: '40 horas', agua: '3 ATM (30 m)',
      cristal: 'Zafiro', correaTexto: 'Piel marrón oscuro', ref: 'OK-1101',
      modelo: { caseMat: 'copper', strap: 'leather', strapColor: '#2b1a11', stitch: '#9a7558' } },
    { id: 'heritage-acero', coleccion: 'heritage', nombre: 'Heritage Acero', precio: 1790,
      caja: 'acero', correa: 'piel', mm: 40, movimiento: 'Automático', reserva: '40 horas', agua: '3 ATM (30 m)',
      cristal: 'Zafiro', correaTexto: 'Piel negra', ref: 'OK-1102',
      modelo: { caseMat: 'steel', strap: 'leather', strapColor: '#131313', stitch: '#6d6763' } },
    { id: 'marine-acero', coleccion: 'marine', nombre: 'Marine Acero', precio: 2890,
      caja: 'acero', correa: 'acero', mm: 42, movimiento: 'Automático', reserva: '42 horas', agua: '30 ATM (300 m)',
      cristal: 'Zafiro', correaTexto: 'Brazalete de acero de tres eslabones', ref: 'OK-1301',
      modelo: { caseMat: 'steel', strap: 'bracelet' } },
    { id: 'marine-caucho', coleccion: 'marine', nombre: 'Marine Caucho', precio: 2690, nuevo: true,
      caja: 'acero', correa: 'caucho', mm: 42, movimiento: 'Automático', reserva: '42 horas', agua: '30 ATM (300 m)',
      cristal: 'Zafiro', correaTexto: 'Caucho negro', ref: 'OK-1302',
      modelo: { caseMat: 'steel', strap: 'rubber' } },
    { id: 'marine-cobre', coleccion: 'marine', nombre: 'Marine Cobre', precio: 3190,
      caja: 'cobre', correa: 'caucho', mm: 42, movimiento: 'Automático', reserva: '42 horas', agua: '30 ATM (300 m)',
      cristal: 'Zafiro', correaTexto: 'Caucho negro', ref: 'OK-1303',
      modelo: { caseMat: 'copper', strap: 'rubber' } },
    { id: 'noir-caucho', coleccion: 'noir', nombre: 'Noir Caucho', precio: 3450, nuevo: true,
      caja: 'negro', correa: 'caucho', mm: 41, movimiento: 'Automático', reserva: '42 horas', agua: '10 ATM (100 m)',
      cristal: 'Zafiro', correaTexto: 'Caucho negro', ref: 'OK-1401',
      modelo: { caseMat: 'black', strap: 'rubber' } },
    { id: 'noir-piel', coleccion: 'noir', nombre: 'Noir Piel', precio: 3390,
      caja: 'negro', correa: 'piel', mm: 41, movimiento: 'Automático', reserva: '42 horas', agua: '10 ATM (100 m)',
      cristal: 'Zafiro', correaTexto: 'Piel negra con pespunte cobre', ref: 'OK-1402',
      modelo: { caseMat: 'black', strap: 'leather', strapColor: '#121212', stitch: '#c98a5f' } },
    { id: 'luna-acero', coleccion: 'luna', nombre: 'Luna Acero', precio: 3150,
      caja: 'acero', correa: 'piel', mm: 40, movimiento: 'Automático con fase lunar', reserva: '40 horas', agua: '3 ATM (30 m)',
      cristal: 'Zafiro', correaTexto: 'Piel negra con pespunte cobre', ref: 'OK-1501',
      modelo: { caseMat: 'steel', strap: 'leather', strapColor: '#151414', stitch: '#c98a5f' } },
    { id: 'luna-cobre', coleccion: 'luna', nombre: 'Luna Cobre', precio: 3350, nuevo: true,
      caja: 'cobre', correa: 'piel', mm: 40, movimiento: 'Automático con fase lunar', reserva: '40 horas', agua: '3 ATM (30 m)',
      cristal: 'Zafiro', correaTexto: 'Piel marrón', ref: 'OK-1502',
      modelo: { caseMat: 'copper', strap: 'leather', strapColor: '#3d2416', stitch: '#d3ab86' } },
    { id: 'origine', coleccion: 'origine', nombre: 'Origine Tourbillon', precio: 18900, limitado: true,
      caja: 'cobre', correa: 'piel', mm: 43, movimiento: 'Tourbillon de carga manual', reserva: '72 horas', agua: '3 ATM (30 m)',
      cristal: 'Zafiro abombado antirreflejos', correaTexto: 'Piel negra con pespunte cobre', ref: 'OK-1601',
      modelo: { caseMat: 'copper', strap: 'leather', strapColor: '#0e0e0e', stitch: '#c98a5f' } }
];

var TEXTOS_CAJA = { cobre: 'Cobre', acero: 'Acero', negro: 'Acero negro' };
var TEXTOS_CORREA = { piel: 'Piel', acero: 'Brazalete de acero', caucho: 'Caucho' };

// BUSCA UN PRODUCTO POR SU IDENTIFICADOR.
function buscarProducto(identificadorProducto) {
    for (var indiceProducto = 0; indiceProducto < PRODUCTOS.length; indiceProducto++) {
        if (PRODUCTOS[indiceProducto].id === identificadorProducto) return PRODUCTOS[indiceProducto];
    }
    return null;
}

// BUSCA UNA COLECCIÓN POR SU IDENTIFICADOR.
function buscarColeccion(identificadorColeccion) {
    for (var indiceColeccion = 0; indiceColeccion < COLECCIONES.length; indiceColeccion++) {
        if (COLECCIONES[indiceColeccion].id === identificadorColeccion) return COLECCIONES[indiceColeccion];
    }
    return null;
}

// DEVUELVE LOS PRODUCTOS PERTENECIENTES A UNA COLECCIÓN.
function productosDe(identificadorColeccion) {
    return PRODUCTOS.filter(function (producto) { return producto.coleccion === identificadorColeccion; });
}

// CONSTRUYE LA RUTA DE LA FOTOGRAFÍA INDICADA PARA UN PRODUCTO.
function fotoProducto(producto, numeroFotografia) {
    return 'assets/relojes/' + producto.id + (numeroFotografia > 1 ? '-' + numeroFotografia : '') + '.jpg';
}

// FORMATEA UN PRECIO CON SEPARADOR DE MILES Y SÍMBOLO DE EURO.
function precioTexto(precio) {
    return String(precio).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €';
}

// GENERA EL RESUMEN TÉCNICO BREVE DE UN PRODUCTO.
function resumenProducto(producto) {
    return producto.movimiento + ' · ' + TEXTOS_CAJA[producto.caja] + ' · ' + producto.mm + ' mm';
}

export { COLECCIONES, PRODUCTOS, TEXTOS_CAJA, TEXTOS_CORREA, buscarProducto, buscarColeccion, productosDe, fotoProducto, precioTexto, resumenProducto };
