(function () {
    'use strict';
    var seleccionar = OKI.$;
    var formularioContacto = seleccionar('#contactForm');
    if (!formularioContacto) return;

    // VALIDA Y CONFIRMA EL ENVÍO DEL FORMULARIO DE CONTACTO.
    formularioContacto.addEventListener('submit', function (evento) {
        evento.preventDefault();
        var nombreContacto = seleccionar('#cNombre').value.trim();
        var correoContacto = seleccionar('#cEmail').value.trim();
        var mensajeContacto = seleccionar('#cMensaje').value.trim();
        var mensajeEstado = seleccionar('.form-msg', formularioContacto);

        if (nombreContacto.length < 2) {
            mensajeEstado.textContent = 'Escribe tu nombre.';
            seleccionar('#cNombre').focus();
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoContacto)) {
            mensajeEstado.textContent = 'Escribe un correo válido para poder responderte.';
            seleccionar('#cEmail').focus();
            return;
        }

        if (mensajeContacto.length < 10) {
            mensajeEstado.textContent = 'Cuéntanos un poco más en el mensaje.';
            seleccionar('#cMensaje').focus();
            return;
        }

        if (!seleccionar('#cAcepto').checked) {
            mensajeEstado.textContent = 'Marca la casilla de privacidad para enviar el mensaje.';
            return;
        }

        mensajeEstado.textContent = 'Gracias, ' + nombreContacto + '. Hemos recibido tu mensaje y te responderemos en ' + correoContacto + '.';
        formularioContacto.reset();
    });
})();
