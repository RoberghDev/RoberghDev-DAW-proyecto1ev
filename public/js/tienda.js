(function () {
    'use strict';
    var seleccionar = OKI.$;
    var seleccionarTodos = OKI.$$;
    var cuadrillaTienda = seleccionar('#shopGrid');
    if (!cuadrillaTienda) return;

    var tarjetasProducto = seleccionarTodos('.card', cuadrillaTienda);
    var estadoFiltros = { coleccion: 'todas', caja: 'todas', correa: 'todas', novedades: false, orden: 'destacados' };
    var botonesColeccion = seleccionarTodos('[data-filtro-coleccion]');
    var selectorCaja = seleccionar('#fCaja');
    var selectorCorrea = seleccionar('#fCorrea');
    var selectorOrden = seleccionar('#fOrden');
    var casillaNovedades = seleccionar('#fNuevos');

    // APLICA FILTROS, ORDEN Y ESTADO VISUAL AL CATÁLOGO.
    function aplicarFiltros(actualizarDireccion) {
        var productosVisibles = tarjetasProducto.filter(function (tarjetaProducto) {
            var coincideConFiltros = (estadoFiltros.coleccion === 'todas' || tarjetaProducto.dataset.coleccion === estadoFiltros.coleccion) &&
                (estadoFiltros.caja === 'todas' || tarjetaProducto.dataset.caja === estadoFiltros.caja) &&
                (estadoFiltros.correa === 'todas' || tarjetaProducto.dataset.correa === estadoFiltros.correa) &&
                (!estadoFiltros.novedades || tarjetaProducto.dataset.nuevo === 'si');
            tarjetaProducto.hidden = !coincideConFiltros;
            return coincideConFiltros;
        });
        var tarjetasOrdenadas = tarjetasProducto.slice().sort(function (primeraTarjeta, segundaTarjeta) {
            if (estadoFiltros.orden === 'precio-asc') return primeraTarjeta.dataset.precio - segundaTarjeta.dataset.precio;
            if (estadoFiltros.orden === 'precio-desc') return segundaTarjeta.dataset.precio - primeraTarjeta.dataset.precio;
            if (estadoFiltros.orden === 'nombre') return primeraTarjeta.dataset.nombre.localeCompare(segundaTarjeta.dataset.nombre, 'es');
            return primeraTarjeta.dataset.orden - segundaTarjeta.dataset.orden;
        });
        tarjetasOrdenadas.forEach(function (tarjetaProducto) { cuadrillaTienda.appendChild(tarjetaProducto); });

        botonesColeccion.forEach(function (botonColeccion) {
            botonColeccion.setAttribute('aria-pressed', botonColeccion.getAttribute('data-filtro-coleccion') === estadoFiltros.coleccion ? 'true' : 'false');
        });
        selectorCaja.value = estadoFiltros.caja;
        selectorCorrea.value = estadoFiltros.correa;
        selectorOrden.value = estadoFiltros.orden;
        casillaNovedades.checked = estadoFiltros.novedades;
        seleccionar('#shopCount').textContent = productosVisibles.length + (productosVisibles.length === 1 ? ' reloj' : ' relojes');
        seleccionar('#shopEmpty').hidden = productosVisibles.length > 0;

        var coleccionSeleccionada = buscarColeccion(estadoFiltros.coleccion);
        seleccionar('#shopTitle').textContent = coleccionSeleccionada ? 'Colección ' + coleccionSeleccionada.nombre : estadoFiltros.novedades ? 'Novedades' : 'Todos los relojes';

        if (actualizarDireccion && history.replaceState) {
            var fragmentoDireccion = estadoFiltros.coleccion !== 'todas' ? '#' + estadoFiltros.coleccion : estadoFiltros.novedades ? '#novedades' : '';
            history.replaceState(null, '', location.pathname + fragmentoDireccion);
        }
    }

    // RESTAURA LOS FILTROS DE LA URL ACTUAL.
    function leerDireccion() {
        var fragmentoDireccion = location.hash.slice(1);
        estadoFiltros.coleccion = 'todas';
        estadoFiltros.novedades = false;
        if (fragmentoDireccion === 'novedades') estadoFiltros.novedades = true;
        else if (fragmentoDireccion === 'limitadas') estadoFiltros.coleccion = 'origine';
        else if (buscarColeccion(fragmentoDireccion)) estadoFiltros.coleccion = fragmentoDireccion;
        aplicarFiltros(false);
    }

    botonesColeccion.forEach(function (botonColeccion) {
        // FILTRA EL CATÁLOGO POR LA COLECCIÓN SELECCIONADA.
        botonColeccion.addEventListener('click', function () {
            estadoFiltros.coleccion = botonColeccion.getAttribute('data-filtro-coleccion');
            aplicarFiltros(true);
        });
    });

    // ACTUALIZA EL FILTRO DE CAJA CUANDO CAMBIA SU SELECTOR.
    selectorCaja.addEventListener('change', function () {
        estadoFiltros.caja = selectorCaja.value;
        aplicarFiltros(true);
    });

    // ACTUALIZA EL FILTRO DE CORREA CUANDO CAMBIA SU SELECTOR.
    selectorCorrea.addEventListener('change', function () {
        estadoFiltros.correa = selectorCorrea.value;
        aplicarFiltros(true);
    });

    // ACTUALIZA EL ORDEN DEL CATÁLOGO.
    selectorOrden.addEventListener('change', function () {
        estadoFiltros.orden = selectorOrden.value;
        aplicarFiltros(true);
    });

    // ACTIVA O DESACTIVA EL FILTRO DE NOVEDADES.
    casillaNovedades.addEventListener('change', function () {
        estadoFiltros.novedades = casillaNovedades.checked;
        aplicarFiltros(true);
    });

    seleccionarTodos('[data-limpiar]').forEach(function (botonLimpiar) {
        // RESTABLECE TODOS LOS FILTROS A SUS VALORES INICIALES.
        botonLimpiar.addEventListener('click', function () {
            estadoFiltros = { coleccion: 'todas', caja: 'todas', correa: 'todas', novedades: false, orden: 'destacados' };
            aplicarFiltros(true);
        });
    });

    // ACTUALIZA LOS FILTROS SI CAMBIA EL FRAGMENTO DE LA URL.
    window.addEventListener('hashchange', leerDireccion);
    leerDireccion();
})();
