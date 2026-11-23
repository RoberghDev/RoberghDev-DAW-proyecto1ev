import React, { useEffect, useRef, useState } from 'react';
import { COLECCIONES, PRODUCTOS, buscarColeccion } from '../data.js';
import { ProductCard } from '../components/Commerce.jsx';

// Migrada desde la plantilla heredada tienda.html y public/js/tienda.js (fase 3).
export const title = 'OKIDOKEI · Tienda';
export const description = 'Todos los relojes OKIDOKEI: filtra por colección, caja y correa.';

const FILTROS_INICIALES = { coleccion: 'todas', caja: 'todas', correa: 'todas', novedades: false, orden: 'destacados' };
const CHIPS = [{ id: 'todas', nombre: 'Todas' }, ...COLECCIONES];

// RESTAURA COLECCIÓN Y NOVEDADES DESDE EL FRAGMENTO DE LA URL (EL RESTO DE FILTROS SE CONSERVA).
function filtrosDesdeDireccion(filtros) {
    const fragmento = window.location.hash.slice(1);
    let coleccion = 'todas';
    let novedades = false;
    if (fragmento === 'novedades') novedades = true;
    else if (fragmento === 'limitadas') coleccion = 'origine';
    else if (buscarColeccion(fragmento)) coleccion = fragmento;
    return { ...filtros, coleccion, novedades };
}

function coincide(producto, filtros) {
    return (filtros.coleccion === 'todas' || producto.coleccion === filtros.coleccion) &&
        (filtros.caja === 'todas' || producto.caja === filtros.caja) &&
        (filtros.correa === 'todas' || producto.correa === filtros.correa) &&
        (!filtros.novedades || Boolean(producto.nuevo));
}

// ORDENA TODO EL CATÁLOGO (TAMBIÉN LAS TARJETAS OCULTAS), PARTIENDO SIEMPRE DEL ORDEN ORIGINAL.
function ordenar(orden) {
    return PRODUCTOS.slice().sort((a, b) => {
        if (orden === 'precio-asc') return a.precio - b.precio;
        if (orden === 'precio-desc') return b.precio - a.precio;
        if (orden === 'nombre') return a.nombre.localeCompare(b.nombre, 'es');
        return PRODUCTOS.indexOf(a) - PRODUCTOS.indexOf(b);
    });
}

export default function Tienda() {
    const [filtros, setFiltros] = useState(() => filtrosDesdeDireccion(FILTROS_INICIALES));
    const novedadesRef = useRef(null);

    // LA CASILLA SE SINCRONIZA POR PROPIEDAD (COMO tienda.js), SIN ESCRIBIR EL ATRIBUTO checked.
    useEffect(() => { novedadesRef.current.checked = filtros.novedades; }, [filtros.novedades]);

    useEffect(() => {
        // ACTUALIZA LOS FILTROS SI CAMBIA EL FRAGMENTO DE LA URL.
        const leerDireccion = () => setFiltros(filtrosDesdeDireccion);
        window.addEventListener('hashchange', leerDireccion);
        return () => window.removeEventListener('hashchange', leerDireccion);
    }, []);

    // APLICA UN CAMBIO DEL USUARIO Y REFLEJA COLECCIÓN O NOVEDADES EN LA URL.
    function cambiar(nuevos) {
        setFiltros(nuevos);
        const fragmento = nuevos.coleccion !== 'todas' ? '#' + nuevos.coleccion : nuevos.novedades ? '#novedades' : '';
        window.history.replaceState(null, '', window.location.pathname + fragmento);
    }
    const limpiar = () => cambiar(FILTROS_INICIALES);

    const ordenados = ordenar(filtros.orden);
    const visibles = PRODUCTOS.filter((producto) => coincide(producto, filtros)).length;
    const coleccion = buscarColeccion(filtros.coleccion);
    const titulo = coleccion ? 'Colección ' + coleccion.nombre : filtros.novedades ? 'Novedades' : 'Todos los relojes';

    return (
        <main>

            <section className={'page-hero'}>
                <div className={'wrap'}>
                    <nav className={'crumbs'} aria-label={'Estás aquí'}><a href={'index.html'}>Inicio</a><span aria-hidden={'true'}>/</span><span aria-current={'page'}>Tienda</span></nav>
                    <p className={'eyebrow'}>Relojería online</p>
                    <h1 className={'page-title'}>Tienda</h1>
                    <p className={'page-sub'}>12 relojes en 6 colecciones, con envío asegurado, 30 días de devolución y 3 años de garantía.</p>
                </div>
                <svg className={'page-mark'} aria-hidden={'true'}><use href={'#emblem'} /></svg>
            </section>

            <section className="section-dark shop-section">
                <div className="wrap">
                    <div className="shop-bar">
                        <div className="shop-chips" role="group" aria-label="Filtrar por colección">{CHIPS.map((chip) => <button key={chip.id} className="chip" type="button" data-filtro-coleccion={chip.id} aria-pressed={String(filtros.coleccion === chip.id)} onClick={() => cambiar({ ...filtros, coleccion: chip.id })}>{chip.nombre}</button>)}</div>
                        <div className="shop-filters">
                            <div className="field"><label htmlFor="fCaja">Caja</label><select className="select" id="fCaja" value={filtros.caja} onChange={(event) => cambiar({ ...filtros, caja: event.target.value })}><option value="todas">Todas</option><option value="cobre">Cobre</option><option value="acero">Acero</option><option value="negro">Acero negro</option></select></div>
                            <div className="field"><label htmlFor="fCorrea">Correa</label><select className="select" id="fCorrea" value={filtros.correa} onChange={(event) => cambiar({ ...filtros, correa: event.target.value })}><option value="todas">Todas</option><option value="piel">Piel</option><option value="acero">Brazalete de acero</option><option value="caucho">Caucho</option></select></div>
                            <div className="field"><label htmlFor="fOrden">Ordenar</label><select className="select" id="fOrden" value={filtros.orden} onChange={(event) => cambiar({ ...filtros, orden: event.target.value })}><option value="destacados">Destacados</option><option value="precio-asc">Precio: menor a mayor</option><option value="precio-desc">Precio: mayor a menor</option><option value="nombre">Nombre (A–Z)</option></select></div>
                            <label className="check" htmlFor="fNuevos"><input ref={novedadesRef} type="checkbox" id="fNuevos" onChange={(event) => cambiar({ ...filtros, novedades: event.target.checked })} /> Solo novedades</label>
                        </div>
                    </div>
                    <div className="shop-head"><h2 id="shopTitle">{titulo}</h2><p><span className="shop-count" id="shopCount">{visibles + (visibles === 1 ? ' reloj' : ' relojes')}</span> · <button className="shop-clear" type="button" data-limpiar="" onClick={limpiar}>Quitar filtros</button></p></div>
                    <div className="grid-4" id="shopGrid">
                        {ordenados.map((producto) => <ProductCard key={producto.id} product={producto} hidden={!coincide(producto, filtros)} />)}
                    </div>
                    <div className="empty" id="shopEmpty" hidden={visibles > 0}>
                        <svg className="mark" aria-hidden="true"><use href="#emblem" /></svg>
                        <h2>Ningún reloj con esos filtros</h2>
                        <p>Prueba con otra caja u otra correa, o mira toda la colección.</p>
                        <button className="btn btn-outline" type="button" data-limpiar="" onClick={limpiar}>Ver todos los relojes</button>
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
