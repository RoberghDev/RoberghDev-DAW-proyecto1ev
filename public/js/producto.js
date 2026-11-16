(function () {
    'use strict';
    var $ = OKI.$, $$ = OKI.$$;
    var actual = null;

    function idDeLaDireccion() {
        var id = decodeURIComponent(location.hash.slice(1));
        return buscarProducto(id) ? id : PRODUCTOS[0].id;
    }

    function fila(nombre, valor) {
        return '<tr><th scope="row">' + nombre + '</th><td>' + valor + '</td></tr>';
    }

    function pintarGaleria(p) {
        var grande = $('#pFoto');
        grande.src = fotoProducto(p, 1);
        grande.alt = p.nombre + ': caja de ' + TEXTOS_CAJA[p.caja].toLowerCase() + ' y ' + p.correaTexto.toLowerCase();

        var miniaturas = $('#pThumbs');
        miniaturas.innerHTML = [1, 2, 3].map(function (n) {
            return '<button type="button" data-n="' + n + '" aria-pressed="' + (n === 1) + '" aria-label="Ver foto ' + n + ' de ' + p.nombre + '">' +
                '<img src="' + fotoProducto(p, n) + '" alt=""></button>';
        }).join('');
        miniaturas.hidden = true;
        $$('img', miniaturas).forEach(function (img) {
            img.addEventListener('error', function () {
                img.parentNode.remove();
                miniaturas.hidden = $$('button', miniaturas).length < 2;
            });
            img.addEventListener('load', function () {
                miniaturas.hidden = $$('button', miniaturas).length < 2;
            });
        });
    }

    $('#pThumbs').addEventListener('click', function (e) {
        var b = e.target.closest('button');
        if (!b) return;
        $('#pFoto').src = fotoProducto(actual, Number(b.getAttribute('data-n')));
        $$('#pThumbs button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    });

    function pintar(id) {
        var p = buscarProducto(id), c = buscarColeccion(p.coleccion);
        actual = p;
        document.title = 'OKIDOKEI · ' + p.nombre;
        $('#crumbColeccion').textContent = c.nombre;
        $('#crumbColeccion').href = 'colecciones.html#' + c.id;
        $('#crumbNombre').textContent = p.nombre;
        $('#pColeccion').textContent = 'Colección ' + c.nombre + ' · ' + c.categoria;
        $('#pNombre').textContent = p.nombre;
        $('#pRef').textContent = 'Ref. ' + p.ref + (p.limitado ? ' · Edición limitada a 100 piezas' : '');
        $('#pPrecio').textContent = precioTexto(p.precio);
        $('#pDesc').textContent = c.descripcion;
        $('#pTag').textContent = p.limitado ? 'Edición limitada' : p.nuevo ? 'Nuevo' : '';
        $('#pTag').hidden = !(p.limitado || p.nuevo);
        pintarGaleria(p);

        $('#pVariantes').innerHTML = productosDe(c.id).map(function (v) {
            return '<a class="variant" href="producto.html#' + v.id + '"' + (v.id === p.id ? ' aria-current="true"' : '') + '>' +
                '<span class="variant-swatch sw-' + v.caja + '"></span><span><strong>' + TEXTOS_CAJA[v.caja] + '</strong>' + v.correaTexto + '</span><em>' + precioTexto(v.precio) + '</em></a>';
        }).join('');

        $('#pSpecs').innerHTML =
            fila('Referencia', p.ref) +
            fila('Caja', TEXTOS_CAJA[p.caja] + ', ' + p.mm + ' mm') +
            fila('Movimiento', p.movimiento) +
            fila('Reserva de marcha', p.reserva) +
            fila('Hermeticidad', p.agua) +
            fila('Cristal', p.cristal) +
            fila('Correa', p.correaTexto);

        $('#pFav').setAttribute('data-fav', p.id);
        $('#pQty').value = 1;

        var otros = PRODUCTOS.filter(function (x) { return x.id !== p.id && x.coleccion === p.coleccion; })
            .concat(PRODUCTOS.filter(function (x) { return x.coleccion !== p.coleccion && buscarColeccion(x.coleccion).principal === x.id; }))
            .slice(0, 4);
        $('#pRelacionados').innerHTML = otros.map(OKI.tarjetaHTML).join('');
        OKI.pintarCorazones();
        OKI.prepararFotos(document);
    }

    var qty = $('#pQty');
    $$('[data-step]').forEach(function (b) {
        b.addEventListener('click', function () {
            qty.value = Math.max(1, Math.min(9, (parseInt(qty.value, 10) || 1) + Number(b.getAttribute('data-step'))));
        });
    });
    $('#pAdd').addEventListener('click', function () {
        var n = Math.max(1, Math.min(9, parseInt(qty.value, 10) || 1));
        OKI.carrito.anadir(actual.id, n);
        OKI.aviso(n + ' × ' + actual.nombre + ' añadido al carrito');
        OKI.abrirMiniCarrito();
    });

    window.addEventListener('hashchange', function () {
        pintar(idDeLaDireccion());
        window.scrollTo({ top: 0, behavior: OKI.reduceMotion ? 'auto' : 'smooth' });
    });
    pintar(idDeLaDireccion());
})();
