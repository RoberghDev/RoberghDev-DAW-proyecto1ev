import React, { useState } from 'react';
import { login, registrarNuevoUsuario } from '../../services/api.js';
import { carrito, favoritos, borrar, guardar, leer } from '../store/storage.js';
import { aviso } from '../store/ui.js';

// Migrada desde la plantilla heredada cuenta.html y public/js/cuenta.js (fase 3).
// La conexión con la API (services/api.js) no cambia: se usan las mismas funciones,
// con los mismos datos, validaciones y mensajes que en cuenta.js.
export const title = 'OKIDOKEI · Mi cuenta';
export const description = 'Inicia sesión o crea tu cuenta en OKIDOKEI.';

const correoValido = (correoElectronico) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoElectronico);
// VALIDA QUE EL CORREO DE LOGIN TERMINE EN .COM.
const correoLoginValido = (correoElectronico) => /^[^\s@]+@[^\s@]+\.com$/i.test(correoElectronico);

const PANEL_INICIAL = { conSesion: false, nombre: 'cliente', email: '', favoritos: '0 relojes guardados', carrito: '0 artículos' };

// LEE EL ESTADO DE SESIÓN GUARDADO. Como en cuenta.js, el panel solo se repinta al cargar la página,
// al entrar, al registrarse y al salir; sin sesión conserva los últimos textos pintados.
function leerPanel(anterior) {
    const datosUsuario = leer('usuario', null);
    if (!datosUsuario) return { ...anterior, conSesion: false };
    const f = favoritos.lista().length;
    const q = carrito.cantidad();
    return {
        conSesion: true,
        nombre: datosUsuario.nombre,
        email: datosUsuario.email,
        favoritos: f + (f === 1 ? ' reloj guardado' : ' relojes guardados'),
        carrito: q + (q === 1 ? ' artículo' : ' artículos')
    };
}

export default function Cuenta() {
    const [panel, setPanel] = useState(() => leerPanel(PANEL_INICIAL));
    const [pestana, setPestana] = useState('formEntrar');
    const [mensajeEntrar, setMensajeEntrar] = useState('');
    const [mensajeRegistro, setMensajeRegistro] = useState('');
    const [entrando, setEntrando] = useState(false);
    const [registrando, setRegistrando] = useState(false);
    const pintar = () => setPanel(leerPanel);

    // INICIO DE SESIÓN.
    async function enviarEntrar(eventoEnvio) {
        eventoEnvio.preventDefault();
        const formulario = eventoEnvio.currentTarget;
        const correoElectronico = formulario.querySelector('#entrarEmail').value.trim();
        const contrasena = formulario.querySelector('#entrarPass').value;

        if (!correoElectronico) { setMensajeEntrar('Escribe tu correo electrónico.'); return; }
        if (!correoLoginValido(correoElectronico)) { setMensajeEntrar('Escribe un correo válido terminado en .com.'); return; }
        if (contrasena.length < 3) { setMensajeEntrar('La contraseña tiene al menos 6 caracteres.'); return; }

        setMensajeEntrar('Iniciando sesión…');
        setEntrando(true);
        try {
            const respuestaLogin = await login(correoElectronico, contrasena);
            if (!respuestaLogin || !respuestaLogin.token) throw new Error('La API no devolvió el token de sesión esperado.');
            const usuario = { nombre: correoElectronico, email: correoElectronico };
            guardar('token', respuestaLogin.token);
            guardar('usuario', usuario);
            setMensajeEntrar('');
            pintar();
            aviso('Hola de nuevo, ' + usuario.nombre);
        } catch (error) {
            console.error('Error al registrar', error);
            setMensajeEntrar(error.message || 'No se pudo iniciar sesión.');
        } finally {
            setEntrando(false);
        }
    }

    // CREACIÓN DE CUENTA (REGISTRO Y, DESPUÉS, INICIO DE SESIÓN).
    async function enviarRegistro(eventoEnvio) {
        eventoEnvio.preventDefault();
        const formulario = eventoEnvio.currentTarget;
        const nombre = formulario.querySelector('#regNombre').value.trim();
        const correoElectronico = formulario.querySelector('#regEmail').value.trim();
        const contrasena = formulario.querySelector('#regPass').value.trim();
        const telefono = formulario.querySelector('#regTelefono').value.trim();

        if (nombre.length < 2) { setMensajeRegistro('Escribe tu nombre.'); return; }
        if (!correoValido(correoElectronico)) { setMensajeRegistro('Escribe un correo válido, por ejemplo nombre@dominio.com.'); return; }
        if (contrasena.length < 6) { setMensajeRegistro('La contraseña necesita al menos 6 caracteres.'); return; }
        if (telefono.length != 9) { setMensajeRegistro('Escribe un número de teléfono válido.'); return; }
        if (!formulario.querySelector('#regAcepto').checked) { setMensajeRegistro('Acepta la política de privacidad o pacto con el diablo para crear la cuenta.'); return; }

        setMensajeRegistro('Creando cuenta…');
        setRegistrando(true);
        try {
            await registrarNuevoUsuario(nombre, contrasena, correoElectronico, telefono);
            const datos = await login(correoElectronico, contrasena);
            if (!datos || !datos.token) throw new Error('La API no devolvió el token de sesión esperado.');
            const usuario = { nombre, email: correoElectronico };
            const registrados = leer('cuentas', {});
            registrados[correoElectronico.toLowerCase()] = usuario;
            guardar('cuentas', registrados);
            guardar('token', datos.token);
            guardar('usuario', usuario);
            setMensajeRegistro('');
            formulario.reset();
            pintar();
            aviso('Cuenta creada. Bienvenido, ' + nombre);
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            setMensajeRegistro(error.message || 'No se pudo crear la cuenta.');
        } finally {
            setRegistrando(false);
        }
    }

    // CIERRE DE SESIÓN.
    function salir() {
        borrar('usuario');
        borrar('token');
        pintar();
        aviso('Has cerrado la sesión');
    }

    const pestanaProps = (id) => ({ type: 'button', role: 'tab', 'aria-selected': String(pestana === id), 'data-tab-cuenta': id, onClick: () => setPestana(id) });

    return (
<main>
    <section className="page-hero">
        <div className="wrap">
            <nav className="crumbs" aria-label="Estás aquí"><a href="index.html">Inicio</a><span aria-hidden="true">/</span><span aria-current="page">Mi cuenta</span></nav>
            <p className="eyebrow">Tu espacio</p>
            <h1 className="page-title">Mi cuenta</h1>
            <p className="page-sub">Entra para ver tus favoritos y tu carrito, o crea una cuenta en un minuto.</p>
        </div>
        <svg className="page-mark" aria-hidden="true"><use href="#emblem" /></svg>
    </section>

    <section className="section-dark section">
        <div className="wrap">
            <div id="accountForms" hidden={panel.conSesion}>
                <div className="acc-tabs" role="tablist" aria-label="Cuenta">
                    <button {...pestanaProps('formEntrar')}>Entrar</button>
                    <button {...pestanaProps('formRegistro')}>Crear cuenta</button>
                </div>
                <div className="acc-grid">
                    <form className={`acc-form${pestana === 'formEntrar' ? ' is-active' : ''}`} id="formEntrar" noValidate onSubmit={enviarEntrar}>
                        <h2>Iniciar sesión</h2>
                        <p>¿Ya tienes cuenta? Entra con tu correo electrónico.</p>
                        <div className="field"><label htmlFor="entrarEmail">Correo electrónico</label><input className="input" id="entrarEmail" type="email" autoComplete="email" placeholder="nombre@dominio.com" /></div>
                        <div className="field"><label htmlFor="entrarPass">Contraseña</label><input className="input" id="entrarPass" type="password" autoComplete="current-password" placeholder="Mínimo 6 caracteres" /></div>
                        <button className="btn btn-copper" type="submit" disabled={entrando}>Entrar</button>
                        <p className="form-msg" role="status">{mensajeEntrar}</p>
                        <a className="link-arrow" href="ayuda.html#contacto">¿Has olvidado tu contraseña?</a>
                    </form>
                    <form className={`acc-form${pestana === 'formRegistro' ? ' is-active' : ''}`} id="formRegistro" noValidate onSubmit={enviarRegistro}>
                        <h2>Crear cuenta</h2>
                        <p>Guarda tus favoritos, sigue tus pedidos y recibe antes que nadie las ediciones limitadas.</p>
                        <div className="field"><label htmlFor="regNombre">Nombre</label><input className="input" id="regNombre" type="text" autoComplete="given-name" placeholder="Tu nombre" /></div>
                        <div className="field"><label htmlFor="regEmail">Correo electrónico</label><input className="input" id="regEmail" type="email" autoComplete="email" placeholder="nombre@dominio.com" /></div>
                        <div className="field"><label htmlFor="regTelefono">Número de teléfono</label><input className="input" id="regTelefono" type="tel" autoComplete="tel" placeholder="Tu número de teléfono" /></div>
                        <div className="field"><label htmlFor="regPass">Contraseña</label><input className="input" id="regPass" type="password" autoComplete="new-password" placeholder="Mínimo 6 caracteres" /></div>
                        <label className="check" htmlFor="regAcepto"><input type="checkbox" id="regAcepto" /> <span>Acepto la <a href="legal.html#privacidad">política de privacidad</a>.</span></label>
                        <button className="btn btn-outline" type="submit" disabled={registrando}>Crear cuenta</button>
                        <p className="form-msg" role="status">{mensajeRegistro}</p>
                    </form>
                </div>
                <p className="acc-note">Mientras la tienda no esté conectada a su plataforma de pedidos, la cuenta se guarda solo en este navegador (nombre y correo; la contraseña no se guarda).</p>
            </div>
            <div className="acc-panel" id="accountPanel" hidden={!panel.conSesion}>
                <div className="acc-card"><p className="eyebrow">Mi cuenta</p><h2>Hola, <span id="accName">{panel.nombre}</span></h2><p id="accEmail">{panel.email}</p><button className="btn btn-ghost" type="button" id="logout" onClick={salir}>Cerrar sesión</button></div>
                <div className="acc-card"><svg className="icon" aria-hidden="true"><use href="#i-heart" /></svg><h3>Favoritos</h3><p id="accFavs">{panel.favoritos}</p><a className="link-arrow" href="favoritos.html">Ver favoritos <svg className="icon" aria-hidden="true"><use href="#i-right" /></svg></a></div>
                <div className="acc-card"><svg className="icon" aria-hidden="true"><use href="#i-bag" /></svg><h3>Carrito</h3><p id="accCart">{panel.carrito}</p><a className="link-arrow" href="carrito.html">Ir al carrito <svg className="icon" aria-hidden="true"><use href="#i-right" /></svg></a></div>
            </div>
        </div>
    </section>
</main>
    );
}
