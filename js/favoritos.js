(function () {
    'use strict';
    var $ = OKI.$;
    var grid = $('#favGrid');
    if (!grid) return;

    function pintar() {
        var lista = OKI.favoritos.lista().map(buscarProducto);
        grid.innerHTML = lista.map(OKI.tarjetaHTML).join('');
        $('#favEmpty').hidden = lista.length > 0;
        $('#favActions').hidden = lista.length === 0;
        $('#favCountText').textContent = lista.length + (lista.length === 1 ? ' reloj guardado' : ' relojes guardados');
        OKI.pintarCorazones();
        OKI.prepararFotos(grid);
    }

    $('#favAllToCart').addEventListener('click', function () {
        var lista = OKI.favoritos.lista();
        lista.forEach(function (id) { OKI.carrito.anadir(id, 1); });
        OKI.aviso(lista.length + (lista.length === 1 ? ' reloj añadido' : ' relojes añadidos') + ' al carrito');
        OKI.abrirMiniCarrito();
    });

    document.addEventListener('oki:favoritos', pintar);
    pintar();
})();
