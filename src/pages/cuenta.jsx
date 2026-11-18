import React from 'react';
// Migrated from the original cuenta.html page markup.
export const title = 'OKIDOKEI · Mi cuenta';
export const description = 'Inicia sesión o crea tu cuenta en OKIDOKEI.';
export default function Cuenta() {
  return (
<main>

    <section className={'page-hero'}>
        <div className={'wrap'}>
            <nav className={'crumbs'} aria-label={'Estás aquí'}><a href={'index.html'}>Inicio</a><span aria-hidden={'true'}>/</span><span aria-current={'page'}>Mi cuenta</span></nav>
            <p className={'eyebrow'}>Tu espacio</p>
            <h1 className={'page-title'}>Mi cuenta</h1>
            <p className={'page-sub'}>Entra para ver tus favoritos y tu carrito, o crea una cuenta en un minuto.</p>
        </div>
        <svg className={'page-mark'} aria-hidden={'true'}><use href={'#emblem'} /></svg>
    </section>

    <section className={'section-dark section'}>
        <div className={'wrap'}>
            <div id={'accountForms'}>
                <div className={'acc-tabs'} role={'tablist'} aria-label={'Cuenta'}>
                    <button type={'button'} role={'tab'} aria-selected={'true'} data-tab-cuenta={'formEntrar'}>Entrar</button>
                    <button type={'button'} role={'tab'} aria-selected={'false'} data-tab-cuenta={'formRegistro'}>Crear cuenta</button>
                </div>
                <div className={'acc-grid'}>
                    <form className={'acc-form is-active'} id={'formEntrar'} novalidate>
                        <h2>Iniciar sesión</h2>
                        <p>¿Ya tienes cuenta? Entra con tu correo electrónico.</p>
                        <div className={'field'}><label htmlFor={'entrarEmail'}>Correo electrónico</label><input className={'input'} id={'entrarEmail'} type={'email'} autocomplete={'email'} placeholder={'nombre@dominio.com'} /></div>
                        <div className={'field'}><label htmlFor={'entrarPass'}>Contraseña</label><input className={'input'} id={'entrarPass'} type={'password'} autocomplete={'current-password'} placeholder={'Mínimo 6 caracteres'} /></div>
                        <button className={'btn btn-copper'} type={'submit'}>Entrar</button>
                        <p className={'form-msg'} role={'status'}></p>
                        <a className={'link-arrow'} href={'ayuda.html#contacto'}>¿Has olvidado tu contraseña?</a>
                    </form>  
                    <form className={'acc-form'} id={'formRegistro'} novalidate>
                        <h2>Crear cuenta</h2>
                        <p>Guarda tus favoritos, sigue tus pedidos y recibe antes que nadie las ediciones limitadas.</p>
                        <div className={'field'}><label htmlFor={'regNombre'}>Nombre</label><input className={'input'} id={'regNombre'} type={'text'} autocomplete={'given-name'} placeholder={'Tu nombre'} /></div>
                        <div className={'field'}><label htmlFor={'regEmail'}>Correo electrónico</label><input className={'input'} id={'regEmail'} type={'email'} autocomplete={'email'} placeholder={'nombre@dominio.com'} /></div>
                        <div className={'field'}><label htmlFor={'regTelefono'}>Número de teléfono</label><input className={'input'} id={'regTelefono'} type={'tel'} autocomplete={'tel'} placeholder={'Tu número de teléfono'} /></div>
                        <div className={'field'}><label htmlFor={'regPass'}>Contraseña</label><input className={'input'} id={'regPass'} type={'password'} autocomplete={'new-password'} placeholder={'Mínimo 6 caracteres'} /></div>
                        <label className={'check'} htmlFor={'regAcepto'}><input type={'checkbox'} id={'regAcepto'} /> <span>Acepto la <a href={'legal.html#privacidad'}>política de privacidad</a>.</span></label>
                        <button className={'btn btn-outline'} type={'submit'}>Crear cuenta</button>
                        <p className={'form-msg'} role={'status'}></p>
                    </form>
                </div>
                <p className={'acc-note'}>Mientras la tienda no esté conectada a su plataforma de pedidos, la cuenta se guarda solo en este navegador (nombre y correo; la contraseña no se guarda).</p>
            </div>
            <div className={'acc-panel'} id={'accountPanel'} hidden>
                <div className={'acc-card'}><p className={'eyebrow'}>Mi cuenta</p><h2>Hola, <span id={'accName'}>cliente</span></h2><p id={'accEmail'}></p><button className={'btn btn-ghost'} type={'button'} id={'logout'}>Cerrar sesión</button></div>
                <div className={'acc-card'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-heart'} /></svg><h3>Favoritos</h3><p id={'accFavs'}>0 relojes guardados</p><a className={'link-arrow'} href={'favoritos.html'}>Ver favoritos <svg className={'icon'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a></div>
                <div className={'acc-card'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-bag'} /></svg><h3>Carrito</h3><p id={'accCart'}>0 artículos</p><a className={'link-arrow'} href={'carrito.html'}>Ir al carrito <svg className={'icon'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a></div>
            </div>
        </div>
    </section>

</main>
  );
}
