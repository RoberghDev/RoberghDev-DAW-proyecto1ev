import React, { useEffect, useMemo, useRef, useState } from 'react';
import { COLECCIONES, PRODUCTOS, TEXTOS_CAJA, TEXTOS_CORREA, buscarColeccion, buscarProducto, fotoProducto, precioTexto, resumenProducto } from '../data.js';
import { useStore } from '../store.jsx';
import IconSprite from './IconSprite.jsx';
import { eventosFoto } from './foto.js';

// PARTES COMUNES DEL SITIO. Reproducen exactamente el HTML de las plantillas heredadas
// y el comportamiento que antes aportaba public/js/comun.js.

function Icon({ name }) { return <svg className="icon" aria-hidden="true"><use href={`#i-${name}`} /></svg>; }

// NORMALIZA TEXTO PARA COMPARAR BÚSQUEDAS SIN DIFERENCIAR ACENTOS NI MAYÚSCULAS.
function normalizarTexto(texto) { return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }

// FILTRA LOS PRODUCTOS QUE COINCIDEN CON EL TEXTO BUSCADO.
function buscarRelojes(texto) {
  const consulta = normalizarTexto(texto.trim());
  return PRODUCTOS.filter((producto) => {
    const coleccion = buscarColeccion(producto.coleccion);
    return !consulta || normalizarTexto([producto.nombre, coleccion.nombre, coleccion.categoria, TEXTOS_CAJA[producto.caja], TEXTOS_CORREA[producto.correa], producto.movimiento].join(' ')).indexOf(consulta) > -1;
  });
}

export function Header({ page }) {
  const store = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  // EL LEGADO NO PINTA RESULTADOS HASTA QUE SE ABRE EL BUSCADOR POR PRIMERA VEZ.
  const [searchPainted, setSearchPainted] = useState(false);
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef(null);
  const firstMenuLinkRef = useRef(null);
  const { setCartOpen } = store;

  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', scroll, { passive: true });
    scroll();
    return () => window.removeEventListener('scroll', scroll);
  }, []);
  useEffect(() => {
    // CIERRA LOS PANELES ABIERTOS AL PULSAR ESCAPE.
    const escape = (event) => { if (event.key === 'Escape') { setCartOpen(false); setMenuOpen(false); setSearchOpen(false); } };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [setCartOpen]);
  useEffect(() => { if (searchOpen) searchInputRef.current.focus(); }, [searchOpen]);
  useEffect(() => { if (menuOpen) firstMenuLinkRef.current.focus(); }, [menuOpen]);

  const results = useMemo(() => buscarRelojes(query), [query]);
  // LA FICHA DE PRODUCTO SE MARCA COMO PARTE DE LA TIENDA.
  const activa = page === 'producto' ? 'tienda' : page;
  const current = (name) => activa === name ? { 'aria-current': 'page' } : {};
  const cartCount = store.cartCount;
  const favCount = store.favorites.length;
  const user = store.user;

  return <>
    <IconSprite />
    <header className={`site-header${scrolled ? ' scrolled' : ''}`} id="siteHeader">
      <div className="hdr">
        <button className="icon-btn menu-btn" id="menuBtn" type="button" aria-label="Abrir menú" aria-expanded={String(menuOpen)} aria-controls="mnav" onClick={() => setMenuOpen(true)}><Icon name="menu" /></button>
        <nav className="hdr-nav" aria-label="Principal">
          <a href="tienda.html" {...current('tienda')}>Tienda</a>
          <div className="has-drop">
            <a className="drop-trigger" href="colecciones.html" {...current('colecciones')}>Colecciones</a>
            <div className="drop">
              {COLECCIONES.map((collection) => <a key={collection.id} href={`colecciones.html#${collection.id}`}>{`${collection.nombre} `}<span>{collection.lema.toLowerCase()}</span></a>)}
              <a className="drop-all" href="colecciones.html">Ver todas las colecciones</a>
            </div>
          </div>
          <a href="nosotros.html" {...current('nosotros')}>Nosotros</a>
          <a href="journal.html" {...current('journal')}>Journal</a>
        </nav>
        <a className="brand" href="index.html" aria-label="OKIDOKEI, ir al inicio">
          <svg className="brand-mark" aria-hidden="true"><use href="#emblem" /></svg>
          <span className="brand-word cu-text">OKIDOKEI</span>
        </a>
        <div className="hdr-actions">
          <button className="icon-btn" id="searchBtn" type="button" aria-label="Buscar" aria-expanded={String(searchOpen)} aria-controls="searchPanel" onClick={() => { if (searchOpen) { setSearchOpen(false); } else { setSearchPainted(true); setSearchOpen(true); } }}><Icon name="search" /></button>
          <a className={`icon-btn act-user${user ? ' is-logged' : ''}`} id="userBtn" href="cuenta.html" aria-label={user ? `Mi cuenta (${user.nombre})` : 'Mi cuenta'} {...current('cuenta')}><Icon name="user" /></a>
          <a className="icon-btn act-fav" id="favBtn" href="favoritos.html" aria-label={`Favoritos, ${favCount}${favCount === 1 ? ' reloj' : ' relojes'}`} {...current('favoritos')}><Icon name="heart" /><span className="badge" data-count="favoritos" hidden={favCount === 0}>{favCount}</span></a>
          <a className="icon-btn" id="cartBtn" href="carrito.html" aria-label={`Carrito, ${cartCount}${cartCount === 1 ? ' artículo' : ' artículos'}`} {...current('carrito')}><Icon name="bag" /><span className="badge" data-count="carrito" hidden={cartCount === 0}>{cartCount}</span></a>
        </div>
      </div>
      <div className="search-panel" id="searchPanel" hidden={!searchOpen}>
        <div className="search-inner">
          <label className="search-field" htmlFor="searchInput">
            <Icon name="search" />
            <input ref={searchInputRef} id="searchInput" type="search" placeholder="Busca un reloj, una colección…" autoComplete="off" onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && searchPainted && results[0]) window.location.href = `producto.html#${results[0].id}`; }} />
          </label>
          <div className="search-results" id="searchResults" aria-live="polite">
            {searchPainted && (results.length
              ? <>{results.slice(0, 8).map((product) => <a key={product.id} href={`producto.html#${product.id}`}><span>{`${product.nombre} `}<span className="price">{`· ${resumenProducto(product)}`}</span></span><span className="price">{precioTexto(product.precio)}</span></a>)}<a className="search-all" href="tienda.html">Ver todos los relojes en la tienda</a></>
              : <p className="search-empty">No hay relojes que coincidan. Prueba con «cobre», «acero» o «luna».</p>)}
          </div>
        </div>
      </div>
    </header>
    <div className={`mnav${menuOpen ? ' open' : ''}`} id="mnav" aria-hidden={String(!menuOpen)}>
      <div className="mnav-scrim" data-close-menu="" onClick={() => setMenuOpen(false)} />
      <nav className="mnav-panel" aria-label="Menú móvil">
        <div className="mnav-top">
          <span className="brand-word mnav-word cu-text">OKIDOKEI</span>
          <button className="icon-btn" type="button" data-close-menu="" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)}><Icon name="close" /></button>
        </div>
        <a ref={firstMenuLinkRef} href="index.html" {...current('index')}>Inicio</a>
        <a href="tienda.html" {...current('tienda')}>Tienda</a>
        <a href="colecciones.html" {...current('colecciones')}>Colecciones</a>
        <div className="mnav-sub">
          {COLECCIONES.map((collection) => <a key={collection.id} href={`colecciones.html#${collection.id}`}>{collection.nombre}</a>)}
        </div>
        <a href="nosotros.html" {...current('nosotros')}>Nosotros</a>
        <a href="journal.html" {...current('journal')}>Journal</a>
        <a href="favoritos.html" {...current('favoritos')}>Favoritos</a>
        <a href="carrito.html" {...current('carrito')}>Carrito</a>
        <a href="cuenta.html" {...current('cuenta')}>Mi cuenta</a>
        <a href="ayuda.html" {...current('ayuda')}>Ayuda</a>
      </nav>
    </div>
  </>;
}

export function Footer() {
  return <footer className="footer">
    <div className="wrap foot-grid">
      <div className="foot-brand">
        <a className="brand" href="index.html" aria-label="OKIDOKEI, ir al inicio"><svg className="brand-mark" aria-hidden="true"><use href="#emblem" /></svg><span className="brand-word cu-text">OKIDOKEI</span></a>
        <p>Tu relojería online de confianza. Relojes seleccionados uno a uno, revisados en taller y enviados a tu puerta.</p>
        <div className="social">
          <a href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Instagram"><Icon name="ig" /></a>
          <a href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="Facebook"><Icon name="fb" /></a>
          <a href="https://www.youtube.com/" target="_blank" rel="noopener" aria-label="YouTube"><Icon name="yt" /></a>
          <a href="https://www.pinterest.com/" target="_blank" rel="noopener" aria-label="Pinterest"><Icon name="pinterest" /></a>
        </div>
      </div>
      <div className="foot-col"><h4>Tienda</h4><ul><li><a href="tienda.html">Todos los relojes</a></li><li><a href="tienda.html#novedades">Novedades</a></li><li><a href="tienda.html#limitadas">Ediciones limitadas</a></li><li><a href="favoritos.html">Mis favoritos</a></li><li><a href="carrito.html">Mi carrito</a></li></ul></div>
      <div className="foot-col"><h4>Colecciones</h4><ul><li><a href="colecciones.html#heritage">Vestir</a></li><li><a href="colecciones.html#marine">Deportivos</a></li><li><a href="colecciones.html#esqueleto">Esqueleto</a></li><li><a href="colecciones.html#luna">Fases lunares</a></li><li><a href="colecciones.html#noir">Noir</a></li><li><a href="colecciones.html#origine">Ediciones limitadas</a></li></ul></div>
      <div className="foot-col"><h4>Ayuda</h4><ul><li><a href="ayuda.html#contacto">Contacto</a></li><li><a href="ayuda.html#envios">Envíos y entregas</a></li><li><a href="ayuda.html#devoluciones">Devoluciones</a></li><li><a href="ayuda.html#garantia">Garantía</a></li><li><a href="ayuda.html#faq">Preguntas frecuentes</a></li></ul></div>
      <div className="foot-col"><h4>Nosotros</h4><ul><li><a href="nosotros.html">Nuestra historia</a></li><li><a href="nosotros.html#taller">El taller</a></li><li><a href="nosotros.html#servicios">Servicios</a></li><li><a href="journal.html">Journal</a></li><li><a href="nosotros.html#empleo">Trabaja con nosotros</a></li></ul></div>
      <div className="foot-col"><h4>Compra segura</h4><ul><li><a href="cuenta.html">Mi cuenta</a></li><li><span>Envíos a toda España y la UE</span></li><li><span>Atención de lunes a viernes</span></li></ul><div className="pay" aria-label="Métodos de pago"><span>Tarjeta</span><span>PayPal</span><span>Bizum</span><span>Transferencia</span></div></div>
    </div>
    <div className="wrap foot-bottom">
      <span>© <span data-year="">{new Date().getFullYear()}</span> OKIDOKEI. Todos los derechos reservados.</span>
      <nav aria-label="Legal"><a href="legal.html#aviso">Aviso legal</a><a href="legal.html#privacidad">Privacidad</a><a href="legal.html#cookies">Cookies</a></nav>
      <span>España · EUR €</span>
    </div>
  </footer>;
}

// LÍNEA DEL MINICARRITO (MISMO HTML QUE GENERABA comun.js).
function DrawerLine({ line }) {
  const store = useStore(); const product = buscarProducto(line.id);
  return <div className="cart-item" data-id={line.id}>
    <a href={`producto.html#${product.id}`} className="cart-thumb foto"><img src={fotoProducto(product)} alt="" data-foto="" {...eventosFoto} /></a>
    <div><h3><a href={`producto.html#${product.id}`}>{product.nombre}</a></h3><p className="unit">{precioTexto(product.precio)}</p>
      <div className="qty"><button type="button" data-q="-1" aria-label={`Quitar una unidad de ${product.nombre}`} onClick={() => store.setQty(product.id, line.qty - 1)}><svg className="icon"><use href="#i-minus" /></svg></button><span>{line.qty}</span>
        <button type="button" data-q="1" aria-label={`Añadir una unidad de ${product.nombre}`} onClick={() => store.setQty(product.id, line.qty + 1)}><svg className="icon"><use href="#i-plus" /></svg></button></div></div>
    <div className="cart-line"><p className="line">{precioTexto(product.precio * line.qty)}</p><button type="button" className="rm" data-rm="" onClick={() => store.remove(product.id)}>Eliminar</button></div>
  </div>;
}

export function CartDrawer() {
  const store = useStore();
  const { cartOpen, setCartOpen } = store;
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);
  useEffect(() => {
    if (cartOpen) {
      // GUARDA EL ELEMENTO AL QUE DEVOLVER EL FOCO Y ENFOCA EL BOTÓN DE CIERRE.
      previousFocusRef.current = document.activeElement;
      closeButtonRef.current.focus();
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [cartOpen]);
  const close = () => setCartOpen(false);
  return <div className={`drawer${cartOpen ? ' open' : ''}`} id="cart" aria-hidden={String(!cartOpen)}>
    <div className="drawer-scrim" data-close-cart="" onClick={close} />
    <aside className="drawer-panel" role="dialog" aria-modal="true" aria-labelledby="cartTitle">
      <div className="drawer-head"><h2 id="cartTitle">Tu carrito</h2><button ref={closeButtonRef} className="icon-btn" type="button" data-close-cart="" aria-label="Cerrar carrito" onClick={close}><Icon name="close" /></button></div>
      <div className="cart-list" id="cartList">{store.cart.length ? store.cart.map((line) => <DrawerLine key={line.id} line={line} />) : <p className="cart-empty">Tu carrito está vacío.</p>}</div>
      <div className="drawer-foot">
        <div className="subtotal"><span>Subtotal</span><strong id="cartTotal">{precioTexto(store.total)}</strong></div>
        <small>Envío asegurado gratuito. Impuestos incluidos.</small>
        <a className="btn btn-ghost" href="carrito.html">Ver carrito</a>
        <a className="btn btn-copper" href="carrito.html#resumen">Finalizar compra</a>
      </div>
    </aside>
  </div>;
}
