import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { PRODUCTOS, TEXTOS_CAJA, buscarColeccion, buscarProducto, fotoProducto, precioTexto, productosDe } from '../data.js';
import { TarjetaSimple, useAccionesProducto } from '../components/Commerce.jsx';
import { eventosFoto } from '../components/foto.js';
import { useStore } from '../store.jsx';

// Migrada desde la plantilla heredada producto.html y public/js/producto.js (fase 3).
export const title = 'OKIDOKEI · Reloj';
export const description = 'Ficha del reloj: fotos, precio, versiones y especificaciones.';

// PRODUCTO INDICADO EN LA RUTA (/producto/:id); SI NO EXISTE O FALTA, EL PRIMERO DEL CATÁLOGO
// (ANTES SE LEÍA DEL #id DE producto.html, CON EL MISMO CRITERIO).
function idDeLaRuta(parametro) {
    return parametro && buscarProducto(parametro) ? parametro : PRODUCTOS[0].id;
}

// LIMITA LA CANTIDAD ENTRE 1 Y 9 (TEXTO NO NUMÉRICO O VACÍO CUENTA COMO 1).
const limitarCantidad = (valor) => Math.max(1, Math.min(9, valor));

// IMAGEN PRINCIPAL Y MINIATURAS. Las miniaturas cuya imagen falla se eliminan; el bloque solo se
// muestra si, tras cargar o fallar alguna, quedan al menos dos.
function Galeria({ producto }) {
    const [foto, setFoto] = useState(1);
    const [fallidas, setFallidas] = useState([]);
    const [evaluada, setEvaluada] = useState(false);
    const etiqueta = producto.limitado ? 'Edición limitada' : producto.nuevo ? 'Nuevo' : '';
    const miniaturas = [1, 2, 3].filter((numero) => !fallidas.includes(numero));
    return <div className="pdp-gallery">
        <div className="pdp-main foto"><img id="pFoto" src={fotoProducto(producto, foto)} alt={`${producto.nombre}: caja de ${TEXTOS_CAJA[producto.caja].toLowerCase()} y ${producto.correaTexto.toLowerCase()}`} data-foto="" {...eventosFoto} /><span className="tag" id="pTag" hidden={!etiqueta}>{etiqueta}</span></div>
        <div className="pdp-thumbs" id="pThumbs" hidden={!evaluada || miniaturas.length < 2}>
            {miniaturas.map((numero) => <button key={numero} type="button" data-n={numero} aria-pressed={String(numero === foto)} aria-label={`Ver foto ${numero} de ${producto.nombre}`} onClick={() => setFoto(numero)}><img src={fotoProducto(producto, numero)} alt="" onError={() => { setFallidas((anteriores) => [...anteriores, numero]); setEvaluada(true); }} onLoad={() => setEvaluada(true)} /></button>)}
        </div>
    </div>;
}

function FilaEspecificacion({ nombre, valor }) {
    return <tr><th scope="row">{nombre}</th><td>{valor}</td></tr>;
}

export default function Producto() {
    const store = useStore();
    const { id: parametro } = useParams();
    const id = idDeLaRuta(parametro);
    const primeraVez = useRef(true);
    const cantidadRef = useRef(null);
    const producto = buscarProducto(id);
    const coleccion = buscarColeccion(producto.coleccion);
    const { fav, favLabel, toggleFav } = useAccionesProducto(producto);

    useEffect(() => { document.title = 'OKIDOKEI · ' + producto.nombre; }, [producto]);
    useEffect(() => {
        // AL CAMBIAR DE PRODUCTO (OTRA RUTA /producto/…): CANTIDAD A 1 Y VUELTA SUAVE AL INICIO,
        // COMO HACÍA producto.js CON CADA hashchange.
        if (primeraVez.current) { primeraVez.current = false; return; }
        cantidadRef.current.value = 1;
        const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reducirMovimiento ? 'auto' : 'smooth' });
    }, [parametro]);

    // LA CANTIDAD SE LEE Y ESCRIBE POR PROPIEDAD (COMO producto.js); EL ATRIBUTO value SIGUE EN 1.
    const leerCantidad = () => parseInt(cantidadRef.current.value, 10) || 1;
    const pasoCantidad = (paso) => { cantidadRef.current.value = limitarCantidad(leerCantidad() + paso); };
    function anadirAlCarrito() {
        const cantidad = limitarCantidad(leerCantidad());
        store.add(producto.id, cantidad);
        store.setToast(`${cantidad} × ${producto.nombre} añadido al carrito`);
        store.setCartOpen(true);
    }

    const relacionados = PRODUCTOS.filter((otro) => otro.id !== producto.id && otro.coleccion === producto.coleccion)
        .concat(PRODUCTOS.filter((otro) => otro.coleccion !== producto.coleccion && buscarColeccion(otro.coleccion).principal === otro.id))
        .slice(0, 4);

    return (
<main>
    <div className="crumb-bar"><div className="wrap"><nav className="crumbs" aria-label="Estás aquí"><a href="/">Inicio</a><span aria-hidden="true">/</span><a href="/tienda">Tienda</a><span aria-hidden="true">/</span><a id="crumbColeccion" href={`/colecciones#${coleccion.id}`}>{coleccion.nombre}</a><span aria-hidden="true">/</span><span aria-current="page" id="crumbNombre">{producto.nombre}</span></nav></div></div>

    <section className="wrap pdp" aria-labelledby="pNombre">
        <Galeria key={producto.id} producto={producto} />
        <div className="pdp-info">
            <p className="eyebrow" id="pColeccion">{`Colección ${coleccion.nombre} · ${coleccion.categoria}`}</p>
            <h1 id="pNombre">{producto.nombre}</h1>
            <p className="pdp-ref" id="pRef">{`Ref. ${producto.ref}${producto.limitado ? ' · Edición limitada a 100 piezas' : ''}`}</p>
            <p className="pdp-price"><span id="pPrecio">{precioTexto(producto.precio)}</span><small>IVA incluido · Envío asegurado gratis</small></p>
            <p className="pdp-desc" id="pDesc">{coleccion.descripcion}</p>
            <div className="field"><span className="lbl">Elige tu versión</span><div className="variants" id="pVariantes">{productosDe(coleccion.id).map((variante) => <a key={variante.id} className="variant" href={`/producto/${variante.id}`} aria-current={variante.id === producto.id ? 'true' : undefined}><span className={`variant-swatch sw-${variante.caja}`}></span><span><strong>{TEXTOS_CAJA[variante.caja]}</strong>{variante.correaTexto}</span><em>{precioTexto(variante.precio)}</em></a>)}</div></div>
            <div className="pdp-buy">
                <div className="qty"><button type="button" data-step="-1" aria-label="Una unidad menos" onClick={() => pasoCantidad(-1)}><svg className="icon" aria-hidden="true"><use href="#i-minus" /></svg></button><label className="sr-only" htmlFor="pQty">Cantidad</label><input ref={cantidadRef} id="pQty" type="number" min="1" max="9" defaultValue="1" inputMode="numeric" /><button type="button" data-step="1" aria-label="Una unidad más" onClick={() => pasoCantidad(1)}><svg className="icon" aria-hidden="true"><use href="#i-plus" /></svg></button></div>
                <button className="btn btn-copper" id="pAdd" type="button" onClick={anadirAlCarrito}><svg className="icon" aria-hidden="true"><use href="#i-bag" /></svg>Añadir al carrito</button>
                <button className="fav fav-big" id="pFav" type="button" data-fav={producto.id} aria-pressed={String(fav)} aria-label={favLabel} onClick={toggleFav}><svg className="icon" aria-hidden="true"><use href="#i-heart" /></svg></button>
            </div>
            <ul className="pdp-perks">
                <li><svg className="icon" aria-hidden="true"><use href="#i-truck" /></svg><span>Envío asegurado gratis a toda España · <a href="/ayuda#envios">Envíos</a></span></li>
                <li><svg className="icon" aria-hidden="true"><use href="#i-return" /></svg><span>30 días para devolverlo · <a href="/ayuda#devoluciones">Devoluciones</a></span></li>
                <li><svg className="icon" aria-hidden="true"><use href="#i-shield" /></svg><span>3 años de garantía y certificado de autenticidad · <a href="/ayuda#garantia">Garantía</a></span></li>
            </ul>
            <details className="acc" open><summary>Especificaciones</summary><div className="acc-body"><table className="specs"><tbody id="pSpecs">
                <FilaEspecificacion nombre="Referencia" valor={producto.ref} />
                <FilaEspecificacion nombre="Caja" valor={`${TEXTOS_CAJA[producto.caja]}, ${producto.mm} mm`} />
                <FilaEspecificacion nombre="Movimiento" valor={producto.movimiento} />
                <FilaEspecificacion nombre="Reserva de marcha" valor={producto.reserva} />
                <FilaEspecificacion nombre="Hermeticidad" valor={producto.agua} />
                <FilaEspecificacion nombre="Cristal" valor={producto.cristal} />
                <FilaEspecificacion nombre="Correa" valor={producto.correaTexto} />
            </tbody></table></div></details>
            <details className="acc"><summary>Envío y devoluciones</summary><div className="acc-body"><p>Lo enviamos asegurado, en su estuche y con el certificado de autenticidad. Tienes 30 días desde que lo recibes para devolverlo sin usar y con sus precintos.</p><p>Los relojes con grabado personalizado no admiten devolución. <a className="link-arrow" href="/ayuda#devoluciones">Cómo devolver</a></p></div></details>
            <details className="acc"><summary>Garantía y servicio</summary><div className="acc-body"><p>3 años de garantía frente a defectos de fabricación. Te recomendamos una revisión del movimiento cada 4 o 5 años; puedes pedirla en nuestro <a className="link-arrow" href="/nosotros#mantenimiento">servicio de taller</a>.</p></div></details>
            <details className="acc"><summary>¿Tienes dudas?</summary><div className="acc-body"><p>Escríbenos y te ayudamos a elegir talla de correa, grabado o regalo. <a className="link-arrow" href="/ayuda#contacto">Contactar</a></p></div></details>
        </div>
    </section>

    <section className="section section-2" aria-labelledby="relTitle">
        <div className="wrap">
            <div className="sec-head">
                <div><p className="eyebrow">Sigue explorando</p><h2 className="sec-title" id="relTitle">También te puede gustar</h2></div>
                <a className="link-arrow" href="/tienda">Ver toda la tienda <svg className="icon" aria-hidden="true"><use href="#i-right" /></svg></a>
            </div>
            <div className="grid-4" id="pRelacionados">{relacionados.map((otro) => <TarjetaSimple key={otro.id} product={otro} />)}</div>
        </div>
    </section>

    <section className="trust" aria-label="Ventajas de comprar en OKIDOKEI">
        <div className="wrap trust-row">
            <a className="trust-item" href="/ayuda#envios"><svg className="icon" aria-hidden="true"><use href="#i-truck" /></svg><div><strong>Envío asegurado</strong><span>Gratis en toda España</span></div></a>
            <a className="trust-item" href="/ayuda#devoluciones"><svg className="icon" aria-hidden="true"><use href="#i-return" /></svg><div><strong>30 días</strong><span>Devolución sencilla</span></div></a>
            <a className="trust-item" href="/ayuda#garantia"><svg className="icon" aria-hidden="true"><use href="#i-shield" /></svg><div><strong>Garantía 3 años</strong><span>En todos los relojes</span></div></a>
            <a className="trust-item" href="/ayuda#faq"><svg className="icon" aria-hidden="true"><use href="#i-cert" /></svg><div><strong>Autenticidad</strong><span>Certificado en cada pieza</span></div></a>
            <a className="trust-item" href="/ayuda#faq"><svg className="icon" aria-hidden="true"><use href="#i-lock" /></svg><div><strong>Pago seguro</strong><span>Conexión cifrada SSL</span></div></a>
        </div>
    </section>
</main>
    );
}
