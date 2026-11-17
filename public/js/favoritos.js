(function () {
    'use strict';
    var seleccionar = OKI.$;
    var cuadrillaFavoritos = seleccionar('#favGrid');
    if (!cuadrillaFavoritos) return;

    // ACTUALIZA LA LISTA DE FAVORITOS Y SU ESTADO VISUAL.
    function pintarFavoritos() {
        var productosFavoritos = OKI.favoritos.lista().map(buscarProducto);
        cuadrillaFavoritos.innerHTML = productosFavoritos.map(OKI.tarjetaHTML).join('');
        seleccionar('#favEmpty').hidden = productosFavoritos.length > 0;
        seleccionar('#favActions').hidden = productosFavoritos.length === 0;
        seleccionar('#favCountText').textContent = productosFavoritos.length + (productosFavoritos.length === 1 ? ' reloj guardado' : ' relojes guardados');
        OKI.pintarCorazones();
        OKI.prepararFotos(cuadrillaFavoritos);
    }

    // AÑADE TODOS LOS FAVORITOS AL CARRITO Y ABRE EL MINICARRITO.
    seleccionar('#favAllToCart').addEventListener('click', function () {
        var identificadoresFavoritos = OKI.favoritos.lista();
        identificadoresFavoritos.forEach(function (identificadorProducto) {
            OKI.carrito.anadir(identificadorProducto, 1);
        });
        OKI.aviso(identificadoresFavoritos.length + (identificadoresFavoritos.length === 1 ? ' reloj añadido' : ' relojes añadidos') + ' al carrito');
        OKI.abrirMiniCarrito();
    });

    // REPINTA LA PÁGINA CUANDO CAMBIA LA LISTA DE FAVORITOS.
    document.addEventListener('oki:favoritos', pintarFavoritos);
    pintarFavoritos();
})();
