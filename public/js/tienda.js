(function () {
    'use strict';
    var $ = OKI.$, $$ = OKI.$$;
    var grid = $('#shopGrid');
    if (!grid) return;

    var tarjetas = $$('.card', grid);
    var estado = { coleccion: 'todas', caja: 'todas', correa: 'todas', novedades: false, orden: 'destacados' };
    var chips = $$('[data-filtro-coleccion]');
    var selCaja = $('#fCaja'), selCorrea = $('#fCorrea'), selOrden = $('#fOrden'), chkNuevos = $('#fNuevos');

    function aplicar(actualizarDireccion) {
        var visibles = tarjetas.filter(function (t) {
            var ok = (estado.coleccion === 'todas' || t.dataset.coleccion === estado.coleccion) &&
                (estado.caja === 'todas' || t.dataset.caja === estado.caja) &&
                (estado.correa === 'todas' || t.dataset.correa === estado.correa) &&
                (!estado.novedades || t.dataset.nuevo === 'si');
            t.hidden = !ok;
            return ok;
        });
        var orden = tarjetas.slice().sort(function (a, b) {
            if (estado.orden === 'precio-asc') return a.dataset.precio - b.dataset.precio;
            if (estado.orden === 'precio-desc') return b.dataset.precio - a.dataset.precio;
            if (estado.orden === 'nombre') return a.dataset.nombre.localeCompare(b.dataset.nombre, 'es');
            return a.dataset.orden - b.dataset.orden;
        });
        orden.forEach(function (t) { grid.appendChild(t); });

        chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-filtro-coleccion') === estado.coleccion ? 'true' : 'false'); });
        selCaja.value = estado.caja; selCorrea.value = estado.correa; selOrden.value = estado.orden; chkNuevos.checked = estado.novedades;
        $('#shopCount').textContent = visibles.length + (visibles.length === 1 ? ' reloj' : ' relojes');
        $('#shopEmpty').hidden = visibles.length > 0;

        var c = buscarColeccion(estado.coleccion);
        $('#shopTitle').textContent = c ? 'Colección ' + c.nombre : estado.novedades ? 'Novedades' : 'Todos los relojes';

        if (actualizarDireccion && history.replaceState) {
            var hash = estado.coleccion !== 'todas' ? '#' + estado.coleccion : estado.novedades ? '#novedades' : '';
            history.replaceState(null, '', location.pathname + hash);
        }
    }

    function leerDireccion() {
        var h = location.hash.slice(1);
        estado.coleccion = 'todas'; estado.novedades = false;
        if (h === 'novedades') estado.novedades = true;
        else if (h === 'limitadas') estado.coleccion = 'origine';
        else if (buscarColeccion(h)) estado.coleccion = h;
        aplicar(false);
    }

    chips.forEach(function (c) {
        c.addEventListener('click', function () { estado.coleccion = c.getAttribute('data-filtro-coleccion'); aplicar(true); });
    });
    selCaja.addEventListener('change', function () { estado.caja = selCaja.value; aplicar(true); });
    selCorrea.addEventListener('change', function () { estado.correa = selCorrea.value; aplicar(true); });
    selOrden.addEventListener('change', function () { estado.orden = selOrden.value; aplicar(true); });
    chkNuevos.addEventListener('change', function () { estado.novedades = chkNuevos.checked; aplicar(true); });
    $$('[data-limpiar]').forEach(function (b) {
        b.addEventListener('click', function () { estado = { coleccion: 'todas', caja: 'todas', correa: 'todas', novedades: false, orden: 'destacados' }; aplicar(true); });
    });
    window.addEventListener('hashchange', leerDireccion);
    leerDireccion();
})();
