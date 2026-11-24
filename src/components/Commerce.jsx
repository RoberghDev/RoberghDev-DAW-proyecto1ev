import React from 'react';
import { TEXTOS_CAJA, buscarColeccion, fotoProducto, precioTexto, resumenProducto } from '../data.js';
import { useStore } from '../store.jsx';
import { eventosFoto } from './foto.js';
import { productosCatalogo } from '../catalogo.js';

function Icon({ name }) { return <svg className="icon" aria-hidden="true"><use href={`#i-${name}`} /></svg>; }
// ACCIONES DE UNA TARJETA (MISMO COMPORTAMIENTO QUE LA DELEGACIÓN DE CLICS DE comun.js).
export function useAccionesProducto(product) {
  const store = useStore();
  const fav = store.favorites.includes(product.id);
  return {
    fav,
    favLabel: `${fav ? 'Quitar' : 'Añadir'} ${product.nombre} ${fav ? 'de' : 'a'} favoritos`,
    toggleFav(event) {
      event.preventDefault();
      const added = store.toggleFavorite(product.id);
      store.setToast(`${product.nombre} ${added ? 'guardado en' : 'quitado de'} favoritos`);
    },
    add() {
      store.add(product.id);
      store.setToast(`${product.nombre} añadido al carrito`);
      store.setCartOpen(true);
    }
  };
}

// TARJETA DE PRODUCTO. Mismo HTML que las cards de las plantillas (tienda y portada).
// destacada: VARIANTE DE LA PORTADA, SIN LOS data-* DE FILTRADO DE LA TIENDA.
export function ProductCard({ product, order, hidden = false, destacada = false }) {
  const collection = buscarColeccion(product.coleccion);
  const { fav, favLabel, toggleFav, add } = useAccionesProducto(product);
  const filtro = destacada ? {} : { 'data-coleccion': product.coleccion, 'data-caja': product.caja, 'data-correa': product.correa, 'data-precio': product.precio, 'data-nombre': product.nombre, 'data-orden': order ?? productosCatalogo().indexOf(product), 'data-nuevo': product.nuevo ? 'si' : 'no' };
  return (
    <article className="card" data-id={product.id} {...filtro} hidden={hidden}>
      <div className="card-media">
        <a className="card-img foto" href={`/producto/${product.id}`} tabIndex="-1" aria-hidden="true">
          <img
            src={fotoProducto(product)}
            alt={`${product.nombre}: caja de ${TEXTOS_CAJA[product.caja].toLowerCase()} y ${product.correaTexto.toLowerCase()}`}
            loading="lazy"
            data-foto=""
            {...eventosFoto}
          />
        </a>

        {(product.limitado || product.nuevo) &&
          <span className="tag">{product.limitado ? 'Edición limitada' : 'Nuevo'}</span>
        }

        <button className="fav" type="button" data-fav={product.id} aria-pressed={String(fav)} aria-label={favLabel} onClick={toggleFav}>
          <Icon name="heart" />
        </button>
      </div>

      <div className="card-body">
        <p className="card-coll">{collection.nombre}</p>
        <h3 className="card-name">
          <a href={`/producto/${product.id}`}>{product.nombre}</a>
        </h3>
        <p className="card-spec">{resumenProducto(product)}</p>
        <div className="card-foot">
          <span className="card-price">{precioTexto(product.precio)}</span>
          <button className="add-btn" type="button" data-add={product.id} onClick={add}>
            <Icon name="bag" />
            Añadir
          </button>
        </div>
      </div>
    </article>
  );
}

// TARJETA QUE GENERABA OKI.tarjetaHTML (RELACIONADOS DE LA FICHA Y FAVORITOS): SIN LOS data-*
// DE FILTRADO, CON alt VACÍO Y EL CORAZÓN SIN aria-hidden.
export function TarjetaSimple({ product }) {
  const collection = buscarColeccion(product.coleccion);
  const { fav, favLabel, toggleFav, add } = useAccionesProducto(product);
  return <article className="card" data-id={product.id}><div className="card-media"><a className="card-img foto" href={`/producto/${product.id}`} tabIndex="-1" aria-hidden="true"><img src={fotoProducto(product)} alt="" loading="lazy" data-foto="" {...eventosFoto} /></a>{product.limitado ? <span className="tag">Edición limitada</span> : product.nuevo ? <span className="tag">Nuevo</span> : null}<button className="fav" type="button" data-fav={product.id} aria-pressed={String(fav)} aria-label={favLabel} onClick={toggleFav}><svg className="icon"><use href="#i-heart" /></svg></button></div><div className="card-body"><p className="card-coll">{collection.nombre}</p><h3 className="card-name"><a href={`/producto/${product.id}`}>{product.nombre}</a></h3><p className="card-spec">{resumenProducto(product)}</p><div className="card-foot"><span className="card-price">{precioTexto(product.precio)}</span><button className="add-btn" type="button" data-add={product.id} onClick={add}><svg className="icon" aria-hidden="true"><use href="#i-bag" /></svg>Añadir</button></div></div></article>;
}
