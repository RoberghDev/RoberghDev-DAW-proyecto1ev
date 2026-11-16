(function () {
    'use strict';
    var $ = OKI.$;
    var form = $('#contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var nombre = $('#cNombre').value.trim(), email = $('#cEmail').value.trim(), texto = $('#cMensaje').value.trim(), msg = $('.form-msg', form);
        if (nombre.length < 2) { msg.textContent = 'Escribe tu nombre.'; $('#cNombre').focus(); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = 'Escribe un correo válido para poder responderte.'; $('#cEmail').focus(); return; }
        if (texto.length < 10) { msg.textContent = 'Cuéntanos un poco más en el mensaje.'; $('#cMensaje').focus(); return; }
        if (!$('#cAcepto').checked) { msg.textContent = 'Marca la casilla de privacidad para enviar el mensaje.'; return; }
        msg.textContent = 'Gracias, ' + nombre + '. Hemos recibido tu mensaje y te responderemos en ' + email + '.';
        form.reset();
    });
})();
