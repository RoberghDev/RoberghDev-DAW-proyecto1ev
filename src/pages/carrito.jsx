import React, { useRef, useState } from 'react';
import { buscarColeccion, fotoProducto, precioTexto, resumenProducto } from '../data.js';
import { buscarProducto } from '../catalogo.js';
import { eventosFoto } from '../components/foto.js';
import { useStore } from '../store.jsx';

// Migrada desde la plantilla heredada carrito.html y public/js/carrito.js (fase 3).
export const title = 'OKIDOKEI · Carrito';
export const description = 'Tu carrito de OKIDOKEI.';

// FILA DEL CARRITO (MISMO HTML QUE GENERABA carrito.js).
function FilaCarrito({ linea }) {
    const store = useStore();
    const producto = buscarProducto(linea.id);
    if (!producto) return null; // EL CATÁLOGO DE LA API TODAVÍA NO HA LLEGADO.
    const coleccion = buscarColeccion(producto.coleccion);
    return <li className="row-item" data-id={producto.id}>
        <a className="row-thumb foto" href={`/producto/${producto.id}`}><img src={fotoProducto(producto)} alt={producto.nombre} data-foto="" {...eventosFoto} /></a>
        <div className="row-info"><p className="card-coll">{coleccion.nombre}</p><h3><a href={`/producto/${producto.id}`}>{producto.nombre}</a></h3>
            <p className="row-spec">{`${resumenProducto(producto)} · ${producto.correaTexto}`}</p>
            <button type="button" className="rm" data-rm="" onClick={() => { store.remove(producto.id); store.setToast(producto.nombre + ' eliminado del carrito'); }}><svg className="icon" aria-hidden="true"><use href="#i-trash" /></svg>Eliminar</button></div>
        <div className="qty"><button type="button" data-q="-1" aria-label={`Quitar una unidad de ${producto.nombre}`} onClick={() => store.setQty(producto.id, linea.qty - 1)}><svg className="icon"><use href="#i-minus" /></svg></button><span>{linea.qty}</span>
            <button type="button" data-q="1" aria-label={`Añadir una unidad de ${producto.nombre}`} onClick={() => store.setQty(producto.id, linea.qty + 1)}><svg className="icon"><use href="#i-plus" /></svg></button></div>
        <p className="row-price">{precioTexto(producto.precio * linea.qty)}{linea.qty > 1 && <small>{`${precioTexto(producto.precio)} / ud.`}</small>}</p>
    </li>;
}

// PAGO DE PRUEBA: VALIDA LA ACEPTACIÓN DE CONDICIONES.
function Checkout() {
    const [mensaje, setMensaje] = useState('');
    const aceptoRef = useRef(null);
    return <form id="checkout" className="stack" noValidate onSubmit={(evento) => {
        evento.preventDefault();
        setMensaje(aceptoRef.current.checked ? 'Pago de prueba: aquí se conectará la pasarela de pago de la tienda.' : 'Acepta las condiciones de compra para continuar.');
    }}>
        <label className="check" htmlFor="acepto"><input ref={aceptoRef} type="checkbox" id="acepto" /> <span>He leído y acepto las <a href="/legal#aviso">condiciones de compra</a> y la <a href="/legal#privacidad">política de privacidad</a>.</span></label>
        <button className="btn btn-copper btn-block" type="submit"><svg className="icon" aria-hidden="true"><use href="#i-lock" /></svg>Finalizar compra</button>
        <p className="form-msg" id="checkoutMsg" role="status">{mensaje}</p>
    </form>;
}

export default function Carrito() {
    const store = useStore();
    const lineas = store.cart;
    const total = store.total;
    const cantidad = store.cartCount;
    return (
<main>
    <section className="page-hero">
        <div className="wrap">
            <nav className="crumbs" aria-label="Estás aquí"><a href="/">Inicio</a><span aria-hidden="true">/</span><span aria-current="page">Carrito</span></nav>
            <p className="eyebrow">Tu compra</p>
            <h1 className="page-title">Carrito</h1>
            <p className="page-sub">Revisa tus relojes antes de finalizar la compra.</p>
        </div>
        <svg className="page-mark" aria-hidden="true"><use href="#emblem" /></svg>
    </section>

    <section className="section-dark section" aria-label="Contenido del carrito">
        <div className="wrap">
            <div className="empty" id="cartPageEmpty" hidden={lineas.length > 0}>
                <svg className="mark" aria-hidden="true"><use href="#emblem" /></svg>
                <h2>Tu carrito está vacío</h2>
                <p>Cuando añadas un reloj lo verás aquí. Tus favoritos te esperan en su página.</p>
                <div className="row row-center"><a className="btn btn-outline" href="/tienda">Ir a la tienda</a><a className="link-arrow" href="/favoritos">Ver favoritos <svg className="icon" aria-hidden="true"><use href="#i-right" /></svg></a></div>
            </div>
            <div className="cart-layout" id="cartPageFull" hidden={lineas.length === 0}>
                <div>
                    <div className="list-head"><a className="link-arrow" href="/tienda"><svg className="icon" aria-hidden="true"><use href="#i-left" /></svg>Seguir comprando</a><button className="rm" type="button" id="cartClear" onClick={() => { store.clearCart(); store.setToast('Carrito vaciado'); }}><svg className="icon" aria-hidden="true"><use href="#i-trash" /></svg>Vaciar carrito</button></div>
                    <ul id="cartRows">{lineas.map((linea) => <FilaCarrito key={linea.id} linea={linea} />)}</ul>
                </div>
                <aside className="summary" id="resumen" aria-labelledby="sumTitle">
                    <h2 id="sumTitle">Resumen</h2>
                    <div className="sum-row"><span>Artículos</span><strong id="sumItems">{cantidad + (cantidad === 1 ? ' artículo' : ' artículos')}</strong></div>
                    <div className="sum-row"><span>Subtotal</span><strong id="sumSubtotal">{precioTexto(total)}</strong></div>
                    <div className="sum-row"><span>Envío asegurado</span><strong>Gratis</strong></div>
                    <div className="sum-total"><span>Total</span><strong id="sumTotal">{precioTexto(total)}</strong></div>
                    <small id="sumIva">{`Incluye ${precioTexto(Math.round(total - total / 1.21))} de IVA (21 %)`}</small>
                    <Checkout />
                    <div className="pay-icons" aria-label="Métodos de pago"><span>Tarjeta</span><span>PayPal</span><span>Bizum</span><span>Transferencia</span></div>
                </aside>
            </div>
        </div>
    </section>

    <section className="trust" aria-label="Ventajas de comprar en OKIDOKEI">
        <div className="wrap trust-row">
            <a className="trust-item" href="/ayuda#envios"><svg className="icon" aria-hidden="true"><use href="#i-truck" /></svg><div><strong>Envío asegurado</strong><span>Gratis en toda España</span></div></a>
            <a className="trust-item" href="/ayuda#devoluciones"><svg className="icon" aria-hidden="true"><use href="#i-return" /></svg><div><strong>30 días</strong><span>Devolución sencilla</span></div></a>
            <a className="trust-item" href="/ayuda#garantia"><svg className="icon" aria-hidden="true"><use href="#i-shield" /></svg><div><strong>Garantía 3 años</strong><span>En todos los relojes</span></div></a>
            <a className="trust-item" href="/ayuda#faq"><svg className="icon" aria-hidden="true"><use href="#i-cert" /></svg><div><strong>Autenticidad</strong><span>Certificado en cada pieza</span></div></a>
            <a className="trust-item" href="/ayuda#faq"><svg className="icon" aria-hidden="true"><use href="#i-lock" /></svg><div><strong>Pago seguro</strong><span>Conexión cifrada SSL</span></div></a>
        </div>
    </section>
</main>
    );
}
