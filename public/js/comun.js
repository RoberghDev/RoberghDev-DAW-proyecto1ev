var OKI = window.OKI || {};

// CONFIGURA LAS UTILIDADES COMPARTIDAS Y LAS INTERACCIONES COMUNES DEL SITIO.
(function () {
    'use strict';

    // BUSCA EL PRIMER ELEMENTO QUE COINCIDE CON UN SELECTOR.
    var $ = function (selector, elementoRaiz) { return (elementoRaiz || document).querySelector(selector); };
    // DEVUELVE TODOS LOS ELEMENTOS QUE COINCIDEN CON UN SELECTOR.
    var $$ = function (selector, elementoRaiz) { return Array.prototype.slice.call((elementoRaiz || document).querySelectorAll(selector)); };
    OKI.$ = $;
    OKI.$$ = $$;
    OKI.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var PREFIJO = 'okidokei.';
    var memoria = {};
    // LEE Y PARSEA UN VALOR GUARDADO, CON UN VALOR ALTERNATIVO SI NO ESTÁ DISPONIBLE.
    function leer(clave, valorPorDefecto) {
        try {
            var valorGuardado = localStorage.getItem(PREFIJO + clave);
            return valorGuardado == null ? valorPorDefecto : JSON.parse(valorGuardado);
        } catch (e) {
            return clave in memoria ? memoria[clave] : valorPorDefecto;
        }
    }
    // GUARDA UN VALOR EN MEMORIA Y, SI ES POSIBLE, EN LOCALSTORAGE.
    function guardar(clave, valor) {
        memoria[clave] = valor;
        try { localStorage.setItem(PREFIJO + clave, JSON.stringify(valor)); } catch (e) {  }
    }
    // ELIMINA UN VALOR DEL ALMACENAMIENTO LOCAL Y DE LA MEMORIA ALTERNATIVA.
    function borrar(clave) {
        delete memoria[clave];
        try { localStorage.removeItem(PREFIJO + clave); } catch (e) { }
    }
    OKI.leer = leer;
    OKI.guardar = guardar;
    OKI.borrar = borrar;

    // NOTIFICA A LA PÁGINA QUE HA CAMBIADO UN DATO COMPARTIDO.
    function avisarCambio(nombreDato) { document.dispatchEvent(new CustomEvent('oki:' + nombreDato)); }

    var temporizadorAviso;
    // MUESTRA UN MENSAJE TEMPORAL EN EL AVISO GLOBAL.
    function aviso(texto) {
        var elementoAviso = $('#toast');
        if (!elementoAviso) return;
        elementoAviso.textContent = texto;
        elementoAviso.classList.add('show');
        clearTimeout(temporizadorAviso);
        temporizadorAviso = setTimeout(function () { elementoAviso.classList.remove('show'); }, 2800);
    }
    OKI.aviso = aviso;

    var carrito = {
        // DEVUELVE LOS ARTÍCULOS VÁLIDOS QUE HAY EN EL CARRITO.
        items: function () {
            return leer('carrito', []).filter(function (articulo) { return buscarProducto(articulo.id) && articulo.qty > 0; });
        },
        // CALCULA EL NÚMERO TOTAL DE UNIDADES DEL CARRITO.
        cantidad: function () {
            return carrito.items().reduce(function (cantidadAcumulada, articulo) { return cantidadAcumulada + articulo.qty; }, 0);
        },
        // CALCULA EL PRECIO TOTAL DE LOS ARTÍCULOS DEL CARRITO.
        total: function () {
            return carrito.items().reduce(function (totalAcumulado, articulo) { return totalAcumulado + buscarProducto(articulo.id).precio * articulo.qty; }, 0);
        },
        // AÑADE UNA CANTIDAD DEL PRODUCTO AL CARRITO.
        anadir: function (identificadorProducto, cantidad) {
            var articulos = carrito.items();
            var articuloExistente = articulos.filter(function (articulo) { return articulo.id === identificadorProducto; })[0];
            if (articuloExistente) articuloExistente.qty += cantidad || 1;
            else articulos.push({ id: identificadorProducto, qty: cantidad || 1 });
            guardar('carrito', articulos); avisarCambio('carrito');
        },
        // ESTABLECE LA CANTIDAD DE UN PRODUCTO Y QUITA LOS ARTÍCULOS SIN UNIDADES.
        poner: function (identificadorProducto, cantidad) {
            var articulos = carrito.items()
                .map(function (articulo) { return articulo.id === identificadorProducto ? { id: identificadorProducto, qty: cantidad } : articulo; })
                .filter(function (articulo) { return articulo.qty > 0; });
            guardar('carrito', articulos); avisarCambio('carrito');
        },
        // ELIMINA UN PRODUCTO DEL CARRITO.
        quitar: function (identificadorProducto) {
            guardar('carrito', carrito.items().filter(function (articulo) { return articulo.id !== identificadorProducto; }));
            avisarCambio('carrito');
        },
        // ELIMINA TODOS LOS ARTÍCULOS DEL CARRITO.
        vaciar: function () { guardar('carrito', []); avisarCambio('carrito'); }
    };
    OKI.carrito = carrito;

    var favoritos = {
        // DEVUELVE LOS IDENTIFICADORES DE PRODUCTOS FAVORITOS EXISTENTES.
        lista: function () { return leer('favoritos', []).filter(function (identificadorProducto) { return buscarProducto(identificadorProducto); }); },
        // INDICA SI UN PRODUCTO FORMA PARTE DE FAVORITOS.
        tiene: function (identificadorProducto) { return favoritos.lista().indexOf(identificadorProducto) > -1; },
        // AÑADE O QUITA UN PRODUCTO DE LA LISTA DE FAVORITOS.
        alternar: function (identificadorProducto) {
            var identificadoresFavoritos = favoritos.lista();
            var indiceFavorito = identificadoresFavoritos.indexOf(identificadorProducto);
            if (indiceFavorito > -1) identificadoresFavoritos.splice(indiceFavorito, 1);
            else identificadoresFavoritos.push(identificadorProducto);
            guardar('favoritos', identificadoresFavoritos); avisarCambio('favoritos');
            return indiceFavorito === -1;
        }
    };
    OKI.favoritos = favoritos;

    // MARCA LAS IMÁGENES QUE NO SE CARGAN Y LIMPIA ESA MARCA SI SE RECUPERAN.
    function prepararFotos(elementoRaiz) {
        $$('img[data-foto]', elementoRaiz).forEach(function (imagen) {
            var marcarImagenAusente = function () {
                imagen.classList.add('sin-foto');
                if (imagen.parentNode) imagen.parentNode.setAttribute('data-falta', imagen.getAttribute('src'));
            };
            if (imagen.complete && imagen.naturalWidth === 0) marcarImagenAusente();
            imagen.addEventListener('error', marcarImagenAusente);
            // RESTABLECE LA APARIENCIA CUANDO LA IMAGEN SE CARGA.
            imagen.addEventListener('load', function () {
                imagen.classList.remove('sin-foto');
                if (imagen.parentNode) imagen.parentNode.removeAttribute('data-falta');
            });
        });
    }
    OKI.prepararFotos = prepararFotos;

    // CONSTRUYE EL HTML DE UNA TARJETA DE PRODUCTO.
    OKI.tarjetaHTML = function (producto) {
        var coleccionProducto = buscarColeccion(producto.coleccion);
        var etiquetaProducto = producto.limitado ? '<span class="tag">Edición limitada</span>' : producto.nuevo ? '<span class="tag">Nuevo</span>' : '';
        return '<article class="card" data-id="' + producto.id + '">' +
            '<div class="card-media"><a class="card-img foto" href="producto.html#' + producto.id + '" tabindex="-1" aria-hidden="true">' +
            '<img src="' + fotoProducto(producto) + '" alt="" loading="lazy" data-foto></a>' + etiquetaProducto +
            '<button class="fav" type="button" data-fav="' + producto.id + '" aria-pressed="false" aria-label="Añadir ' + producto.nombre + ' a favoritos"><svg class="icon"><use href="#i-heart"/></svg></button></div>' +
            '<div class="card-body"><p class="card-coll">' + coleccionProducto.nombre + '</p><h3 class="card-name"><a href="producto.html#' + producto.id + '">' + producto.nombre + '</a></h3>' +
            '<p class="card-spec">' + resumenProducto(producto) + '</p>' +
            '<div class="card-foot"><span class="card-price">' + precioTexto(producto.precio) + '</span>' +
            '<button class="add-btn" type="button" data-add="' + producto.id + '"><svg class="icon" aria-hidden="true"><use href="#i-bag"/></svg>Añadir</button></div></div></article>';
    };

    // ACTUALIZA LOS CONTADORES Y ETIQUETAS DE ACCESIBILIDAD DE LA CABECERA.
    function pintarContadores() {
        var cantidadCarrito = carrito.cantidad();
        var cantidadFavoritos = favoritos.lista().length;
        $$('[data-count="carrito"]').forEach(function (contadorCarrito) {
            contadorCarrito.textContent = cantidadCarrito;
            contadorCarrito.hidden = cantidadCarrito === 0;
        });
        $$('[data-count="favoritos"]').forEach(function (contadorFavoritos) {
            contadorFavoritos.textContent = cantidadFavoritos;
            contadorFavoritos.hidden = cantidadFavoritos === 0;
        });
        var botonCarrito = $('#cartBtn');
        if (botonCarrito) botonCarrito.setAttribute('aria-label', 'Carrito, ' + cantidadCarrito + (cantidadCarrito === 1 ? ' artículo' : ' artículos'));
        var botonFavoritos = $('#favBtn');
        if (botonFavoritos) botonFavoritos.setAttribute('aria-label', 'Favoritos, ' + cantidadFavoritos + (cantidadFavoritos === 1 ? ' reloj' : ' relojes'));
        var usuarioActual = leer('usuario', null);
        var botonCuenta = $('#userBtn');
        if (botonCuenta) {
            botonCuenta.setAttribute('aria-label', usuarioActual ? 'Mi cuenta (' + usuarioActual.nombre + ')' : 'Mi cuenta');
            botonCuenta.classList.toggle('is-logged', !!usuarioActual);
        }
    }

    // ACTUALIZA EL ESTADO Y EL TEXTO ACCESIBLE DE CADA BOTÓN DE FAVORITOS.
    function pintarCorazones() {
        $$('[data-fav]').forEach(function (botonFavorito) {
            var identificadorProducto = botonFavorito.getAttribute('data-fav');
            var producto = buscarProducto(identificadorProducto);
            var estaEnFavoritos = favoritos.tiene(identificadorProducto);
            botonFavorito.setAttribute('aria-pressed', estaEnFavoritos ? 'true' : 'false');
            if (producto) botonFavorito.setAttribute('aria-label', (estaEnFavoritos ? 'Quitar ' : 'Añadir ') + producto.nombre + (estaEnFavoritos ? ' de favoritos' : ' a favoritos'));
        });
    }
    OKI.pintarCorazones = pintarCorazones;

    // ACTUALIZA LOS CONTADORES Y EL MINICARRITO CUANDO CAMBIA EL CARRITO.
    document.addEventListener('oki:carrito', function () { pintarContadores(); pintarMiniCarrito(); });
    // ACTUALIZA LOS CONTADORES Y CORAZONES CUANDO CAMBIAN LOS FAVORITOS.
    document.addEventListener('oki:favoritos', function () { pintarContadores(); pintarCorazones(); });
    // SINCRONIZA LA INTERFAZ CUANDO OTRA PESTAÑA MODIFICA EL ALMACENAMIENTO.
    window.addEventListener('storage', function () { pintarContadores(); pintarCorazones(); pintarMiniCarrito(); });

    // GESTIONA LAS ACCIONES DE AÑADIR AL CARRITO O CAMBIAR FAVORITOS.
    document.addEventListener('click', function (e) {
        var botonAnadir = e.target.closest('[data-add]');
        if (botonAnadir) {
            var identificadorProducto = botonAnadir.getAttribute('data-add');
            var producto = buscarProducto(identificadorProducto);
            if (!producto) return;
            carrito.anadir(identificadorProducto, 1);
            aviso(producto.nombre + ' añadido al carrito');
            abrirMiniCarrito();
            return;
        }
        var botonFavorito = e.target.closest('[data-fav]');
        if (botonFavorito) {
            e.preventDefault();
            var identificadorFavorito = botonFavorito.getAttribute('data-fav');
            var productoFavorito = buscarProducto(identificadorFavorito);
            if (!productoFavorito) return;
            var seAnadioAFavoritos = favoritos.alternar(identificadorFavorito);
            aviso(seAnadioAFavoritos ? productoFavorito.nombre + ' guardado en favoritos' : productoFavorito.nombre + ' quitado de favoritos');
        }
    });

    var panelMinicarrito = $('#cart');
    var ultimoElementoEnfocado = null;
    // RENDERIZA LOS ARTÍCULOS Y EL TOTAL DEL MINICARRITO.
    function pintarMiniCarrito() {
        if (!panelMinicarrito) return;
        var listaMinicarrito = $('#cartList');
        var articulosCarrito = carrito.items();
        if (!articulosCarrito.length) {
            listaMinicarrito.innerHTML = '<p class="cart-empty">Tu carrito está vacío.</p>';
        } else {
            listaMinicarrito.innerHTML = articulosCarrito.map(function (articuloCarrito) {
                var producto = buscarProducto(articuloCarrito.id);
                return '<div class="cart-item" data-id="' + articuloCarrito.id + '">' +
                    '<a href="producto.html#' + producto.id + '" class="cart-thumb foto"><img src="' + fotoProducto(producto) + '" alt="" data-foto></a>' +
                    '<div><h3><a href="producto.html#' + producto.id + '">' + producto.nombre + '</a></h3><p class="unit">' + precioTexto(producto.precio) + '</p>' +
                    '<div class="qty"><button type="button" data-q="-1" aria-label="Quitar una unidad de ' + producto.nombre + '"><svg class="icon"><use href="#i-minus"/></svg></button><span>' + articuloCarrito.qty + '</span>' +
                    '<button type="button" data-q="1" aria-label="Añadir una unidad de ' + producto.nombre + '"><svg class="icon"><use href="#i-plus"/></svg></button></div></div>' +
                    '<div class="cart-line"><p class="line">' + precioTexto(producto.precio * articuloCarrito.qty) + '</p><button type="button" class="rm" data-rm>Eliminar</button></div></div>';
            }).join('');
            prepararFotos(listaMinicarrito);
        }
        $('#cartTotal').textContent = precioTexto(carrito.total());
    }

    // ABRE EL MINICARRITO Y GUARDA EL ELEMENTO AL QUE DEVOLVER EL FOCO.
    function abrirMiniCarrito() {
        if (!panelMinicarrito) return;
        ultimoElementoEnfocado = document.activeElement;
        pintarMiniCarrito();
        panelMinicarrito.classList.add('open');
        panelMinicarrito.setAttribute('aria-hidden', 'false');
        $('.drawer-head .icon-btn', panelMinicarrito).focus();
    }

    // CIERRA EL MINICARRITO Y DEVUELVE EL FOCO AL ELEMENTO ANTERIOR.
    function cerrarMiniCarrito() {
        if (!panelMinicarrito || !panelMinicarrito.classList.contains('open')) return;
        panelMinicarrito.classList.remove('open');
        panelMinicarrito.setAttribute('aria-hidden', 'true');
        if (ultimoElementoEnfocado) ultimoElementoEnfocado.focus();
    }
    OKI.abrirMiniCarrito = abrirMiniCarrito;
    if (panelMinicarrito) {
        $$('[data-close-cart]', panelMinicarrito).forEach(function (elementoCierre) {
            // CIERRA EL MINICARRITO AL ACTIVAR UNA DE SUS ZONAS DE CIERRE.
            elementoCierre.addEventListener('click', cerrarMiniCarrito);
        });
        // PROCESA LOS CAMBIOS DE CANTIDAD Y LA ELIMINACIÓN EN EL MINICARRITO.
        $('#cartList').addEventListener('click', function (e) {
            var filaArticulo = e.target.closest('.cart-item');
            if (!filaArticulo) return;
            var identificadorProducto = filaArticulo.getAttribute('data-id');
            var articuloCarrito = carrito.items().filter(function (articulo) { return articulo.id === identificadorProducto; })[0];
            var botonCantidad = e.target.closest('[data-q]');
            if (botonCantidad && articuloCarrito) carrito.poner(identificadorProducto, articuloCarrito.qty + Number(botonCantidad.getAttribute('data-q')));
            if (e.target.closest('[data-rm]')) carrito.quitar(identificadorProducto);
        });
    }

    var cabeceraSitio = $('#siteHeader');
    // ACTUALIZA EL ESTILO DE LA CABECERA SEGÚN LA POSICIÓN DE DESPLAZAMIENTO.
    function actualizarCabeceraAlDesplazar() { if (cabeceraSitio) cabeceraSitio.classList.toggle('scrolled', window.scrollY > 8); }
    // ACTUALIZA LA CABECERA AL DESPLAZAR LA PÁGINA.
    window.addEventListener('scroll', actualizarCabeceraAlDesplazar, { passive: true });
    actualizarCabeceraAlDesplazar();

    var menuMovil = $('#mnav');
    var botonMenu = $('#menuBtn');
    // ABRE EL MENÚ MÓVIL Y ENFOCA SU PRIMER ENLACE.
    function abrirMenu() {
        menuMovil.classList.add('open');
        menuMovil.setAttribute('aria-hidden', 'false');
        botonMenu.setAttribute('aria-expanded', 'true');
        var primerEnlaceMenu = $('.mnav-panel a', menuMovil);
        if (primerEnlaceMenu) primerEnlaceMenu.focus();
    }
    // CIERRA EL MENÚ MÓVIL SI ESTÁ ABIERTO.
    function cerrarMenu() {
        if (!menuMovil || !menuMovil.classList.contains('open')) return;
        menuMovil.classList.remove('open');
        menuMovil.setAttribute('aria-hidden', 'true');
        botonMenu.setAttribute('aria-expanded', 'false');
    }
    if (menuMovil && botonMenu) {
        // ABRE EL MENÚ MÓVIL AL ACTIVAR SU BOTÓN.
        botonMenu.addEventListener('click', abrirMenu);
        $$('[data-close-menu]', menuMovil).forEach(function (elementoCierre) {
            // CIERRA EL MENÚ MÓVIL AL ACTIVAR UNA DE SUS ZONAS DE CIERRE.
            elementoCierre.addEventListener('click', cerrarMenu);
        });
    }

    var botonBuscador = $('#searchBtn');
    var panelBuscador = $('#searchPanel');
    var campoBusqueda = $('#searchInput');
    var resultadosBusqueda = $('#searchResults');
    // NORMALIZA TEXTO PARA COMPARAR BÚSQUEDAS SIN DIFERENCIAR ACENTOS NI MAYÚSCULAS.
    function normalizarTexto(texto) { return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
    // FILTRA Y MUESTRA LOS PRODUCTOS QUE COINCIDEN CON EL TEXTO BUSCADO.
    function pintarBusqueda() {
        var consulta = normalizarTexto(campoBusqueda.value.trim());
        var productosCoincidentes = PRODUCTOS.filter(function (producto) {
            var coleccion = buscarColeccion(producto.coleccion);
            return !consulta || normalizarTexto([producto.nombre, coleccion.nombre, coleccion.categoria, TEXTOS_CAJA[producto.caja], TEXTOS_CORREA[producto.correa], producto.movimiento].join(' ')).indexOf(consulta) > -1;
        });
        if (!productosCoincidentes.length) {
            resultadosBusqueda.innerHTML = '<p class="search-empty">No hay relojes que coincidan. Prueba con «cobre», «acero» o «luna».</p>';
            return;
        }
        resultadosBusqueda.innerHTML = productosCoincidentes.slice(0, 8).map(function (producto) {
            return '<a href="producto.html#' + producto.id + '"><span>' + producto.nombre + ' <span class="price">· ' + resumenProducto(producto) + '</span></span><span class="price">' + precioTexto(producto.precio) + '</span></a>';
        }).join('') + '<a class="search-all" href="tienda.html">Ver todos los relojes en la tienda</a>';
    }
    // ABRE EL BUSCADOR Y ENFOCA EL CAMPO DE TEXTO.
    function abrirBuscador() { panelBuscador.hidden = false; botonBuscador.setAttribute('aria-expanded', 'true'); pintarBusqueda(); campoBusqueda.focus(); }
    // OCULTA EL BUSCADOR Y ACTUALIZA EL ESTADO ACCESIBLE DEL BOTÓN.
    function cerrarBuscador() { if (!panelBuscador || panelBuscador.hidden) return; panelBuscador.hidden = true; botonBuscador.setAttribute('aria-expanded', 'false'); }
    if (botonBuscador && panelBuscador) {
        // ABRE O CIERRA EL PANEL DE BÚSQUEDA AL ACTIVAR SU BOTÓN.
        botonBuscador.addEventListener('click', function () { panelBuscador.hidden ? abrirBuscador() : cerrarBuscador(); });
        // ACTUALIZA LOS RESULTADOS MIENTRAS SE ESCRIBE.
        campoBusqueda.addEventListener('input', pintarBusqueda);
        // NAVEGA AL PRIMER RESULTADO AL PULSAR ENTER.
        campoBusqueda.addEventListener('keydown', function (eventoTeclado) {
            if (eventoTeclado.key === 'Enter') { var primerResultado = $('a', resultadosBusqueda); if (primerResultado) location.href = primerResultado.getAttribute('href'); }
        });
    }

    // CIERRA LOS PANELES ABIERTOS AL PULSAR ESCAPE.
    document.addEventListener('keydown', function (eventoTeclado) {
        if (eventoTeclado.key === 'Escape') { cerrarMiniCarrito(); cerrarMenu(); cerrarBuscador(); }
    });

    $$('form[data-newsletter]').forEach(function (formularioNewsletter) {
        // VALIDA EL FORMULARIO DE NEWSLETTER Y MUESTRA LA CONFIRMACIÓN.
        formularioNewsletter.addEventListener('submit', function (eventoEnvio) {
            eventoEnvio.preventDefault();
            var campoCorreo = $('input[type="email"]', formularioNewsletter);
            var casillaPrivacidad = $('input[type="checkbox"]', formularioNewsletter);
            var mensajeFormulario = $('.form-msg', formularioNewsletter);
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campoCorreo.value)) { mensajeFormulario.textContent = 'Escribe un correo válido, por ejemplo nombre@dominio.com.'; campoCorreo.focus(); return; }
            if (casillaPrivacidad && !casillaPrivacidad.checked) { mensajeFormulario.textContent = 'Marca la casilla de privacidad para suscribirte.'; casillaPrivacidad.focus(); return; }
            mensajeFormulario.textContent = '¡Gracias! Te avisaremos de las novedades en ' + campoCorreo.value + '.';
            formularioNewsletter.reset();
        });
    });

    $$('[data-year]').forEach(function (elementoAnio) { elementoAnio.textContent = new Date().getFullYear(); });

    prepararFotos(document);
    pintarContadores();
    pintarCorazones();
    pintarMiniCarrito();
})();
