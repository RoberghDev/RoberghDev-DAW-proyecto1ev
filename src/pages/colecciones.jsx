import React from 'react';
// Migrated from the original colecciones.html page markup.
export const title = 'OKIDOKEI · Colecciones';
export const description = 'Las seis colecciones de OKIDOKEI: Esqueleto, Heritage, Marine, Noir, Luna y Origine.';
export default function Colecciones() {
  return (
<main>

    <section className={'page-hero'}>
        <div className={'wrap'}>
            <nav className={'crumbs'} aria-label={'Estás aquí'}><a href={'index.html'}>Inicio</a><span aria-hidden={'true'}>/</span><span aria-current={'page'}>Colecciones</span></nav>
            <p className={'eyebrow'}>Seis maneras de llevar el tiempo</p>
            <h1 className={'page-title'}>Colecciones</h1>
            <p className={'page-sub'}>Del vestir clásico al buceo, del esqueleto a la fase lunar. Elige la que va contigo.</p>
        </div>
        <svg className={'page-mark'} aria-hidden={'true'}><use href={'#emblem'} /></svg>
    </section>

    <nav className={'subnav'} aria-label={'Colecciones'}><div className={'wrap'}><a href={'#esqueleto'}>Esqueleto</a><a href={'#heritage'}>Heritage</a><a href={'#marine'}>Marine</a><a href={'#noir'}>Noir</a><a href={'#luna'}>Luna</a><a href={'#origine'}>Origine</a></div></nav>
    <div className={'wrap'}>
        <section className={'coll'} id={'esqueleto'} aria-labelledby={'t-esqueleto'}>
            <a className={'coll-media foto'} href={'producto.html#esqueleto-cobre'} aria-label={'Ver Esqueleto Cobre'}><img src={'assets/relojes/esqueleto-cobre.jpg'} alt={'Reloj Esqueleto Cobre'} loading={'lazy'} data-foto /></a>
            <div className={'coll-text'}>
                <p className={'coll-num'}>01 / 06 · <span className={'eyebrow'}>Esqueleto</span></p>
                <h2 id={'t-esqueleto'}>ESQUELETO</h2>
                <p className={'coll-lema'}>El arte en movimiento</p>
                <p>Puentes vaciados y un calibre automático que se deja ver entero a través de la esfera. Para quien quiere mirar cómo late el tiempo.</p>
                <ul className={'coll-facts'}><li>42 mm</li><li>Automático esqueletado</li><li>5 ATM (50 m)</li><li>Desde 4.650 €</li></ul>
                <p className={'coll-models'}>Modelos: <a href={'producto.html#esqueleto-cobre'}>Esqueleto Cobre</a> <a href={'producto.html#esqueleto-acero'}>Esqueleto Acero</a></p>
                <div className={'row'}><a className={'btn btn-outline'} href={'tienda.html#esqueleto'}>Ver la colección</a><a className={'link-arrow'} href={'producto.html#esqueleto-cobre'}>Ver el reloj <svg className={'icon'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a></div>
            </div>
        </section>
        <section className={'coll'} id={'heritage'} aria-labelledby={'t-heritage'}>
            <a className={'coll-media foto'} href={'producto.html#heritage-cobre'} aria-label={'Ver Heritage Cobre'}><img src={'assets/relojes/heritage-cobre.jpg'} alt={'Reloj Heritage Cobre'} loading={'lazy'} data-foto /></a>
            <div className={'coll-text'}>
                <p className={'coll-num'}>02 / 06 · <span className={'eyebrow'}>Vestir</span></p>
                <h2 id={'t-heritage'}>HERITAGE</h2>
                <p className={'coll-lema'}>Elegancia atemporal</p>
                <p>Esfera lacada blanca, números romanos con el IIII de los relojeros y una caja fina que se desliza bajo el puño de la camisa.</p>
                <ul className={'coll-facts'}><li>40 mm</li><li>Automático</li><li>3 ATM (30 m)</li><li>Desde 1.790 €</li></ul>
                <p className={'coll-models'}>Modelos: <a href={'producto.html#heritage-cobre'}>Heritage Cobre</a> <a href={'producto.html#heritage-acero'}>Heritage Acero</a></p>
                <div className={'row'}><a className={'btn btn-outline'} href={'tienda.html#heritage'}>Ver la colección</a><a className={'link-arrow'} href={'producto.html#heritage-cobre'}>Ver el reloj <svg className={'icon'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a></div>
            </div>
        </section>
        <section className={'coll'} id={'marine'} aria-labelledby={'t-marine'}>
            <a className={'coll-media foto'} href={'producto.html#marine-acero'} aria-label={'Ver Marine Acero'}><img src={'assets/relojes/marine-acero.jpg'} alt={'Reloj Marine Acero'} loading={'lazy'} data-foto /></a>
            <div className={'coll-text'}>
                <p className={'coll-num'}>03 / 06 · <span className={'eyebrow'}>Deportivos</span></p>
                <h2 id={'t-marine'}>MARINE</h2>
                <p className={'coll-lema'}>Hechos para la acción</p>
                <p>Bisel unidireccional negro, índices luminiscentes y 300 metros de hermeticidad. Del barco a la oficina sin cambiar de reloj.</p>
                <ul className={'coll-facts'}><li>42 mm</li><li>Automático</li><li>30 ATM (300 m)</li><li>Desde 2.690 €</li></ul>
                <p className={'coll-models'}>Modelos: <a href={'producto.html#marine-acero'}>Marine Acero</a> <a href={'producto.html#marine-caucho'}>Marine Caucho</a> <a href={'producto.html#marine-cobre'}>Marine Cobre</a></p>
                <div className={'row'}><a className={'btn btn-outline'} href={'tienda.html#marine'}>Ver la colección</a><a className={'link-arrow'} href={'producto.html#marine-acero'}>Ver el reloj <svg className={'icon'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a></div>
            </div>
        </section>
        <section className={'coll'} id={'noir'} aria-labelledby={'t-noir'}>
            <a className={'coll-media foto'} href={'producto.html#noir-caucho'} aria-label={'Ver Noir Caucho'}><img src={'assets/relojes/noir-caucho.jpg'} alt={'Reloj Noir Caucho'} loading={'lazy'} data-foto /></a>
            <div className={'coll-text'}>
                <p className={'coll-num'}>04 / 06 · <span className={'eyebrow'}>Noir</span></p>
                <h2 id={'t-noir'}>NOIR</h2>
                <p className={'coll-lema'}>Negro y cobre</p>
                <p>Caja de acero con tratamiento negro, esfera rayos de sol e índices aplicados de cobre que atrapan la luz.</p>
                <ul className={'coll-facts'}><li>41 mm</li><li>Automático</li><li>10 ATM (100 m)</li><li>Desde 3.390 €</li></ul>
                <p className={'coll-models'}>Modelos: <a href={'producto.html#noir-caucho'}>Noir Caucho</a> <a href={'producto.html#noir-piel'}>Noir Piel</a></p>
                <div className={'row'}><a className={'btn btn-outline'} href={'tienda.html#noir'}>Ver la colección</a><a className={'link-arrow'} href={'producto.html#noir-caucho'}>Ver el reloj <svg className={'icon'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a></div>
            </div>
        </section>
        <section className={'coll'} id={'luna'} aria-labelledby={'t-luna'}>
            <a className={'coll-media foto'} href={'producto.html#luna-acero'} aria-label={'Ver Luna Acero'}><img src={'assets/relojes/luna-acero.jpg'} alt={'Reloj Luna Acero'} loading={'lazy'} data-foto /></a>
            <div className={'coll-text'}>
                <p className={'coll-num'}>05 / 06 · <span className={'eyebrow'}>Fases lunares</span></p>
                <h2 id={'t-luna'}>LUNA</h2>
                <p className={'coll-lema'}>El cielo en tu muñeca</p>
                <p>Una ventana a las 6 sigue el ciclo de 29,5 días de la luna, con dos lunas de cobre sobre un cielo negro.</p>
                <ul className={'coll-facts'}><li>40 mm</li><li>Automático con fase lunar</li><li>3 ATM (30 m)</li><li>Desde 3.150 €</li></ul>
                <p className={'coll-models'}>Modelos: <a href={'producto.html#luna-acero'}>Luna Acero</a> <a href={'producto.html#luna-cobre'}>Luna Cobre</a></p>
                <div className={'row'}><a className={'btn btn-outline'} href={'tienda.html#luna'}>Ver la colección</a><a className={'link-arrow'} href={'producto.html#luna-acero'}>Ver el reloj <svg className={'icon'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a></div>
            </div>
        </section>
        <section className={'coll'} id={'origine'} aria-labelledby={'t-origine'}>
            <a className={'coll-media foto'} href={'producto.html#origine'} aria-label={'Ver Origine Tourbillon'}><img src={'assets/relojes/origine.jpg'} alt={'Reloj Origine Tourbillon'} loading={'lazy'} data-foto /></a>
            <div className={'coll-text'}>
                <p className={'coll-num'}>06 / 06 · <span className={'eyebrow'}>Ediciones limitadas</span></p>
                <h2 id={'t-origine'}>ORIGINE</h2>
                <p className={'coll-lema'}>Piezas numeradas</p>
                <p>Caja de cobre de 43 mm, esfera negra guilloché y un tourbillon que gira a la vista a las 6. Solo 100 piezas numeradas, cada una con su certificado.</p>
                <ul className={'coll-facts'}><li>43 mm</li><li>Tourbillon de carga manual</li><li>3 ATM (30 m)</li><li>Desde 18.900 €</li></ul>
                <p className={'coll-models'}>Modelos: <a href={'producto.html#origine'}>Origine Tourbillon</a></p>
                <div className={'row'}><a className={'btn btn-outline'} href={'tienda.html#origine'}>Ver la colección</a><a className={'link-arrow'} href={'producto.html#origine'}>Ver el reloj <svg className={'icon'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a></div>
            </div>
        </section>
    </div>

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
