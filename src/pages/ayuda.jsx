import React from 'react';
import { ContactForm } from '../components/Forms.jsx';
// Migrated from the original ayuda.html page markup.
export const title = 'OKIDOKEI · Ayuda';
export const description = 'Contacto, envíos, devoluciones, garantía y preguntas frecuentes de OKIDOKEI.';
export default function Ayuda() {
  return (
<main>

    <section className={'page-hero'}>
        <div className={'wrap'}>
            <nav className={'crumbs'} aria-label={'Estás aquí'}><a href={'index.html'}>Inicio</a><span aria-hidden={'true'}>/</span><span aria-current={'page'}>Ayuda</span></nav>
            <p className={'eyebrow'}>Atención al cliente</p>
            <h1 className={'page-title'}>Ayuda</h1>
            <p className={'page-sub'}>Contacto, envíos, devoluciones, garantía y preguntas frecuentes.</p>
        </div>
        <svg className={'page-mark'} aria-hidden={'true'}><use href={'#emblem'} /></svg>
    </section>

    <nav className={'subnav'} aria-label={'Secciones de ayuda'}><div className={'wrap'}><a href={'#contacto'}>Contacto</a><a href={'#envios'}>Envíos</a><a href={'#devoluciones'}>Devoluciones</a><a href={'#garantia'}>Garantía</a><a href={'#faq'}>Preguntas frecuentes</a></div></nav>
    <div className={'section-dark'}><div className={'wrap'}>
        <section className={'help-block'} id={'contacto'} aria-labelledby={'contTitle'}>
            <div className={'help-grid'}>
                <div>
                    <p className={'eyebrow'}>Contacto</p>
                    <h2 id={'contTitle'}>Hablemos</h2>
                    <p>¿Dudas con una talla de correa, un grabado o un regalo? Escríbenos y te responde una persona del equipo, no un robot.</p>
                    <ul className={'contact-list'}>
                        <li><svg className={'icon'} aria-hidden={'true'}><use href={'#i-clock'} /></svg><span>Lunes a viernes, de 10:00 a 19:00</span></li>
                        <li><svg className={'icon'} aria-hidden={'true'}><use href={'#i-mail'} /></svg><span>Respuesta en 24–48 h laborables</span></li>
                        <li><svg className={'icon'} aria-hidden={'true'}><use href={'#i-box'} /></svg><span>Enviamos desde España a toda la península, islas y la UE</span></li>
                    </ul>
                </div>
                <ContactForm />
            </div>
        </section>

        <section className={'help-block'} id={'envios'} aria-labelledby={'envTitle'}>
            <div className={'help-grid'}>
                <div><p className={'eyebrow'}>Envíos</p><h2 id={'envTitle'}>Envíos y entregas</h2></div>
                <div className={'prose'}>
                    <p>Todos los relojes viajan <strong>asegurados</strong>, en su estuche y con el certificado de autenticidad. El envío es <strong>gratuito</strong> en España.</p>
                    <ul><li>Península: 24–72 h laborables.</li><li>Baleares y Canarias: 3–6 días laborables (en Canarias pueden aplicarse tasas de importación).</li><li>Unión Europea: 3–7 días laborables.</li></ul>
                    <p>Cuando sale tu pedido te enviamos el número de seguimiento. Por seguridad, la entrega se hace en mano y con firma.</p>
                </div>
            </div>
        </section>

        <section className={'help-block'} id={'devoluciones'} aria-labelledby={'devTitle'}>
            <div className={'help-grid'}>
                <div><p className={'eyebrow'}>Devoluciones</p><h2 id={'devTitle'}>30 días para pensarlo</h2></div>
                <div className={'prose'}>
                    <p>Tienes <strong>30 días</strong> desde que recibes el reloj para devolverlo. Solo tiene que estar sin usar, con sus precintos y plásticos protectores, el estuche y toda la documentación.</p>
                    <ol><li>Escríbenos desde el <a href={'#contacto'}>formulario de contacto</a> con tu número de pedido.</li><li>Te enviamos la etiqueta y recogemos el paquete en tu casa.</li><li>Revisamos el reloj y te devolvemos el dinero por el mismo medio de pago en un máximo de 14 días.</li></ol>
                    <p className={'note'}>Los relojes con grabado personalizado se hacen a medida y no admiten devolución.</p>
                </div>
            </div>
        </section>

        <section className={'help-block'} id={'garantia'} aria-labelledby={'garTitle'}>
            <div className={'help-grid'}>
                <div><p className={'eyebrow'}>Garantía</p><h2 id={'garTitle'}>3 años de garantía</h2></div>
                <div className={'prose'}>
                    <p>Todos nuestros relojes nuevos tienen <strong>3 años de garantía</strong>, la garantía legal en España, frente a cualquier defecto de fabricación.</p>
                    <h3>No cubre</h3>
                    <ul><li>El desgaste normal de correas, cristales y acabados.</li><li>Golpes, caídas o entrada de agua por llevar la corona sin enroscar.</li><li>Relojes abiertos o reparados fuera de nuestro taller.</li></ul>
                    <p>Para que dure décadas, te recomendamos una revisión del movimiento cada 4 o 5 años. Puedes pedirla en nuestro <a href={'nosotros.html#mantenimiento'}>servicio de mantenimiento</a>.</p>
                </div>
            </div>
        </section>

        <section className={'help-block'} id={'faq'} aria-labelledby={'faqTitle'}>
            <div className={'sec-head'}><div><p className={'eyebrow'}>Preguntas frecuentes</p><h2 className={'sec-title'} id={'faqTitle'}>Lo que más nos preguntáis</h2></div></div>
            <div className={'faq'}>
                <details className={'acc'} id={'autenticos'}><summary>¿Los relojes son originales?</summary><div className={'acc-body'}><p>Sí. Cada reloj sale de nuestro taller con su certificado de autenticidad, número de serie y la documentación del fabricante.</p></div></details>
                <details className={'acc'} id={'automatico'}><summary>¿Qué significa que un reloj es automático?</summary><div className={'acc-body'}><p>Que se carga solo con el movimiento de tu muñeca gracias a un rotor. Si lo dejas quieto, sigue funcionando el tiempo que indica su reserva de marcha (entre 40 y 72 horas en nuestros modelos); después basta con darle cuerda o volver a ponértelo.</p></div></details>
                <details className={'acc'} id={'plazos'}><summary>¿Cuánto tarda en llegar mi pedido?</summary><div className={'acc-body'}><p>Normalmente entre 24 y 72 horas laborables en la península. Los pedidos con grabado o ajuste de brazalete necesitan unos días más.</p></div></details>
                <details className={'acc'} id={'grabado'}><summary>¿Puedo grabar mi reloj?</summary><div className={'acc-body'}><p>Sí, en el fondo de la caja. Te enviamos una prueba antes de grabar. Los relojes grabados no admiten devolución. Más información en <a href={'nosotros.html#grabado'}>servicios de relojería</a>.</p></div></details>
                <details className={'acc'} id={'tarjeta-regalo'}><summary>¿Tenéis tarjeta regalo?</summary><div className={'acc-body'}><p>Sí. Escríbenos desde el <a href={'#contacto'}>formulario de contacto</a> con el importe y te la preparamos en formato digital o en una tarjeta física dentro de nuestro estuche.</p></div></details>
                <details className={'acc'} id={'pago'}><summary>¿Qué formas de pago aceptáis?</summary><div className={'acc-body'}><p>Tarjeta, PayPal, Bizum y transferencia. El pago se hace siempre a través de una conexión cifrada.</p></div></details>
                <details className={'acc'} id={'fase-lunar'}><summary>¿Cómo pongo en hora la fase lunar?</summary><div className={'acc-body'}><p>Lo explicamos paso a paso en el <a href={'journal.html#fases-lunares'}>Journal</a>.</p></div></details>
            </div>
        </section>
    </div></div>

</main>
  );
}
