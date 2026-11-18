import React from 'react';
// Migrated from the original producto.html page markup.
export const title = 'OKIDOKEI · Reloj';
export const description = 'Ficha del reloj: fotos, precio, versiones y especificaciones.';
export default function Producto() {
  return (
<main>

    <div className={'crumb-bar'}><div className={'wrap'}><nav className={'crumbs'} aria-label={'Estás aquí'}><a href={'index.html'}>Inicio</a><span aria-hidden={'true'}>/</span><a href={'tienda.html'}>Tienda</a><span aria-hidden={'true'}>/</span><a id={'crumbColeccion'} href={'colecciones.html#esqueleto'}>Esqueleto</a><span aria-hidden={'true'}>/</span><span aria-current={'page'} id={'crumbNombre'}>Esqueleto Cobre</span></nav></div></div>

    <section className={'wrap pdp'} aria-labelledby={'pNombre'}>
        <div className={'pdp-gallery'}>
            <div className={'pdp-main foto'}><img id={'pFoto'} src={'assets/relojes/esqueleto-cobre.jpg'} alt={'Esqueleto Cobre'} data-foto /><span className={'tag'} id={'pTag'}>Nuevo</span></div>
            <div className={'pdp-thumbs'} id={'pThumbs'} hidden></div>
        </div>
        <div className={'pdp-info'}>
            <p className={'eyebrow'} id={'pColeccion'}>Colección Esqueleto · Esqueleto</p>
            <h1 id={'pNombre'}>Esqueleto Cobre</h1>
            <p className={'pdp-ref'} id={'pRef'}>Ref. OK-1201</p>
            <p className={'pdp-price'}><span id={'pPrecio'}>4.950 €</span><small>IVA incluido · Envío asegurado gratis</small></p>
            <p className={'pdp-desc'} id={'pDesc'}>Puentes vaciados y un calibre automático que se deja ver entero a través de la esfera. Para quien quiere mirar cómo late el tiempo.</p>
            <div className={'field'}><span className={'lbl'}>Elige tu versión</span><div className={'variants'} id={'pVariantes'}></div></div>
            <div className={'pdp-buy'}>
                <div className={'qty'}><button type={'button'} data-step={'-1'} aria-label={'Una unidad menos'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-minus'} /></svg></button><label className={'sr-only'} htmlFor={'pQty'}>Cantidad</label><input id={'pQty'} type={'number'} min={'1'} max={'9'} value={'1'} inputmode={'numeric'} /><button type={'button'} data-step={'1'} aria-label={'Una unidad más'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-plus'} /></svg></button></div>
                <button className={'btn btn-copper'} id={'pAdd'} type={'button'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-bag'} /></svg>Añadir al carrito</button>
                <button className={'fav fav-big'} id={'pFav'} type={'button'} data-fav={'esqueleto-cobre'} aria-pressed={'false'} aria-label={'Añadir a favoritos'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-heart'} /></svg></button>
            </div>
            <ul className={'pdp-perks'}>
                <li><svg className={'icon'} aria-hidden={'true'}><use href={'#i-truck'} /></svg><span>Envío asegurado gratis a toda España · <a href={'ayuda.html#envios'}>Envíos</a></span></li>
                <li><svg className={'icon'} aria-hidden={'true'}><use href={'#i-return'} /></svg><span>30 días para devolverlo · <a href={'ayuda.html#devoluciones'}>Devoluciones</a></span></li>
                <li><svg className={'icon'} aria-hidden={'true'}><use href={'#i-shield'} /></svg><span>3 años de garantía y certificado de autenticidad · <a href={'ayuda.html#garantia'}>Garantía</a></span></li>
            </ul>
            <details className={'acc'} open><summary>Especificaciones</summary><div className={'acc-body'}><table className={'specs'}><tbody id={'pSpecs'}><tr><th scope={'row'}>Referencia</th><td>OK-1201</td></tr><tr><th scope={'row'}>Caja</th><td>Cobre, 42 mm</td></tr><tr><th scope={'row'}>Movimiento</th><td>Automático esqueletado</td></tr><tr><th scope={'row'}>Reserva de marcha</th><td>42 horas</td></tr><tr><th scope={'row'}>Hermeticidad</th><td>5 ATM (50 m)</td></tr><tr><th scope={'row'}>Cristal</th><td>Zafiro abombado antirreflejos</td></tr><tr><th scope={'row'}>Correa</th><td>Piel marrón con pespunte crudo</td></tr></tbody></table></div></details>
            <details className={'acc'}><summary>Envío y devoluciones</summary><div className={'acc-body'}><p>Lo enviamos asegurado, en su estuche y con el certificado de autenticidad. Tienes 30 días desde que lo recibes para devolverlo sin usar y con sus precintos.</p><p>Los relojes con grabado personalizado no admiten devolución. <a className={'link-arrow'} href={'ayuda.html#devoluciones'}>Cómo devolver</a></p></div></details>
            <details className={'acc'}><summary>Garantía y servicio</summary><div className={'acc-body'}><p>3 años de garantía frente a defectos de fabricación. Te recomendamos una revisión del movimiento cada 4 o 5 años; puedes pedirla en nuestro <a className={'link-arrow'} href={'nosotros.html#mantenimiento'}>servicio de taller</a>.</p></div></details>
            <details className={'acc'}><summary>¿Tienes dudas?</summary><div className={'acc-body'}><p>Escríbenos y te ayudamos a elegir talla de correa, grabado o regalo. <a className={'link-arrow'} href={'ayuda.html#contacto'}>Contactar</a></p></div></details>
        </div>
    </section>

    <section className={'section section-2'} aria-labelledby={'relTitle'}>
        <div className={'wrap'}>
            <div className={'sec-head'}>
                <div><p className={'eyebrow'}>Sigue explorando</p><h2 className={'sec-title'} id={'relTitle'}>También te puede gustar</h2></div>
                <a className={'link-arrow'} href={'tienda.html'}>Ver toda la tienda <svg className={'icon'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a>
            </div>
            <div className={'grid-4'} id={'pRelacionados'}></div>
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
