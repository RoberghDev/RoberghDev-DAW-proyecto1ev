(function () {
    'use strict';
    var $ = OKI.$;
    var lista = $('#cartRows');
    if (!lista) return;

    function pintar() {
        var items = OKI.carrito.items();
        $('#cartPageEmpty').hidden = items.length > 0;
        $('#cartPageFull').hidden = items.length === 0;
        lista.innerHTML = items.map(function (it) {
            var p = buscarProducto(it.id), c = buscarColeccion(p.coleccion);
            return '<li class="row-item" data-id="' + p.id + '">' +
                '<a class="row-thumb foto" href="producto.html#' + p.id + '"><img src="' + fotoProducto(p) + '" alt="' + p.nombre + '" data-foto></a>' +
                '<div class="row-info"><p class="card-coll">' + c.nombre + '</p><h3><a href="producto.html#' + p.id + '">' + p.nombre + '</a></h3>' +
                '<p class="row-spec">' + resumenProducto(p) + ' · ' + p.correaTexto + '</p>' +
                '<button type="button" class="rm" data-rm><svg class="icon" aria-hidden="true"><use href="#i-trash"/></svg>Eliminar</button></div>' +
                '<div class="qty"><button type="button" data-q="-1" aria-label="Quitar una unidad de ' + p.nombre + '"><svg class="icon"><use href="#i-minus"/></svg></button><span>' + it.qty + '</span>' +
                '<button type="button" data-q="1" aria-label="Añadir una unidad de ' + p.nombre + '"><svg class="icon"><use href="#i-plus"/></svg></button></div>' +
                '<p class="row-price">' + precioTexto(p.precio * it.qty) + (it.qty > 1 ? '<small>' + precioTexto(p.precio) + ' / ud.</small>' : '') + '</p></li>';
        }).join('');
        var total = OKI.carrito.total(), q = OKI.carrito.cantidad();
        $('#sumItems').textContent = q + (q === 1 ? ' artículo' : ' artículos');
        $('#sumSubtotal').textContent = precioTexto(total);
        $('#sumTotal').textContent = precioTexto(total);
        $('#sumIva').textContent = 'Incluye ' + precioTexto(Math.round(total - total / 1.21)) + ' de IVA (21 %)';
        OKI.prepararFotos(lista);
    }

    lista.addEventListener('click', function (e) {
        var fila = e.target.closest('.row-item'); if (!fila) return;
        var id = fila.getAttribute('data-id'), it = OKI.carrito.items().filter(function (x) { return x.id === id; })[0];
        var b = e.target.closest('[data-q]');
        if (b && it) OKI.carrito.poner(id, it.qty + Number(b.getAttribute('data-q')));
        if (e.target.closest('[data-rm]')) { OKI.carrito.quitar(id); OKI.aviso(buscarProducto(id).nombre + ' eliminado del carrito'); }
    });
    $('#cartClear').addEventListener('click', function () { OKI.carrito.vaciar(); OKI.aviso('Carrito vaciado'); });
    $('#checkout').addEventListener('submit', function (e) {
        e.preventDefault();
        var msg = $('#checkoutMsg');
        if (!$('#acepto').checked) { msg.textContent = 'Acepta las condiciones de compra para continuar.'; return; }
        msg.textContent = 'Pago de prueba: aquí se conectará la pasarela de pago de la tienda.';
    });

    document.addEventListener('oki:carrito', pintar);
    pintar();
})();
