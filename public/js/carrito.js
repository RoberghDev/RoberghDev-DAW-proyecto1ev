(function () {
    'use strict';
    var seleccionar = OKI.$;
    var listaFilasCarrito = seleccionar('#cartRows');
    if (!listaFilasCarrito) return;

    // ACTUALIZA LAS FILAS Y EL RESUMEN DEL CARRITO.
    function pintarCarrito() {
        var articulosCarrito = OKI.carrito.items();
        seleccionar('#cartPageEmpty').hidden = articulosCarrito.length > 0;
        seleccionar('#cartPageFull').hidden = articulosCarrito.length === 0;
        listaFilasCarrito.innerHTML = articulosCarrito.map(function (articuloCarrito) {
            var producto = buscarProducto(articuloCarrito.id);
            var coleccion = buscarColeccion(producto.coleccion);
            return '<li class="row-item" data-id="' + producto.id + '">' +
                '<a class="row-thumb foto" href="producto.html#' + producto.id + '"><img src="' + fotoProducto(producto) + '" alt="' + producto.nombre + '" data-foto></a>' +
                '<div class="row-info"><p class="card-coll">' + coleccion.nombre + '</p><h3><a href="producto.html#' + producto.id + '">' + producto.nombre + '</a></h3>' +
                '<p class="row-spec">' + resumenProducto(producto) + ' · ' + producto.correaTexto + '</p>' +
                '<button type="button" class="rm" data-rm><svg class="icon" aria-hidden="true"><use href="#i-trash"/></svg>Eliminar</button></div>' +
                '<div class="qty"><button type="button" data-q="-1" aria-label="Quitar una unidad de ' + producto.nombre + '"><svg class="icon"><use href="#i-minus"/></svg></button><span>' + articuloCarrito.qty + '</span>' +
                '<button type="button" data-q="1" aria-label="Añadir una unidad de ' + producto.nombre + '"><svg class="icon"><use href="#i-plus"/></svg></button></div>' +
                '<p class="row-price">' + precioTexto(producto.precio * articuloCarrito.qty) + (articuloCarrito.qty > 1 ? '<small>' + precioTexto(producto.precio) + ' / ud.</small>' : '') + '</p></li>';
        }).join('');
        var totalCarrito = OKI.carrito.total();
        var cantidadArticulos = OKI.carrito.cantidad();
        seleccionar('#sumItems').textContent = cantidadArticulos + (cantidadArticulos === 1 ? ' artículo' : ' artículos');
        seleccionar('#sumSubtotal').textContent = precioTexto(totalCarrito);
        seleccionar('#sumTotal').textContent = precioTexto(totalCarrito);
        seleccionar('#sumIva').textContent = 'Incluye ' + precioTexto(Math.round(totalCarrito - totalCarrito / 1.21)) + ' de IVA (21 %)';
        OKI.prepararFotos(listaFilasCarrito);
    }

    // PROCESA LOS CAMBIOS DE CANTIDAD Y LA ELIMINACIÓN DE ARTÍCULOS.
    listaFilasCarrito.addEventListener('click', function (evento) {
        var filaCarrito = evento.target.closest('.row-item');
        if (!filaCarrito) return;
        var identificadorProducto = filaCarrito.getAttribute('data-id');
        var articuloCarrito = OKI.carrito.items().filter(function (articulo) {
            return articulo.id === identificadorProducto;
        })[0];
        var botonCantidad = evento.target.closest('[data-q]');
        if (botonCantidad && articuloCarrito) {
            OKI.carrito.poner(identificadorProducto, articuloCarrito.qty + Number(botonCantidad.getAttribute('data-q')));
        }
        if (evento.target.closest('[data-rm]')) {
            OKI.carrito.quitar(identificadorProducto);
            OKI.aviso(buscarProducto(identificadorProducto).nombre + ' eliminado del carrito');
        }
    });

    // VACÍA EL CARRITO AL ACTIVAR EL BOTÓN CORRESPONDIENTE.
    seleccionar('#cartClear').addEventListener('click', function () {
        OKI.carrito.vaciar();
        OKI.aviso('Carrito vaciado');
    });

    // VALIDA LA ACEPTACIÓN DE CONDICIONES ANTES DEL PAGO DE PRUEBA.
    seleccionar('#checkout').addEventListener('submit', function (evento) {
        evento.preventDefault();
        var mensajeCheckout = seleccionar('#checkoutMsg');
        if (!seleccionar('#acepto').checked) {
            mensajeCheckout.textContent = 'Acepta las condiciones de compra para continuar.';
            return;
        }
        mensajeCheckout.textContent = 'Pago de prueba: aquí se conectará la pasarela de pago de la tienda.';
    });

    // REPINTA EL CARRITO CUANDO CAMBIA SU CONTENIDO.
    document.addEventListener('oki:carrito', pintarCarrito);
    pintarCarrito();
})();
