import React from 'react';
// Migrated from the original carrito.html page markup.
export const title = 'OKIDOKEI · Carrito';
export const description = 'Tu carrito de OKIDOKEI.';
export default function Carrito() {
  return (
<main>

    <section className={'page-hero'}>
        <div className={'wrap'}>
            <nav className={'crumbs'} aria-label={'Estás aquí'}><a href={'index.html'}>Inicio</a><span aria-hidden={'true'}>/</span><span aria-current={'page'}>Carrito</span></nav>
            <p className={'eyebrow'}>Tu compra</p>
            <h1 className={'page-title'}>Carrito</h1>
            <p className={'page-sub'}>Revisa tus relojes antes de finalizar la compra.</p>
        </div>
        <svg className={'page-mark'} aria-hidden={'true'}><use href={'#emblem'} /></svg>
    </section>

    <section className={'section-dark section'} aria-label={'Contenido del carrito'}>
        <div className={'wrap'}>
            <div className={'empty'} id={'cartPageEmpty'}>
                <svg className={'mark'} aria-hidden={'true'}><use href={'#emblem'} /></svg>
                <h2>Tu carrito está vacío</h2>
                <p>Cuando añadas un reloj lo verás aquí. Tus favoritos te esperan en su página.</p>
                <div className={'row row-center'}><a className={'btn btn-outline'} href={'tienda.html'}>Ir a la tienda</a><a className={'link-arrow'} href={'favoritos.html'}>Ver favoritos <svg className={'icon'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a></div>
            </div>
            <div className={'cart-layout'} id={'cartPageFull'} hidden>
                <div>
                    <div className={'list-head'}><a className={'link-arrow'} href={'tienda.html'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-left'} /></svg>Seguir comprando</a><button className={'rm'} type={'button'} id={'cartClear'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-trash'} /></svg>Vaciar carrito</button></div>
                    <ul id={'cartRows'}></ul>
                </div>
                <aside className={'summary'} id={'resumen'} aria-labelledby={'sumTitle'}>
                    <h2 id={'sumTitle'}>Resumen</h2>
                    <div className={'sum-row'}><span>Artículos</span><strong id={'sumItems'}>0 artículos</strong></div>
                    <div className={'sum-row'}><span>Subtotal</span><strong id={'sumSubtotal'}>0 €</strong></div>
                    <div className={'sum-row'}><span>Envío asegurado</span><strong>Gratis</strong></div>
                    <div className={'sum-total'}><span>Total</span><strong id={'sumTotal'}>0 €</strong></div>
                    <small id={'sumIva'}>Incluye IVA</small>
                    <form id={'checkout'} className={'stack'} novalidate>
                        <label className={'check'} htmlFor={'acepto'}><input type={'checkbox'} id={'acepto'} /> <span>He leído y acepto las <a href={'legal.html#aviso'}>condiciones de compra</a> y la <a href={'legal.html#privacidad'}>política de privacidad</a>.</span></label>
                        <button className={'btn btn-copper btn-block'} type={'submit'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-lock'} /></svg>Finalizar compra</button>
                        <p className={'form-msg'} id={'checkoutMsg'} role={'status'}></p>
                    </form>
                    <div className={'pay-icons'} aria-label={'Métodos de pago'}><span>Tarjeta</span><span>PayPal</span><span>Bizum</span><span>Transferencia</span></div>
                </aside>
            </div>
        </div>
    </section>

    <section className={'trust'} aria-label={'Ventajas de comprar en OKIDOKEI'}>
        <div className={'wrap trust-row'}>
            <a className={'trust-item'} href={'ayuda.html#envios'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-truck'} /></svg><div><strong>Envío asegurado</strong><span>Gratis en toda España</span></div></a>
            <a className={'trust-item'} href={'ayuda.html#devoluciones'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-return'} /></svg><div><strong>30 días</strong><span>Devolución sencilla</span></div></a>
            <a className={'trust-item'} href={'ayuda.html#garantia'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-shield'} /></svg><div><strong>Garantía 3 años</strong><span>En todos los relojes</span></div></a>
            <a className={'trust-item'} href={'ayuda.html#faq'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-cert'} /></svg><div><strong>Autenticidad</strong><span>Certificado en cada pieza</span></div></a>
            <a className={'trust-item'} href={'ayuda.html#faq'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-lock'} /></svg><div><strong>Pago seguro</strong><span>Conexión cifrada SSL</span></div></a>
        </div>
    </section>

</main>
  );
}
