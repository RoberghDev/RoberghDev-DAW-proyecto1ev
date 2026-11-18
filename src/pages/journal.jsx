import React from 'react';
import { NewsletterForm } from '../components/Forms.jsx';
// Migrated from the original journal.html page markup.
export const title = 'OKIDOKEI · Journal';
export const description = 'Artículos sobre relojería: esqueletado, relojes de buceo y fases lunares.';
export default function Journal() {
  return (
<main>

    <section className={'page-hero'}>
        <div className={'wrap'}>
            <nav className={'crumbs'} aria-label={'Estás aquí'}><a href={'index.html'}>Inicio</a><span aria-hidden={'true'}>/</span><span aria-current={'page'}>Journal</span></nav>
            <p className={'eyebrow'}>Historias que inspiran</p>
            <h1 className={'page-title'}>Journal</h1>
            <p className={'page-sub'}>Oficio, guías y curiosidades del mundo de la relojería.</p>
        </div>
        <svg className={'page-mark'} aria-hidden={'true'}><use href={'#emblem'} /></svg>
    </section>

    <section className={'section-dark section'} id={'articulos'} aria-labelledby={'jTitle'}>
        <div className={'wrap'}>
            <div className={'sec-head'}><div><p className={'eyebrow'}>Artículos</p><h2 className={'sec-title'} id={'jTitle'}>Últimos artículos</h2></div></div>
            <div className={'grid-3'}>
                <article className={'story'}><a className={'story-img foto'} href={'#esqueletado'} tabIndex={'-1'} aria-hidden={'true'}><img src={'assets/journal/esqueletado.jpg'} alt={'Detalle del volante y los puentes de un movimiento esqueletado'} loading={'lazy'} data-foto /></a>
                    <div className={'story-body'}><p className={'eyebrow'}>Artesanía</p><h3><a href={'#esqueletado'}>El arte del esqueletado</a></h3><p>Cómo se vacía un movimiento sin restarle resistencia.</p><a className={'link-arrow'} href={'#esqueletado'}>Leer más <svg className={'icon'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a></div></article>
                <article className={'story'}><a className={'story-img foto'} href={'#buceo'} tabIndex={'-1'} aria-hidden={'true'}><img src={'assets/journal/buceo.jpg'} alt={'Perfil de un reloj de buceo con bisel giratorio y corona'} loading={'lazy'} data-foto /></a>
                    <div className={'story-body'}><p className={'eyebrow'}>Guía</p><h3><a href={'#buceo'}>Cómo elegir tu primer reloj de buceo</a></h3><p>Hermeticidad, bisel y legibilidad: lo que de verdad importa.</p><a className={'link-arrow'} href={'#buceo'}>Leer más <svg className={'icon'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a></div></article>
                <article className={'story'}><a className={'story-img foto'} href={'#fases-lunares'} tabIndex={'-1'} aria-hidden={'true'}><img src={'assets/journal/fases-lunares.jpg'} alt={'Ventana de fases lunares sobre una esfera blanca'} loading={'lazy'} data-foto /></a>
                    <div className={'story-body'}><p className={'eyebrow'}>Colecciones</p><h3><a href={'#fases-lunares'}>Fases lunares, una complicación poética</a></h3><p>El mecanismo que sigue el ciclo de 29,5 días de la luna.</p><a className={'link-arrow'} href={'#fases-lunares'}>Leer más <svg className={'icon'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a></div></article>
            </div>
        </div>
    </section>
    <div className={'section-2'}>
        <article className={'article'} id={'esqueletado'} aria-labelledby={'t-esqueletado'}>
            <header className={'article-head'}><p className={'eyebrow'}>Artesanía</p><h2 id={'t-esqueletado'}>El arte del esqueletado</h2><p className={'article-meta'}>12 de noviembre de 2026 · 4 min de lectura</p></header>
            <div className={'article-img foto'}><img src={'assets/journal/esqueletado.jpg'} alt={'Detalle del volante y los puentes de un movimiento esqueletado'} loading={'lazy'} data-foto /></div>
            <div className={'prose'}>
                <p>Un reloj esqueletado es aquel al que se le ha quitado todo el metal que no es imprescindible de la platina y los puentes, para que el movimiento quede a la vista. Lo que queda es una estructura de arcos y brazos que tiene que seguir sujetando cada rueda en su sitio, al micrómetro.</p>
                <h3>Cómo se hace</h3>
                <p>Tradicionalmente, el relojero dibuja el diseño sobre la pieza, taladra pequeños agujeros de entrada y recorta con una sierra de marquetería muy fina. Después lima y pule cada borde a mano. Hoy muchas casas recortan con máquinas de control numérico o electroerosión y reservan la mano para lo que más se nota: el acabado.</p>
                <h3>Los acabados que lo hacen brillar</h3>
                <ul><li><strong>Biselado:</strong> los cantos se achaflanan y se pulen para que cada brazo atrape la luz.</li><li><strong>Perlado:</strong> pequeños círculos superpuestos sobre la platina, como escamas.</li><li><strong>Côtes de Genève:</strong> franjas onduladas sobre los puentes.</li></ul>
                <p>En un esqueleto los acabados importan más que en ningún otro reloj, porque no hay esfera que los esconda.</p>
                <blockquote>Quitar metal es fácil. Quitarlo sin que el reloj pierda rigidez es el oficio.</blockquote>
                <p>Nuestra colección <a href={'colecciones.html#esqueleto'}>Esqueleto</a> deja ver el barrilete con el emblema de OKIDOKEI, el tren de rodaje y el volante latiendo cuatro veces por segundo (28.800 alternancias por hora). <a href={'producto.html#esqueleto-cobre'}>Míralo de cerca</a>.</p>
            </div>
            <div className={'article-foot'}><a className={'link-arrow'} href={'#articulos'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-up'} /></svg>Volver a los artículos</a><a className={'link-arrow'} href={'tienda.html'}>Ir a la tienda <svg className={'icon'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a></div>
        </article>
        <article className={'article'} id={'buceo'} aria-labelledby={'t-buceo'}>
            <header className={'article-head'}><p className={'eyebrow'}>Guía</p><h2 id={'t-buceo'}>Cómo elegir tu primer reloj de buceo</h2><p className={'article-meta'}>5 de noviembre de 2026 · 5 min de lectura</p></header>
            <div className={'article-img foto'}><img src={'assets/journal/buceo.jpg'} alt={'Perfil de un reloj de buceo con bisel giratorio y corona'} loading={'lazy'} data-foto /></div>
            <div className={'prose'}>
                <p>Un reloj de buceo es probablemente el reloj más versátil que puedes tener: aguanta el agua, se lee en cualquier luz y queda bien con traje. Estas son las claves para elegir el primero.</p>
                <h3>Hermeticidad: lo que significan los metros</h3>
                <p>La cifra de la esfera (100 m, 200 m, 300 m) es una presión de prueba en laboratorio, no la profundidad a la que puedes bajar. Para nadar basta con 10 ATM (100 m). La norma internacional de relojes de buceo, ISO 6425, exige como mínimo 100 metros.</p>
                <h3>El bisel solo gira en un sentido</h3>
                <p>Antes de sumergirte alineas el triángulo del bisel con el minutero. Como solo gira hacia la izquierda, si se mueve por un golpe marcará más tiempo de inmersión, nunca menos. Es una medida de seguridad.</p>
                <h3>Legibilidad y corona</h3>
                <ul><li>Agujas e índices con material luminiscente: la norma pide poder leer la hora a 25 cm en la oscuridad.</li><li>Corona roscada: enróscala siempre antes de entrar en el agua.</li><li>Después del mar, acláralo con agua dulce.</li></ul>
                <h3>¿Brazalete o caucho?</h3>
                <p>El brazalete de acero dura toda la vida y combina con todo; el caucho es más ligero y cómodo dentro del agua. La piel, para el agua, mejor no.</p>
                <p>Nuestro <a href={'colecciones.html#marine'}>Marine</a> cumple todo lo anterior con 300 metros de hermeticidad. Si buceas a menudo, revisa sus juntas cada año.</p>
            </div>
            <div className={'article-foot'}><a className={'link-arrow'} href={'#articulos'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-up'} /></svg>Volver a los artículos</a><a className={'link-arrow'} href={'tienda.html'}>Ir a la tienda <svg className={'icon'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a></div>
        </article>
        <article className={'article'} id={'fases-lunares'} aria-labelledby={'t-fases-lunares'}>
            <header className={'article-head'}><p className={'eyebrow'}>Colecciones</p><h2 id={'t-fases-lunares'}>Fases lunares, una complicación poética</h2><p className={'article-meta'}>28 de octubre de 2026 · 4 min de lectura</p></header>
            <div className={'article-img foto'}><img src={'assets/journal/fases-lunares.jpg'} alt={'Ventana de fases lunares sobre una esfera blanca'} loading={'lazy'} data-foto /></div>
            <div className={'prose'}>
                <p>De todas las complicaciones de un reloj, la fase lunar es la más poética: no sirve para llegar puntual, sirve para saber cómo está el cielo.</p>
                <h3>Cómo funciona</h3>
                <p>De una luna nueva a la siguiente pasan unos 29,53 días (el mes sinódico). El mecanismo clásico usa un disco con 59 dientes y dos lunas pintadas: avanza un diente cada día y completa media vuelta, una lunación, en 29,5 días.</p>
                <h3>¿Es exacto?</h3>
                <p>Casi. La diferencia entre 29,5 y 29,53 días hace que el disco se adelante un día aproximadamente cada dos años y siete meses. Los mecanismos de alta precisión, con ruedas de 135 dientes, reducen el error a un día cada 122 años.</p>
                <h3>Cómo ponerlo en hora</h3>
                <ol><li>Busca la fecha de la última luna llena.</li><li>Gira el disco con el corrector hasta que la luna quede centrada en la ventana.</li><li>Avanza un paso por cada día que haya pasado desde entonces.</li></ol>
                <p className={'note'}>Evita corregir la fase lunar o la fecha entre las 21:00 y las 3:00: a esas horas el mecanismo está engranando y puede dañarse.</p>
                <p>En nuestro <a href={'colecciones.html#luna'}>Luna</a> dos lunas de cobre recorren un cielo negro con estrellas. <a href={'producto.html#luna-acero'}>Míralo de cerca</a>.</p>
            </div>
            <div className={'article-foot'}><a className={'link-arrow'} href={'#articulos'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-up'} /></svg>Volver a los artículos</a><a className={'link-arrow'} href={'tienda.html'}>Ir a la tienda <svg className={'icon'} aria-hidden={'true'}><use href={'#i-right'} /></svg></a></div>
        </article>
    </div>

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
