(function () {
    'use strict';
    var $ = OKI.$, $$ = OKI.$$;
    var formEntrar = $('#formEntrar'), formRegistro = $('#formRegistro');
    if (!formEntrar) return;

    var correoValido = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); };

    function pintar() {
        var u = OKI.leer('usuario', null);
        $('#accountForms').hidden = !!u;
        $('#accountPanel').hidden = !u;
        if (u) {
            $('#accName').textContent = u.nombre;
            $('#accEmail').textContent = u.email;
            var f = OKI.favoritos.lista().length, q = OKI.carrito.cantidad();
            $('#accFavs').textContent = f + (f === 1 ? ' reloj guardado' : ' relojes guardados');
            $('#accCart').textContent = q + (q === 1 ? ' artículo' : ' artículos');
        }
    }

    $$('[data-tab-cuenta]').forEach(function (b) {
        b.addEventListener('click', function () {
            var cual = b.getAttribute('data-tab-cuenta');
            $$('[data-tab-cuenta]').forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
            $$('.acc-form').forEach(function (f) { f.classList.toggle('is-active', f.id === cual); });
        });
    });

    formEntrar.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = $('#entrarEmail').value.trim(), pass = $('#entrarPass').value, msg = $('.form-msg', formEntrar);
        if (!correoValido(email)) { msg.textContent = 'Escribe tu correo, por ejemplo nombre@dominio.com.'; return; }
        if (pass.length < 6) { msg.textContent = 'La contraseña tiene al menos 6 caracteres.'; return; }
        var registrados = OKI.leer('cuentas', {});
        if (!registrados[email.toLowerCase()]) { msg.textContent = 'No encontramos una cuenta con ese correo. Crea una en el formulario de al lado.'; return; }
        OKI.guardar('usuario', registrados[email.toLowerCase()]);
        msg.textContent = '';
        pintar();
        OKI.aviso('Hola de nuevo, ' + registrados[email.toLowerCase()].nombre);
    });

    formRegistro.addEventListener('submit', function (e) {
        e.preventDefault();
        var nombre = $('#regNombre').value.trim(), email = $('#regEmail').value.trim(), pass = $('#regPass').value, msg = $('.form-msg', formRegistro);
        if (nombre.length < 2) { msg.textContent = 'Escribe tu nombre.'; return; }
        if (!correoValido(email)) { msg.textContent = 'Escribe un correo válido, por ejemplo nombre@dominio.com.'; return; }
        if (pass.length < 6) { msg.textContent = 'La contraseña necesita al menos 6 caracteres.'; return; }
        if (!$('#regAcepto').checked) { msg.textContent = 'Acepta la política de privacidad para crear la cuenta.'; return; }
        var usuario = { nombre: nombre, email: email };
        var registrados = OKI.leer('cuentas', {});
        registrados[email.toLowerCase()] = usuario;
        OKI.guardar('cuentas', registrados);
        OKI.guardar('usuario', usuario);
        msg.textContent = '';
        formRegistro.reset();
        pintar();
        OKI.aviso('Cuenta creada. Bienvenido, ' + nombre);
    });

    $('#logout').addEventListener('click', function () {
        OKI.borrar('usuario');
        pintar();
        OKI.aviso('Has cerrado la sesión');
    });

    pintar();
})();
