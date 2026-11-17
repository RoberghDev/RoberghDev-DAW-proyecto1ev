var OKI_API = window.OKI_API;
(function () {
    'use strict';
    var $ = OKI.$, $$ = OKI.$$;
    var formEntrar = $('#formEntrar'), formRegistro = $('#formRegistro');
    if (!formEntrar) return;

    var correoValido = function (correoElectronico) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoElectronico);
    };

    // VALIDA QUE EL CORREO DE LOGIN TERMINE EN .COM.
    var correoLoginValido = function (correoElectronico) {
        return /^[^\s@]+@[^\s@]+\.com$/i.test(correoElectronico);
    };

    // ACTUALIZA LA VISTA DE CUENTA SEGÚN EL ESTADO DE SESIÓN GUARDADO.
    function pintar() {
        var datosUsuario = OKI.leer('usuario', null);
        $('#accountForms').hidden = !!datosUsuario;
        $('#accountPanel').hidden = !datosUsuario;
        if (datosUsuario) {
            $('#accName').textContent = datosUsuario.nombre;
            $('#accEmail').textContent = datosUsuario.email;
            var f = OKI.favoritos.lista().length, q = OKI.carrito.cantidad();
            $('#accFavs').textContent = f + (f === 1 ? ' reloj guardado' : ' relojes guardados');
            $('#accCart').textContent = q + (q === 1 ? ' artículo' : ' artículos');
        }
    }

    $$('[data-tab-cuenta]').forEach(function (botonPestana) {
        // ACTIVA EL FORMULARIO ASOCIADO A LA PESTAÑA SELECCIONADA.
        botonPestana.addEventListener('click', function () {
            var identificadorFormulario = botonPestana.getAttribute('data-tab-cuenta');
            $$('[data-tab-cuenta]').forEach(function (pestana) {
                pestana.setAttribute('aria-selected', pestana === botonPestana ? 'true' : 'false');
            });
            $$('.acc-form').forEach(function (formularioCuenta) {
                formularioCuenta.classList.toggle('is-active', formularioCuenta.id === identificadorFormulario);
            });
        });
    });

    // LISTENER PARA HACER LOGIN
    formEntrar.addEventListener('submit', async function (eventoEnvio) {
        eventoEnvio.preventDefault();
        var correoElectronico = $('#entrarEmail').value.trim();
        var contrasena = $('#entrarPass').value;
        var mensajeFormulario = $('.form-msg', formEntrar);
        var botonEnviar = $('button[type="submit"]', formEntrar);

        if (!correoElectronico) {
            mensajeFormulario.textContent = 'Escribe tu correo electrónico.';
            return;
        }

        if (!correoLoginValido(correoElectronico)) {
            mensajeFormulario.textContent = 'Escribe un correo válido terminado en .com.';
            return;
        }

        if (contrasena.length < 3) {
            mensajeFormulario.textContent = 'La contraseña tiene al menos 6 caracteres.';
            return;
        }

        mensajeFormulario.textContent = 'Iniciando sesión…';
        botonEnviar.disabled = true;

        try {
            var respuestaLogin = await OKI_API.login(correoElectronico, contrasena);
            if (!respuestaLogin || !respuestaLogin.token) {
                throw new Error('La API no devolvió el token de sesión esperado.');
            }

            var usuario = {
                nombre: correoElectronico,
                email: correoElectronico
            };

            OKI.guardar('token', respuestaLogin.token);
            OKI.guardar('usuario', usuario);
            mensajeFormulario.textContent = '';
            pintar();
            OKI.aviso('Hola de nuevo, ' + usuario.nombre);
        } catch (error) {
            console.error('Error al registrar', error);
            mensajeFormulario.textContent = error.message || 'No se pudo iniciar sesión.';
        } finally {
            botonEnviar.disabled = false;
        }
    });

    // LISTENER PARA CREAR UN NUEVO USUARIO
    formRegistro.addEventListener('submit', function (eventoEnvio) {
        eventoEnvio.preventDefault();
        var nombre = $('#regNombre').value.trim();
        var correoElectronico = $('#regEmail').value.trim();
        var contrasena = $('#regPass').value.trim();
        var telefono = $('regTelefono').value.trim();
        var mensajeFormulario = $('.form-msg', formRegistro);

        if (nombre.length < 2) {
            mensajeFormulario.textContent = 'Escribe tu nombre.';
            return;
        }

        if (!correoValido(correoElectronico)) {
            mensajeFormulario.textContent = 'Escribe un correo válido, por ejemplo nombre@dominio.com.';
            return;
        }

        if (contrasena.length < 6) {
            mensajeFormulario.textContent = 'La contraseña necesita al menos 6 caracteres.';
            return;
        }

        if (telefono.length != 9) {
            mensajeFormulario.textContent = "Escribe un número de teléfono válido."
        }

        if (!$('#regAcepto').checked) {
            mensajeFormulario.textContent = 'Acepta la política de privacidad o pacto con el diablo para crear la cuenta.';
            return;
        }

        try {
            OKI_API.registrarNuevoUsuario(nombrem, contrasena, correoElectronico, telefono)
            if (!datos || !datos.token) {
                throw new Error('La API no devolvió el token de sesión esperado.');
            }
            
            var usuario = { 
                nombre  : nombre, 
                email   : correoElectronico
            };

            var registrados = OKI.leer('cuentas', {});
            registrados[correoElectronico.toLowerCase()] = usuario;
            OKI.guardar('cuentas', registrados);
            OKI.guardar('usuario', usuario);
            mensajeFormulario.textContent = '';
            formRegistro.reset();
            pintar();
            OKI.aviso('Cuenta creada. Bienvenido, ' + nombre);

        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            mensajeFormulario.textContent = error.message || 'No se pudo iniciar sesión.';
        } finally {
            botonEnviar.disabled = false;
        }
    });

    // LISTENER PARA HACER LOGOUT
    $('#logout').addEventListener('click', function () {
        OKI.borrar('usuario');
        OKI.borrar('token');
        pintar();
        OKI.aviso('Has cerrado la sesión');
    });

    pintar();
})();
