import React from 'react';
import { Hero, GearCanvas } from '../components/Visuals.jsx';
import { FeaturedProducts } from '../components/Commerce.jsx';
import { NewsletterForm } from '../components/Forms.jsx';
// Migrated from the original index.html page markup.
export const title = 'OKIDOKEI · Relojería online';
export const description = 'OKIDOKEI, tu relojería online de confianza: relojes automáticos, esqueletados, de buceo y ediciones limitadas en negro, blanco y cobre.';
export default function Index() {
  return (
<main>


    <Hero />

    <section className={'on-light cats'} aria-labelledby={'catsTitle'}>
        <h2 className={'sr-only'} id={'catsTitle'}>Colecciones</h2>
        <div className={'wrap cats-row'}>
            <a className={'cat'} href={'colecciones.html#heritage'}><span className={'cat-img foto'}><img src={'assets/relojes/heritage-cobre.jpg'} alt={'Reloj Heritage de esfera blanca'} loading={'lazy'} data-foto /></span><span className={'cat-name'}>Vestir</span><span className={'cat-sub'}>Elegancia atemporal</span></a>
            <a className={'cat'} href={'colecciones.html#marine'}><span className={'cat-img foto'}><img src={'assets/relojes/marine-acero.jpg'} alt={'Reloj Marine de buceo'} loading={'lazy'} data-foto /></span><span className={'cat-name'}>Deportivos</span><span className={'cat-sub'}>Hechos para la acción</span></a>
            <a className={'cat'} href={'colecciones.html#esqueleto'}><span className={'cat-img foto'}><img src={'assets/relojes/esqueleto-cobre.jpg'} alt={'Reloj Esqueleto con el movimiento visible'} loading={'lazy'} data-foto /></span><span className={'cat-name'}>Esqueleto</span><span className={'cat-sub'}>El arte en movimiento</span></a>
            <a className={'cat'} href={'colecciones.html#luna'}><span className={'cat-img foto'}><img src={'assets/relojes/luna-acero.jpg'} alt={'Reloj Luna con fases lunares'} loading={'lazy'} data-foto /></span><span className={'cat-name'}>Fases lunares</span><span className={'cat-sub'}>El cielo en tu muñeca</span></a>
            <a className={'cat'} href={'colecciones.html#noir'}><span className={'cat-img foto'}><img src={'assets/relojes/noir-caucho.jpg'} alt={'Reloj Noir negro con índices de cobre'} loading={'lazy'} data-foto /></span><span className={'cat-name'}>Noir</span><span className={'cat-sub'}>Negro y cobre</span></a>
            <a className={'cat'} href={'colecciones.html#origine'}><span className={'cat-img foto'}><img src={'assets/relojes/origine.jpg'} alt={'Reloj Origine con tourbillon'} loading={'lazy'} data-foto /></span><span className={'cat-name'}>Ediciones limitadas</span><span className={'cat-sub'}>Piezas numeradas</span></a>
        </div>
    </section>

    <section className={'section-dark featured'} aria-labelledby={'featTitle'}>
        <div className={'wrap'}>
            <div className={'sec-head'}>
                <div><p className={'eyebrow'}>Tienda</p><h2 className={'sec-title'} id={'featTitle'}>Piezas destacadas</h2></div>
                <a className={'link-arrow'} href={'tienda.html'}>Ver toda la tienda <svg className={'icon'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a>
            </div>
            <FeaturedProducts />
        </div>
    </section>

    <section className={'on-light craft'} aria-labelledby={'craftTitle'}>
        <div className={'craft-visual'}>
            <GearCanvas />
            <p className={'craft-caption'}>Calibre OK-01 · 28.800 alternancias/h · 42 h de reserva</p>
        </div>
        <div className={'craft-text'}>
            <p className={'eyebrow'}>Nuestro oficio</p>
            <h2 id={'craftTitle'}>Construido sobre la tradición.<br /><em>Movido por la precisión.</em></h2>
            <p>Cada reloj OKIDOKEI pasa por nuestro taller antes de llegar a tus manos. Lo revisamos, regulamos su marcha y comprobamos cada detalle, porque un buen reloj se elige para acompañarte durante años.</p>
            <a className={'btn btn-dark'} href={'nosotros.html'}>Descubre nuestra historia</a>
        </div>
        <ul className={'craft-list'}>
            <li className={'craft-item'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-gear'} /></svg><div><h3>Movimientos automáticos</h3><p>Precisión que puedes sentir</p></div></li>
            <li className={'craft-item'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-hand'} /></svg><div><h3>Acabados a mano</h3><p>Perlado y biselado en cada pieza</p></div></li>
            <li className={'craft-item'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-diamond'} /></svg><div><h3>Materiales nobles</h3><p>Acero, cobre y cristal de zafiro</p></div></li>
            <li className={'craft-item'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-hourglass'} /></svg><div><h3>Hechos para durar</h3><p>Diseño que no caduca</p></div></li>
        </ul>
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

    <section className={'limited'} aria-labelledby={'limTitle'}>
        <div className={'wrap limited-grid'}>
            <a className={'limited-img foto'} href={'producto.html#origine'} aria-label={'Ver Origine Tourbillon'}><img src={'assets/relojes/origine.jpg'} alt={'OKIDOKEI Origine con tourbillon visible a las 6'} loading={'lazy'} data-foto /></a>
            <div className={'limited-text'}>
                <p className={'eyebrow'}>Edición limitada</p>
                <h2 id={'limTitle'}><span className={'cu-text'}>ORIGINE</span> · TOURBILLON</h2>
                <p>Caja de cobre de 43 mm, esfera negra guilloché y un tourbillon que gira a la vista a las 6. Solo 100 piezas numeradas, cada una con su certificado.</p>
                <div className={'row'}><span className={'limited-price'}>18.900 €</span><button className={'btn btn-outline'} type={'button'} data-add={'origine'}>Reservar la mía</button><a className={'link-arrow'} href={'producto.html#origine'}>Ver la ficha <svg className={'icon'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a></div>
            </div>
            <div className={'pieces'} aria-label={'Quedan 23 de 100 piezas'}>
                <p className={'lbl'}>Piezas disponibles</p>
                <p className={'num cu-text'}>23</p>
                <p className={'of'}>de 100</p>
                <div className={'pieces-bar'} aria-hidden={'true'}><i></i></div>
            </div>
        </div>
    </section>

    <section className={'on-light manifesto'} aria-labelledby={'manTitle'}>
        <div className={'wrap man-grid'}>
            <div className={'man-left'}>
                <p className={'eyebrow'}>Para amantes de la relojería</p>
                <h2 id={'manTitle'}>Diseños atemporales.<br />Confianza en cada segundo.</h2>
                <a className={'btn btn-dark'} href={'nosotros.html'}>Conoce OKIDOKEI</a>
            </div>
            <figure className={'quote'}>
                <span className={'qmark'} aria-hidden={'true'}>“</span>
                <blockquote>Un buen reloj no se compra para hoy. Se elige para acompañarte durante años, y por eso cuidamos cada detalle: desde que lo descubres hasta que lo llevas puesto.</blockquote>
                <figcaption><svg aria-hidden={'true'}><use href={'#emblem'} /></svg><div><strong>El equipo OKIDOKEI</strong><span>Tu relojería online de confianza</span></div></figcaption>
            </figure>
            <div className={'services'}>
                <h3 className={'eyebrow'}>Servicios de relojería</h3>
                <ul>
                    <li><a href={'nosotros.html#grabado'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-pen'} /></svg>Grabado personalizado<svg className={'icon arr'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a></li>
                    <li><a href={'nosotros.html#mantenimiento'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-wrench'} /></svg>Revisión y mantenimiento<svg className={'icon arr'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a></li>
                    <li><a href={'nosotros.html#brazalete'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-link'} /></svg>Ajuste de brazalete<svg className={'icon arr'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a></li>
                    <li><a href={'nosotros.html#regalo'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-gift'} /></svg>Envoltorio de regalo<svg className={'icon arr'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a></li>
                </ul>
            </div>
        </div>
    </section>

    <section className={'section-dark journal'} aria-labelledby={'jTitle'}>
        <div className={'wrap'}>
            <div className={'sec-head'}>
                <div><p className={'eyebrow'}>Journal</p><h2 className={'sec-title'} id={'jTitle'}>Historias que inspiran</h2></div>
                <a className={'link-arrow'} href={'journal.html'}>Ver todos los artículos <svg className={'icon'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a>
            </div>
            <div className={'grid-3'}>
                <article className={'story'}><a className={'story-img foto'} href={'journal.html#esqueletado'} tabIndex={'-1'} aria-hidden={'true'}><img src={'assets/journal/esqueletado.jpg'} alt={'Detalle del volante y los puentes de un movimiento esqueletado'} loading={'lazy'} data-foto /></a>
                    <div className={'story-body'}><p className={'eyebrow'}>Artesanía</p><h3><a href={'journal.html#esqueletado'}>El arte del esqueletado</a></h3><p>Cómo se vacía un movimiento sin restarle resistencia.</p><a className={'link-arrow'} href={'journal.html#esqueletado'}>Leer más <svg className={'icon'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a></div></article>
                <article className={'story'}><a className={'story-img foto'} href={'journal.html#buceo'} tabIndex={'-1'} aria-hidden={'true'}><img src={'assets/journal/buceo.jpg'} alt={'Perfil de un reloj de buceo con bisel giratorio y corona'} loading={'lazy'} data-foto /></a>
                    <div className={'story-body'}><p className={'eyebrow'}>Guía</p><h3><a href={'journal.html#buceo'}>Cómo elegir tu primer reloj de buceo</a></h3><p>Hermeticidad, bisel y legibilidad: lo que de verdad importa.</p><a className={'link-arrow'} href={'journal.html#buceo'}>Leer más <svg className={'icon'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a></div></article>
                <article className={'story'}><a className={'story-img foto'} href={'journal.html#fases-lunares'} tabIndex={'-1'} aria-hidden={'true'}><img src={'assets/journal/fases-lunares.jpg'} alt={'Ventana de fases lunares sobre una esfera blanca'} loading={'lazy'} data-foto /></a>
                    <div className={'story-body'}><p className={'eyebrow'}>Colecciones</p><h3><a href={'journal.html#fases-lunares'}>Fases lunares, una complicación poética</a></h3><p>El mecanismo que sigue el ciclo de 29,5 días de la luna.</p><a className={'link-arrow'} href={'journal.html#fases-lunares'}>Leer más <svg className={'icon'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a></div></article>
            </div>
        </div>
    </section>

    <section className={'on-light news'} id={'newsletter'} aria-labelledby={'newsTitle'}>
        <div className={'wrap news-grid'}>
            <div className={'news-art'} aria-hidden={'true'}>
                <svg viewBox={'0 0 200 200'} fill={'none'} stroke={'currentColor'} strokeWidth={'.7'}>
                    <circle cx={'100'} cy={'100'} r={'78'} /><circle cx={'100'} cy={'100'} r={'70'} /><circle cx={'100'} cy={'100'} r={'52'} /><circle cx={'100'} cy={'100'} r={'4'} />
                    <path d={'M100 30v10M100 160v10M30 100h10M160 100h10M135 39.4l-5 8.7M65 160.6l5-8.7M39.4 65l8.7 5M160.6 135l-8.7-5M39.4 135l8.7-5M160.6 65l-8.7 5M65 39.4l5 8.7M135 160.6l-5-8.7'} />
                    <path d={'M100 100 70 72M100 100l38-20'} /><path d={'M178 92h8v16h-8M88 22V10h24v12M88 178v12h24v-12'} />
                    <circle cx={'100'} cy={'132'} r={'14'} /><circle cx={'100'} cy={'132'} r={'9'} />
                </svg>
            </div>
            <div className={'news-copy'}>
                <p className={'eyebrow'}>Sé el primero en saberlo</p>
                <h2 id={'newsTitle'}>Únete a nuestra comunidad.</h2>
                <p>Recibe novedades, lanzamientos y ofertas exclusivas directamente en tu correo.</p>
            </div>
            <NewsletterForm />
        </div>
    </section>

</main>
  );
}
