(function () {
    'use strict';
    var seleccionar = OKI.$;
    var seleccionarTodos = OKI.$$;
    var productoActual = null;

    // OBTIENE EL PRODUCTO INDICADO EN EL FRAGMENTO DE LA URL.
    function idDeLaDireccion() {
        var identificadorProducto = decodeURIComponent(location.hash.slice(1));
        return buscarProducto(identificadorProducto) ? identificadorProducto : PRODUCTOS[0].id;
    }

    // GENERA UNA FILA DE LA TABLA DE ESPECIFICACIONES.
    function crearFilaEspecificacion(nombreEspecificacion, valorEspecificacion) {
        return '<tr><th scope="row">' + nombreEspecificacion + '</th><td>' + valorEspecificacion + '</td></tr>';
    }

    // ACTUALIZA LA IMAGEN PRINCIPAL Y LAS MINIATURAS DEL PRODUCTO.
    function pintarGaleria(producto) {
        var imagenPrincipal = seleccionar('#pFoto');
        imagenPrincipal.src = fotoProducto(producto, 1);
        imagenPrincipal.alt = producto.nombre + ': caja de ' + TEXTOS_CAJA[producto.caja].toLowerCase() + ' y ' + producto.correaTexto.toLowerCase();

        var contenedorMiniaturas = seleccionar('#pThumbs');
        contenedorMiniaturas.innerHTML = [1, 2, 3].map(function (numeroFoto) {
            return '<button type="button" data-n="' + numeroFoto + '" aria-pressed="' + (numeroFoto === 1) + '" aria-label="Ver foto ' + numeroFoto + ' de ' + producto.nombre + '">' +
                '<img src="' + fotoProducto(producto, numeroFoto) + '" alt=""></button>';
        }).join('');
        contenedorMiniaturas.hidden = true;
        seleccionarTodos('img', contenedorMiniaturas).forEach(function (imagenMiniatura) {
            // ELIMINA LAS MINIATURAS CUYA IMAGEN NO SE PUEDE CARGAR.
            imagenMiniatura.addEventListener('error', function () {
                imagenMiniatura.parentNode.remove();
                contenedorMiniaturas.hidden = seleccionarTodos('button', contenedorMiniaturas).length < 2;
            });

            // MUESTRA LAS MINIATURAS CUANDO HAY SUFICIENTES IMÁGENES DISPONIBLES.
            imagenMiniatura.addEventListener('load', function () {
                contenedorMiniaturas.hidden = seleccionarTodos('button', contenedorMiniaturas).length < 2;
            });
        });
    }

    // CAMBIA LA FOTO PRINCIPAL AL SELECCIONAR UNA MINIATURA.
    seleccionar('#pThumbs').addEventListener('click', function (evento) {
        var botonMiniatura = evento.target.closest('button');
        if (!botonMiniatura) return;
        seleccionar('#pFoto').src = fotoProducto(productoActual, Number(botonMiniatura.getAttribute('data-n')));
        seleccionarTodos('#pThumbs button').forEach(function (otraMiniatura) {
            otraMiniatura.setAttribute('aria-pressed', otraMiniatura === botonMiniatura ? 'true' : 'false');
        });
    });

    // RENDERIZA LOS DATOS, VARIANTES Y PRODUCTOS RELACIONADOS.
    function pintarProducto(identificadorProducto) {
        var producto = buscarProducto(identificadorProducto);
        var coleccion = buscarColeccion(producto.coleccion);
        productoActual = producto;
        document.title = 'OKIDOKEI · ' + producto.nombre;
        seleccionar('#crumbColeccion').textContent = coleccion.nombre;
        seleccionar('#crumbColeccion').href = 'colecciones.html#' + coleccion.id;
        seleccionar('#crumbNombre').textContent = producto.nombre;
        seleccionar('#pColeccion').textContent = 'Colección ' + coleccion.nombre + ' · ' + coleccion.categoria;
        seleccionar('#pNombre').textContent = producto.nombre;
        seleccionar('#pRef').textContent = 'Ref. ' + producto.ref + (producto.limitado ? ' · Edición limitada a 100 piezas' : '');
        seleccionar('#pPrecio').textContent = precioTexto(producto.precio);
        seleccionar('#pDesc').textContent = coleccion.descripcion;
        seleccionar('#pTag').textContent = producto.limitado ? 'Edición limitada' : producto.nuevo ? 'Nuevo' : '';
        seleccionar('#pTag').hidden = !(producto.limitado || producto.nuevo);
        pintarGaleria(producto);

        seleccionar('#pVariantes').innerHTML = productosDe(coleccion.id).map(function (productoVariante) {
            return '<a class="variant" href="producto.html#' + productoVariante.id + '"' + (productoVariante.id === producto.id ? ' aria-current="true"' : '') + '>' +
                '<span class="variant-swatch sw-' + productoVariante.caja + '"></span><span><strong>' + TEXTOS_CAJA[productoVariante.caja] + '</strong>' + productoVariante.correaTexto + '</span><em>' + precioTexto(productoVariante.precio) + '</em></a>';
        }).join('');

        seleccionar('#pSpecs').innerHTML =
            crearFilaEspecificacion('Referencia', producto.ref) +
            crearFilaEspecificacion('Caja', TEXTOS_CAJA[producto.caja] + ', ' + producto.mm + ' mm') +
            crearFilaEspecificacion('Movimiento', producto.movimiento) +
            crearFilaEspecificacion('Reserva de marcha', producto.reserva) +
            crearFilaEspecificacion('Hermeticidad', producto.agua) +
            crearFilaEspecificacion('Cristal', producto.cristal) +
            crearFilaEspecificacion('Correa', producto.correaTexto);

        seleccionar('#pFav').setAttribute('data-fav', producto.id);
        seleccionar('#pQty').value = 1;

        var productosRelacionados = PRODUCTOS.filter(function (otroProducto) {
            return otroProducto.id !== producto.id && otroProducto.coleccion === producto.coleccion;
        }).concat(PRODUCTOS.filter(function (otroProducto) {
            return otroProducto.coleccion !== producto.coleccion && buscarColeccion(otroProducto.coleccion).principal === otroProducto.id;
        }))
            .slice(0, 4);
        seleccionar('#pRelacionados').innerHTML = productosRelacionados.map(OKI.tarjetaHTML).join('');
        OKI.pintarCorazones();
        OKI.prepararFotos(document);
    }

    var campoCantidad = seleccionar('#pQty');
    seleccionarTodos('[data-step]').forEach(function (botonPaso) {
        // AUMENTA O REDUCE LA CANTIDAD SOLICITADA DEL PRODUCTO.
        botonPaso.addEventListener('click', function () {
            campoCantidad.value = Math.max(1, Math.min(9, (parseInt(campoCantidad.value, 10) || 1) + Number(botonPaso.getAttribute('data-step'))));
        });
    });

    // AÑADE AL CARRITO LA CANTIDAD SELECCIONADA DEL PRODUCTO.
    seleccionar('#pAdd').addEventListener('click', function () {
        var cantidadSeleccionada = Math.max(1, Math.min(9, parseInt(campoCantidad.value, 10) || 1));
        OKI.carrito.anadir(productoActual.id, cantidadSeleccionada);
        OKI.aviso(cantidadSeleccionada + ' × ' + productoActual.nombre + ' añadido al carrito');
        OKI.abrirMiniCarrito();
    });

    // ACTUALIZA LA FICHA Y VUELVE AL INICIO AL CAMBIAR DE PRODUCTO.
    window.addEventListener('hashchange', function () {
        pintarProducto(idDeLaDireccion());
        window.scrollTo({ top: 0, behavior: OKI.reduceMotion ? 'auto' : 'smooth' });
    });
    pintarProducto(idDeLaDireccion());
})();
