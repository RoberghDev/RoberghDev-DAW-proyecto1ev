var OKI = window.OKI || {};

(function () {
    'use strict';

    var $ = function (s, el) { return (el || document).querySelector(s); };
    var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
    OKI.$ = $;
    OKI.$$ = $$;
    OKI.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var PREFIJO = 'okidokei.';
    var memoria = {};
    function leer(clave, porDefecto) {
        try {
            var valor = localStorage.getItem(PREFIJO + clave);
            return valor == null ? porDefecto : JSON.parse(valor);
        } catch (e) {
            return clave in memoria ? memoria[clave] : porDefecto;
        }
    }
    function guardar(clave, valor) {
        memoria[clave] = valor;
        try { localStorage.setItem(PREFIJO + clave, JSON.stringify(valor)); } catch (e) {  }
    }
    function borrar(clave) {
        delete memoria[clave];
        try { localStorage.removeItem(PREFIJO + clave); } catch (e) { }
    }
    OKI.leer = leer;
    OKI.guardar = guardar;
    OKI.borrar = borrar;

    function avisarCambio(nombre) { document.dispatchEvent(new CustomEvent('oki:' + nombre)); }

    var toastT;
    function aviso(texto) {
        var t = $('#toast');
        if (!t) return;
        t.textContent = texto;
        t.classList.add('show');
        clearTimeout(toastT);
        toastT = setTimeout(function () { t.classList.remove('show'); }, 2800);
    }
    OKI.aviso = aviso;

    var carrito = {
        items: function () {
            return leer('carrito', []).filter(function (it) { return buscarProducto(it.id) && it.qty > 0; });
        },
        cantidad: function () {
            return carrito.items().reduce(function (a, it) { return a + it.qty; }, 0);
        },
        total: function () {
            return carrito.items().reduce(function (a, it) { return a + buscarProducto(it.id).precio * it.qty; }, 0);
        },
        anadir: function (id, qty) {
            var lista = carrito.items(), it = lista.filter(function (x) { return x.id === id; })[0];
            if (it) it.qty += qty || 1; else lista.push({ id: id, qty: qty || 1 });
            guardar('carrito', lista); avisarCambio('carrito');
        },
        poner: function (id, qty) {
            var lista = carrito.items().map(function (x) { return x.id === id ? { id: id, qty: qty } : x; }).filter(function (x) { return x.qty > 0; });
            guardar('carrito', lista); avisarCambio('carrito');
        },
        quitar: function (id) {
            guardar('carrito', carrito.items().filter(function (x) { return x.id !== id; })); avisarCambio('carrito');
        },
        vaciar: function () { guardar('carrito', []); avisarCambio('carrito'); }
    };
    OKI.carrito = carrito;

    var favoritos = {
        lista: function () { return leer('favoritos', []).filter(function (id) { return buscarProducto(id); }); },
        tiene: function (id) { return favoritos.lista().indexOf(id) > -1; },
        alternar: function (id) {
            var l = favoritos.lista(), i = l.indexOf(id);
            if (i > -1) l.splice(i, 1); else l.push(id);
            guardar('favoritos', l); avisarCambio('favoritos');
            return i === -1;
        }
    };
    OKI.favoritos = favoritos;

    function prepararFotos(raiz) {
        $$('img[data-foto]', raiz).forEach(function (img) {
            var falla = function () {
                img.classList.add('sin-foto');
                if (img.parentNode) img.parentNode.setAttribute('data-falta', img.getAttribute('src'));
            };
            if (img.complete && img.naturalWidth === 0) falla();
            img.addEventListener('error', falla);
            img.addEventListener('load', function () {
                img.classList.remove('sin-foto');
                if (img.parentNode) img.parentNode.removeAttribute('data-falta');
            });
        });
    }
    OKI.prepararFotos = prepararFotos;

    OKI.tarjetaHTML = function (p) {
        var c = buscarColeccion(p.coleccion);
        var tag = p.limitado ? '<span class="tag">Edición limitada</span>' : p.nuevo ? '<span class="tag">Nuevo</span>' : '';
        return '<article class="card" data-id="' + p.id + '">' +
            '<div class="card-media"><a class="card-img foto" href="producto.html#' + p.id + '" tabindex="-1" aria-hidden="true">' +
            '<img src="' + fotoProducto(p) + '" alt="" loading="lazy" data-foto></a>' + tag +
            '<button class="fav" type="button" data-fav="' + p.id + '" aria-pressed="false" aria-label="Añadir ' + p.nombre + ' a favoritos"><svg class="icon"><use href="#i-heart"/></svg></button></div>' +
            '<div class="card-body"><p class="card-coll">' + c.nombre + '</p><h3 class="card-name"><a href="producto.html#' + p.id + '">' + p.nombre + '</a></h3>' +
            '<p class="card-spec">' + resumenProducto(p) + '</p>' +
            '<div class="card-foot"><span class="card-price">' + precioTexto(p.precio) + '</span>' +
            '<button class="add-btn" type="button" data-add="' + p.id + '"><svg class="icon" aria-hidden="true"><use href="#i-bag"/></svg>Añadir</button></div></div></article>';
    };

    function pintarContadores() {
        var q = carrito.cantidad(), f = favoritos.lista().length;
        $$('[data-count="carrito"]').forEach(function (b) { b.textContent = q; b.hidden = q === 0; });
        $$('[data-count="favoritos"]').forEach(function (b) { b.textContent = f; b.hidden = f === 0; });
        var cb = $('#cartBtn'); if (cb) cb.setAttribute('aria-label', 'Carrito, ' + q + (q === 1 ? ' artículo' : ' artículos'));
        var fb = $('#favBtn'); if (fb) fb.setAttribute('aria-label', 'Favoritos, ' + f + (f === 1 ? ' reloj' : ' relojes'));
        var u = leer('usuario', null), ub = $('#userBtn');
        if (ub) { ub.setAttribute('aria-label', u ? 'Mi cuenta (' + u.nombre + ')' : 'Mi cuenta'); ub.classList.toggle('is-logged', !!u); }
    }
    function pintarCorazones() {
        $$('[data-fav]').forEach(function (b) {
            var id = b.getAttribute('data-fav'), p = buscarProducto(id), on = favoritos.tiene(id);
            b.setAttribute('aria-pressed', on ? 'true' : 'false');
            if (p) b.setAttribute('aria-label', (on ? 'Quitar ' : 'Añadir ') + p.nombre + (on ? ' de favoritos' : ' a favoritos'));
        });
    }
    OKI.pintarCorazones = pintarCorazones;
    document.addEventListener('oki:carrito', function () { pintarContadores(); pintarMiniCarrito(); });
    document.addEventListener('oki:favoritos', function () { pintarContadores(); pintarCorazones(); });
    window.addEventListener('storage', function () { pintarContadores(); pintarCorazones(); pintarMiniCarrito(); });

    document.addEventListener('click', function (e) {
        var add = e.target.closest('[data-add]');
        if (add) {
            var id = add.getAttribute('data-add'), p = buscarProducto(id);
            if (!p) return;
            carrito.anadir(id, 1);
            aviso(p.nombre + ' añadido al carrito');
            abrirMiniCarrito();
            return;
        }
        var fav = e.target.closest('[data-fav]');
        if (fav) {
            e.preventDefault();
            var fid = fav.getAttribute('data-fav'), fp = buscarProducto(fid);
            if (!fp) return;
            var on = favoritos.alternar(fid);
            aviso(on ? fp.nombre + ' guardado en favoritos' : fp.nombre + ' quitado de favoritos');
        }
    });

    var drawer = $('#cart'), ultimoFoco = null;
    function pintarMiniCarrito() {
        if (!drawer) return;
        var lista = $('#cartList'), items = carrito.items();
        if (!items.length) {
            lista.innerHTML = '<p class="cart-empty">Tu carrito está vacío.</p>';
        } else {
            lista.innerHTML = items.map(function (it) {
                var p = buscarProducto(it.id);
                return '<div class="cart-item" data-id="' + it.id + '">' +
                    '<a href="producto.html#' + p.id + '" class="cart-thumb foto"><img src="' + fotoProducto(p) + '" alt="" data-foto></a>' +
                    '<div><h3><a href="producto.html#' + p.id + '">' + p.nombre + '</a></h3><p class="unit">' + precioTexto(p.precio) + '</p>' +
                    '<div class="qty"><button type="button" data-q="-1" aria-label="Quitar una unidad de ' + p.nombre + '"><svg class="icon"><use href="#i-minus"/></svg></button><span>' + it.qty + '</span>' +
                    '<button type="button" data-q="1" aria-label="Añadir una unidad de ' + p.nombre + '"><svg class="icon"><use href="#i-plus"/></svg></button></div></div>' +
                    '<div class="cart-line"><p class="line">' + precioTexto(p.precio * it.qty) + '</p><button type="button" class="rm" data-rm>Eliminar</button></div></div>';
            }).join('');
            prepararFotos(lista);
        }
        $('#cartTotal').textContent = precioTexto(carrito.total());
    }
    function abrirMiniCarrito() {
        if (!drawer) return;
        ultimoFoco = document.activeElement;
        pintarMiniCarrito();
        drawer.classList.add('open');
        drawer.setAttribute('aria-hidden', 'false');
        $('.drawer-head .icon-btn', drawer).focus();
    }
    function cerrarMiniCarrito() {
        if (!drawer || !drawer.classList.contains('open')) return;
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
        if (ultimoFoco) ultimoFoco.focus();
    }
    OKI.abrirMiniCarrito = abrirMiniCarrito;
    if (drawer) {
        $$('[data-close-cart]', drawer).forEach(function (el) { el.addEventListener('click', cerrarMiniCarrito); });
        $('#cartList').addEventListener('click', function (e) {
            var fila = e.target.closest('.cart-item'); if (!fila) return;
            var id = fila.getAttribute('data-id'), it = carrito.items().filter(function (x) { return x.id === id; })[0];
            var b = e.target.closest('[data-q]');
            if (b && it) carrito.poner(id, it.qty + Number(b.getAttribute('data-q')));
            if (e.target.closest('[data-rm]')) carrito.quitar(id);
        });
    }

    var header = $('#siteHeader');
    function alHacerScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 8); }
    window.addEventListener('scroll', alHacerScroll, { passive: true });
    alHacerScroll();

    var mnav = $('#mnav'), menuBtn = $('#menuBtn');
    function abrirMenu() { mnav.classList.add('open'); mnav.setAttribute('aria-hidden', 'false'); menuBtn.setAttribute('aria-expanded', 'true'); var f = $('.mnav-panel a', mnav); if (f) f.focus(); }
    function cerrarMenu() { if (!mnav || !mnav.classList.contains('open')) return; mnav.classList.remove('open'); mnav.setAttribute('aria-hidden', 'true'); menuBtn.setAttribute('aria-expanded', 'false'); }
    if (mnav && menuBtn) {
        menuBtn.addEventListener('click', abrirMenu);
        $$('[data-close-menu]', mnav).forEach(function (el) { el.addEventListener('click', cerrarMenu); });
    }

    var searchBtn = $('#searchBtn'), panel = $('#searchPanel'), input = $('#searchInput'), resultados = $('#searchResults');
    function normalizar(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
    function pintarBusqueda() {
        var q = normalizar(input.value.trim());
        var lista = PRODUCTOS.filter(function (p) {
            var c = buscarColeccion(p.coleccion);
            return !q || normalizar([p.nombre, c.nombre, c.categoria, TEXTOS_CAJA[p.caja], TEXTOS_CORREA[p.correa], p.movimiento].join(' ')).indexOf(q) > -1;
        });
        if (!lista.length) {
            resultados.innerHTML = '<p class="search-empty">No hay relojes que coincidan. Prueba con «cobre», «acero» o «luna».</p>';
            return;
        }
        resultados.innerHTML = lista.slice(0, 8).map(function (p) {
            return '<a href="producto.html#' + p.id + '"><span>' + p.nombre + ' <span class="price">· ' + resumenProducto(p) + '</span></span><span class="price">' + precioTexto(p.precio) + '</span></a>';
        }).join('') + '<a class="search-all" href="tienda.html">Ver todos los relojes en la tienda</a>';
    }
    function abrirBuscador() { panel.hidden = false; searchBtn.setAttribute('aria-expanded', 'true'); pintarBusqueda(); input.focus(); }
    function cerrarBuscador() { if (!panel || panel.hidden) return; panel.hidden = true; searchBtn.setAttribute('aria-expanded', 'false'); }
    if (searchBtn && panel) {
        searchBtn.addEventListener('click', function () { panel.hidden ? abrirBuscador() : cerrarBuscador(); });
        input.addEventListener('input', pintarBusqueda);
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { var a = $('a', resultados); if (a) location.href = a.getAttribute('href'); }
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { cerrarMiniCarrito(); cerrarMenu(); cerrarBuscador(); }
    });

    $$('form[data-newsletter]').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var email = $('input[type="email"]', form), check = $('input[type="checkbox"]', form), msg = $('.form-msg', form);
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { msg.textContent = 'Escribe un correo válido, por ejemplo nombre@dominio.com.'; email.focus(); return; }
            if (check && !check.checked) { msg.textContent = 'Marca la casilla de privacidad para suscribirte.'; check.focus(); return; }
            msg.textContent = '¡Gracias! Te avisaremos de las novedades en ' + email.value + '.';
            form.reset();
        });
    });

    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

    prepararFotos(document);
    pintarContadores();
    pintarCorazones();
    pintarMiniCarrito();
})();
