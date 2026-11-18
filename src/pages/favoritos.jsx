import React from 'react';
// Migrated from the original favoritos.html page markup.
export const title = 'OKIDOKEI · Favoritos';
export const description = 'Tus relojes favoritos de OKIDOKEI.';
export default function Favoritos() {
  return (
<main>

    <section className={'page-hero'}>
        <div className={'wrap'}>
            <nav className={'crumbs'} aria-label={'Estás aquí'}><a href={'index.html'}>Inicio</a><span aria-hidden={'true'}>/</span><span aria-current={'page'}>Favoritos</span></nav>
            <p className={'eyebrow'}>Tu selección</p>
            <h1 className={'page-title'}>Favoritos</h1>
            <p className={'page-sub'}>Los relojes que has guardado con el corazón. Se quedan en este navegador para cuando vuelvas.</p>
        </div>
        <svg className={'page-mark'} aria-hidden={'true'}><use href={'#emblem'} /></svg>
    </section>

    <section className={'section-dark section'} aria-label={'Relojes guardados'}>
        <div className={'wrap'}>
            <div className={'list-head'} id={'favActions'} hidden><p id={'favCountText'}>0 relojes guardados</p><button className={'btn btn-outline'} type={'button'} id={'favAllToCart'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-bag'} /></svg>Añadir todos al carrito</button></div>
            <div className={'grid-4'} id={'favGrid'}></div>
            <div className={'empty'} id={'favEmpty'}>
                <svg className={'mark'} aria-hidden={'true'}><use href={'#emblem'} /></svg>
                <h2>Aún no tienes favoritos</h2>
                <p>Pulsa el corazón de cualquier reloj para guardarlo aquí y compararlo con calma.</p>
                <a className={'btn btn-outline'} href={'tienda.html'}>Ir a la tienda</a>
            </div>
        </div>
    </section>

</main>
  );
}
