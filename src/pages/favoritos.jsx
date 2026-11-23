import React from 'react';
import { buscarProducto } from '../data.js';
import { TarjetaSimple } from '../components/Commerce.jsx';
import { useStore } from '../store.jsx';

// Migrada desde la plantilla heredada favoritos.html y public/js/favoritos.js (fase 3).
export const title = 'OKIDOKEI · Favoritos';
export const description = 'Tus relojes favoritos de OKIDOKEI.';

export default function Favoritos() {
    const store = useStore();
    const productos = store.favorites.map(buscarProducto);

    // AÑADE TODOS LOS FAVORITOS AL CARRITO Y ABRE EL MINICARRITO.
    function anadirTodos() {
        const identificadores = store.favorites;
        identificadores.forEach((identificador) => store.add(identificador, 1));
        store.setToast(identificadores.length + (identificadores.length === 1 ? ' reloj añadido' : ' relojes añadidos') + ' al carrito');
        store.setCartOpen(true);
    }

    return (
<main>
    <section className="page-hero">
        <div className="wrap">
            <nav className="crumbs" aria-label="Estás aquí"><a href="/">Inicio</a><span aria-hidden="true">/</span><span aria-current="page">Favoritos</span></nav>
            <p className="eyebrow">Tu selección</p>
            <h1 className="page-title">Favoritos</h1>
            <p className="page-sub">Los relojes que has guardado con el corazón. Se quedan en este navegador para cuando vuelvas.</p>
        </div>
        <svg className="page-mark" aria-hidden="true"><use href="#emblem" /></svg>
    </section>

    <section className="section-dark section" aria-label="Relojes guardados">
        <div className="wrap">
            <div className="list-head" id="favActions" hidden={productos.length === 0}><p id="favCountText">{productos.length + (productos.length === 1 ? ' reloj guardado' : ' relojes guardados')}</p><button className="btn btn-outline" type="button" id="favAllToCart" onClick={anadirTodos}><svg className="icon" aria-hidden="true"><use href="#i-bag" /></svg>Añadir todos al carrito</button></div>
            <div className="grid-4" id="favGrid">{productos.map((producto) => <TarjetaSimple key={producto.id} product={producto} />)}</div>
            <div className="empty" id="favEmpty" hidden={productos.length > 0}>
                <svg className="mark" aria-hidden="true"><use href="#emblem" /></svg>
                <h2>Aún no tienes favoritos</h2>
                <p>Pulsa el corazón de cualquier reloj para guardarlo aquí y compararlo con calma.</p>
                <a className="btn btn-outline" href="/tienda">Ir a la tienda</a>
            </div>
        </div>
    </section>
</main>
    );
}
