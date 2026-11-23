import React from 'react';
import { eventosFoto } from '../components/foto.js';
// Migrada desde la plantilla heredada nosotros.html (fase 3).
export const title = 'OKIDOKEI · Nosotros';
export const description = 'La historia de OKIDOKEI, nuestro taller y los servicios de relojería.';
export default function Nosotros() {
  return (
<main>

    <section className={'page-hero'}>
        <div className={'wrap'}>
            <nav className={'crumbs'} aria-label={'Estás aquí'}><a href={'index.html'}>Inicio</a><span aria-hidden={'true'}>/</span><span aria-current={'page'}>Nosotros</span></nav>
            <p className={'eyebrow'}>Nuestra historia</p>
            <h1 className={'page-title'}>Nosotros</h1>
            <p className={'page-sub'}>Una relojería online hecha por gente que se para a mirar los relojes.</p>
        </div>
        <svg className={'page-mark'} aria-hidden={'true'}><use href={'#emblem'} /></svg>
    </section>

    <section className={'on-light section about-intro'} aria-labelledby={'histTitle'}>
        <div className={'wrap split'}>
            <div className={'about-visual foto'}><img src={'assets/nosotros/taller.jpg'} alt={'Relojero revisando un movimiento en el taller'} loading={'lazy'} data-foto="" {...eventosFoto} /></div>
            <div className={'about-text'}>
                <p className={'eyebrow'}>Quiénes somos</p>
                <h2 id={'histTitle'}>Comprar un reloj online con la misma confianza que en una boutique.</h2>
                <p>OKIDOKEI nació de una idea sencilla: que elegir un reloj por internet no fuera un salto al vacío. Por eso cada pieza que vendemos pasa antes por nuestras manos, viaja asegurada y llega con su certificado.</p>
                <p>El nombre suena a «okey-dokey», a que todo va bien. Y en japonés, <em>okidokei</em> (置時計) es el reloj que se deja sobre la mesa y marca el ritmo de la casa. Las dos cosas nos gustan.</p>
                <a className={'btn btn-dark'} href={'tienda.html'}>Ver los relojes</a>
            </div>
        </div>
    </section>

    <section className={'section-dark section'} aria-labelledby={'valTitle'}>
        <div className={'wrap'}>
            <div className={'sec-head'}><div><p className={'eyebrow'}>Lo que nos importa</p><h2 className={'sec-title'} id={'valTitle'}>Nuestros valores</h2></div></div>
            <div className={'values'}>
                <div className={'value'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-gear'} /></svg><h3>Mecánica de verdad</h3><p>Relojes automáticos y de carga manual que se pueden revisar y durar décadas.</p></div>
                <div className={'value'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-hand'} /></svg><h3>Detalle a mano</h3><p>Perlado, biselado y puentes que se ven. Lo que no se ve, también se cuida.</p></div>
                <div className={'value'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-diamond'} /></svg><h3>Materiales nobles</h3><p>Acero, cobre y cristal de zafiro. Nada de chapados que se gasten en dos veranos.</p></div>
                <div className={'value'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-hourglass'} /></svg><h3>Sin fecha de caducidad</h3><p>Diseños pensados para no pasar de moda y piezas de recambio disponibles.</p></div>
            </div>
        </div>
    </section>

    <section className={'on-light section'} id={'taller'} aria-labelledby={'tallerTitle'}>
        <div className={'wrap'}>
            <div className={'sec-head'}><div><p className={'eyebrow'}>El taller</p><h2 className={'sec-title'} id={'tallerTitle'}>Así revisamos cada reloj</h2><p className={'sec-lead'}>Antes de salir hacia tu casa, cada reloj recorre estos cuatro pasos.</p></div></div>
            <ol className={'steps'}>
                <li className={'step'}><h3>Recepción</h3><p>Comprobamos referencia, número de serie y documentación de cada pieza.</p></li>
                <li className={'step'}><h3>Revisión</h3><p>Abrimos y revisamos el movimiento, las juntas y el estado de caja y cristal.</p></li>
                <li className={'step'}><h3>Regulación</h3><p>Ajustamos la marcha y la comprobamos en varias posiciones durante días.</p></li>
                <li className={'step'}><h3>Control final</h3><p>Limpieza, prueba de hermeticidad, estuche, certificado y envío asegurado.</p></li>
            </ol>
        </div>
    </section>

    <section className={'section-dark section'} id={'servicios'} aria-labelledby={'servTitle'}>
        <div className={'wrap'}>
            <div className={'sec-head'}><div><p className={'eyebrow'}>Servicios de relojería</p><h2 className={'sec-title'} id={'servTitle'}>Para tu reloj, también después</h2></div><a className={'link-arrow'} href={'ayuda.html#contacto'}>Pedir presupuesto <svg className={'icon'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a></div>
            <div className={'service-grid'}>
            <article className={'service'} id={'grabado'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-pen'} /></svg><h3>Grabado personalizado</h3><p>Iniciales, una fecha o una frase corta en el fondo de la caja. Te enviamos una prueba antes de grabar. Los relojes grabados no admiten devolución.</p><a className={'link-arrow'} href={'ayuda.html#contacto'}>Solicitar <svg className={'icon'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a></article>
            <article className={'service'} id={'mantenimiento'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-wrench'} /></svg><h3>Revisión y mantenimiento</h3><p>Un movimiento mecánico agradece una revisión cada 4 o 5 años: limpieza, lubricación, ajuste de marcha y prueba de hermeticidad.</p><a className={'link-arrow'} href={'ayuda.html#contacto'}>Solicitar <svg className={'icon'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a></article>
            <article className={'service'} id={'brazalete'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-link'} /></svg><h3>Ajuste de brazalete</h3><p>Quitamos o añadimos eslabones para que el brazalete quede a tu medida. Dinos el contorno de tu muñeca al hacer el pedido.</p><a className={'link-arrow'} href={'ayuda.html#contacto'}>Solicitar <svg className={'icon'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a></article>
            <article className={'service'} id={'regalo'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-gift'} /></svg><h3>Envoltorio de regalo</h3><p>Estuche negro, lazo de cobre y una tarjeta con tu mensaje escrito a mano. El precio no aparece en ningún documento del paquete.</p><a className={'link-arrow'} href={'ayuda.html#contacto'}>Solicitar <svg className={'icon'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a></article>
            </div>
        </div>
    </section>

    <section className={'section-dark section jobs-section'} id={'empleo'} aria-labelledby={'empTitle'}>
        <div className={'wrap'}>
            <div className={'jobs'}>
                <div><p className={'eyebrow'}>Trabaja con nosotros</p><h2 id={'empTitle'}>¿Te apasionan los relojes?</h2><p>Buscamos de vez en cuando relojeros, fotógrafos de producto y personas de atención al cliente. Cuéntanos quién eres y qué te gustaría hacer.</p></div>
                <a className={'btn btn-outline'} href={'ayuda.html#contacto'}>Escríbenos</a>
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
