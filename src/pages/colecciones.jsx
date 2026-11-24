import React from 'react';
import { COLECCIONES, buscarProducto, fotoProducto, precioTexto } from '../data.js';
import { productosDe } from '../catalogo.js';
import { useStore } from '../store.jsx';
import { eventosFoto } from '../components/foto.js';

const dosCifras = (numero) => String(numero).padStart(2, '0');

// FICHA DE UNA COLECCIÓN, GENERADA DESDE EL CATÁLOGO ÚNICO (src/data.js).
// Los datos técnicos y la foto son los de su reloj principal (src/data.js, contenido editorial);
// los modelos y el precio "desde" salen de los productos de la API de esa colección.
function SeccionColeccion({ coleccion, numero }) {
  const principal = buscarProducto(coleccion.principal);
  const modelos = productosDe(coleccion.id);
  const desde = modelos.length ? Math.min(...modelos.map((producto) => producto.precio)) : null;
  return <section className="coll" id={coleccion.id} aria-labelledby={`t-${coleccion.id}`}>
    <a className="coll-media foto" href={`/producto/${principal.id}`} aria-label={`Ver ${principal.nombre}`}><img src={fotoProducto(principal)} alt={`Reloj ${principal.nombre}`} loading="lazy" data-foto="" {...eventosFoto} /></a>
    <div className="coll-text">
      <p className="coll-num">{`${dosCifras(numero)} / ${dosCifras(COLECCIONES.length)} · `}<span className="eyebrow">{coleccion.categoria}</span></p>
      <h2 id={`t-${coleccion.id}`}>{coleccion.titulo}</h2>
      <p className="coll-lema">{coleccion.lema}</p>
      <p>{coleccion.descripcion}</p>
      <ul className="coll-facts"><li>{`${principal.mm} mm`}</li><li>{principal.movimiento}</li><li>{principal.agua}</li>{desde !== null && <li>{`Desde ${precioTexto(desde)}`}</li>}</ul>
      {modelos.length > 0 && <p className="coll-models">Modelos: {modelos.map((producto, indice) => <React.Fragment key={producto.id}>{indice > 0 && ' '}<a href={`/producto/${producto.id}`}>{producto.nombre}</a></React.Fragment>)}</p>}
      <div className="row"><a className="btn btn-outline" href={`/tienda#${coleccion.id}`}>Ver la colección</a><a className="link-arrow" href={`/producto/${principal.id}`}>Ver el reloj <svg className="icon" aria-hidden="true"><use href="#i-right" /></svg></a></div>
    </div>
  </section>;
}
// Migrated from the original colecciones.html page markup.
export const title = 'OKIDOKEI · Colecciones';
export const description = 'Las seis colecciones de OKIDOKEI: Esqueleto, Heritage, Marine, Noir, Luna y Origine.';
export default function Colecciones() {
  useStore(); // SE VUELVE A PINTAR CUANDO LLEGA EL CATÁLOGO DE LA API.
  return (
<main>

    <section className={'page-hero'}>
        <div className={'wrap'}>
            <nav className={'crumbs'} aria-label={'Estás aquí'}><a href={'/'}>Inicio</a><span aria-hidden={'true'}>/</span><span aria-current={'page'}>Colecciones</span></nav>
            <p className={'eyebrow'}>Seis maneras de llevar el tiempo</p>
            <h1 className={'page-title'}>Colecciones</h1>
            <p className={'page-sub'}>Del vestir clásico al buceo, del esqueleto a la fase lunar. Elige la que va contigo.</p>
        </div>
        <svg className={'page-mark'} aria-hidden={'true'}><use href={'#emblem'} /></svg>
    </section>

    <nav className="subnav" aria-label="Colecciones"><div className="wrap">{COLECCIONES.map((coleccion) => <a key={coleccion.id} href={`#${coleccion.id}`}>{coleccion.nombre}</a>)}</div></nav>
    <div className="wrap">
        {COLECCIONES.map((coleccion, indice) => <SeccionColeccion key={coleccion.id} coleccion={coleccion} numero={indice + 1} />)}
    </div>

    <section className={'trust'} aria-label={'Ventajas de comprar en OKIDOKEI'}>
        <div className={'wrap trust-row'}>
            <a className={'trust-item'} href={'/ayuda#envios'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-truck'} /></svg><div><strong>Envío asegurado</strong><span>Gratis en toda España</span></div></a>
            <a className={'trust-item'} href={'/ayuda#devoluciones'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-return'} /></svg><div><strong>30 días</strong><span>Devolución sencilla</span></div></a>
            <a className={'trust-item'} href={'/ayuda#garantia'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-shield'} /></svg><div><strong>Garantía 3 años</strong><span>En todos los relojes</span></div></a>
            <a className={'trust-item'} href={'/ayuda#faq'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-cert'} /></svg><div><strong>Autenticidad</strong><span>Certificado en cada pieza</span></div></a>
            <a className={'trust-item'} href={'/ayuda#faq'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-lock'} /></svg><div><strong>Pago seguro</strong><span>Conexión cifrada SSL</span></div></a>
        </div>
    </section>

</main>
  );
}
