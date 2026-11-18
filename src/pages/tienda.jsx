import React from 'react';
// Migrated from the original tienda.html page markup.
export const title = 'OKIDOKEI · Tienda';
export const description = 'Todos los relojes OKIDOKEI: filtra por colección, caja y correa.';
export default function Tienda() {
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

            <section className={'section-dark shop-section'}>
                <div className={'wrap'}>
                    <div className={'shop-bar'}>
                        <div className={'shop-chips'} role={'group'} aria-label={'Filtrar por colección'}><button className={'chip'} type={'button'} data-filtro-coleccion={'todas'} aria-pressed={'true'}>Todas</button><button className={'chip'} type={'button'} data-filtro-coleccion={'esqueleto'} aria-pressed={'false'}>Esqueleto</button><button className={'chip'} type={'button'} data-filtro-coleccion={'heritage'} aria-pressed={'false'}>Heritage</button><button className={'chip'} type={'button'} data-filtro-coleccion={'marine'} aria-pressed={'false'}>Marine</button><button className={'chip'} type={'button'} data-filtro-coleccion={'noir'} aria-pressed={'false'}>Noir</button><button className={'chip'} type={'button'} data-filtro-coleccion={'luna'} aria-pressed={'false'}>Luna</button><button className={'chip'} type={'button'} data-filtro-coleccion={'origine'} aria-pressed={'false'}>Origine</button></div>
                        <div className={'shop-filters'}>
                            <div className={'field'}><label htmlFor={'fCaja'}>Caja</label><select className={'select'} id={'fCaja'}><option value={'todas'}>Todas</option><option value={'cobre'}>Cobre</option><option value={'acero'}>Acero</option><option value={'negro'}>Acero negro</option></select></div>
                            <div className={'field'}><label htmlFor={'fCorrea'}>Correa</label><select className={'select'} id={'fCorrea'}><option value={'todas'}>Todas</option><option value={'piel'}>Piel</option><option value={'acero'}>Brazalete de acero</option><option value={'caucho'}>Caucho</option></select></div>
                            <div className={'field'}><label htmlFor={'fOrden'}>Ordenar</label><select className={'select'} id={'fOrden'}><option value={'destacados'}>Destacados</option><option value={'precio-asc'}>Precio: menor a mayor</option><option value={'precio-desc'}>Precio: mayor a menor</option><option value={'nombre'}>Nombre (A–Z)</option></select></div>
                            <label className={'check'} htmlFor={'fNuevos'}><input type={'checkbox'} id={'fNuevos'} /> Solo novedades</label>
                        </div>
                    </div>
                    <div className={'shop-head'}><h2 id={'shopTitle'}>Todos los relojes</h2><p><span className={'shop-count'} id={'shopCount'}>12 relojes</span> · <button className={'shop-clear'} type={'button'} data-limpiar>Quitar filtros</button></p></div>
                    <div className={'grid-4'} id={'shopGrid'}>
                        <article className={'card'} data-id={'esqueleto-cobre'} data-coleccion={'esqueleto'} data-caja={'cobre'} data-correa={'piel'} data-precio={'4950'} data-nombre={'Esqueleto Cobre'} data-orden={'0'} data-nuevo={'si'}>
                            <div className={'card-media'}><a className={'card-img foto'} href={'producto.html#esqueleto-cobre'} tabIndex={'-1'} aria-hidden={'true'}><img src={'assets/relojes/esqueleto-cobre.jpg'} alt={'Esqueleto Cobre: caja de cobre y piel marrón con pespunte crudo'} loading={'lazy'} data-foto /></a><span className={'tag'}>Nuevo</span><button className={'fav'} type={'button'} data-fav={'esqueleto-cobre'} aria-pressed={'false'} aria-label={'Añadir Esqueleto Cobre a favoritos'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-heart'} /></svg></button></div>
                            <div className={'card-body'}><p className={'card-coll'}>Esqueleto</p><h3 className={'card-name'}><a href={'producto.html#esqueleto-cobre'}>Esqueleto Cobre</a></h3><p className={'card-spec'}>Automático esqueletado · Cobre · 42 mm</p>
                                <div className={'card-foot'}><span className={'card-price'}>4.950 €</span><button className={'add-btn'} type={'button'} data-add={'esqueleto-cobre'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-bag'} /></svg>Añadir</button></div></div>
                        </article>
                        <article className={'card'} data-id={'esqueleto-acero'} data-coleccion={'esqueleto'} data-caja={'acero'} data-correa={'piel'} data-precio={'4650'} data-nombre={'Esqueleto Acero'} data-orden={'1'} data-nuevo={'no'}>
                            <div className={'card-media'}><a className={'card-img foto'} href={'producto.html#esqueleto-acero'} tabIndex={'-1'} aria-hidden={'true'}><img src={'assets/relojes/esqueleto-acero.jpg'} alt={'Esqueleto Acero: caja de acero y piel negra con pespunte cobre'} loading={'lazy'} data-foto /></a><button className={'fav'} type={'button'} data-fav={'esqueleto-acero'} aria-pressed={'false'} aria-label={'Añadir Esqueleto Acero a favoritos'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-heart'} /></svg></button></div>
                            <div className={'card-body'}><p className={'card-coll'}>Esqueleto</p><h3 className={'card-name'}><a href={'producto.html#esqueleto-acero'}>Esqueleto Acero</a></h3><p className={'card-spec'}>Automático esqueletado · Acero · 42 mm</p>
                                <div className={'card-foot'}><span className={'card-price'}>4.650 €</span><button className={'add-btn'} type={'button'} data-add={'esqueleto-acero'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-bag'} /></svg>Añadir</button></div></div>
                        </article>
                        <article className={'card'} data-id={'heritage-cobre'} data-coleccion={'heritage'} data-caja={'cobre'} data-correa={'piel'} data-precio={'1980'} data-nombre={'Heritage Cobre'} data-orden={'2'} data-nuevo={'no'}>
                            <div className={'card-media'}><a className={'card-img foto'} href={'producto.html#heritage-cobre'} tabIndex={'-1'} aria-hidden={'true'}><img src={'assets/relojes/heritage-cobre.jpg'} alt={'Heritage Cobre: caja de cobre y piel marrón oscuro'} loading={'lazy'} data-foto /></a><button className={'fav'} type={'button'} data-fav={'heritage-cobre'} aria-pressed={'false'} aria-label={'Añadir Heritage Cobre a favoritos'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-heart'} /></svg></button></div>
                            <div className={'card-body'}><p className={'card-coll'}>Heritage</p><h3 className={'card-name'}><a href={'producto.html#heritage-cobre'}>Heritage Cobre</a></h3><p className={'card-spec'}>Automático · Cobre · 40 mm</p>
                                <div className={'card-foot'}><span className={'card-price'}>1.980 €</span><button className={'add-btn'} type={'button'} data-add={'heritage-cobre'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-bag'} /></svg>Añadir</button></div></div>
                        </article>
                        <article className={'card'} data-id={'heritage-acero'} data-coleccion={'heritage'} data-caja={'acero'} data-correa={'piel'} data-precio={'1790'} data-nombre={'Heritage Acero'} data-orden={'3'} data-nuevo={'no'}>
                            <div className={'card-media'}><a className={'card-img foto'} href={'producto.html#heritage-acero'} tabIndex={'-1'} aria-hidden={'true'}><img src={'assets/relojes/heritage-acero.jpg'} alt={'Heritage Acero: caja de acero y piel negra'} loading={'lazy'} data-foto /></a><button className={'fav'} type={'button'} data-fav={'heritage-acero'} aria-pressed={'false'} aria-label={'Añadir Heritage Acero a favoritos'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-heart'} /></svg></button></div>
                            <div className={'card-body'}><p className={'card-coll'}>Heritage</p><h3 className={'card-name'}><a href={'producto.html#heritage-acero'}>Heritage Acero</a></h3><p className={'card-spec'}>Automático · Acero · 40 mm</p>
                                <div className={'card-foot'}><span className={'card-price'}>1.790 €</span><button className={'add-btn'} type={'button'} data-add={'heritage-acero'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-bag'} /></svg>Añadir</button></div></div>
                        </article>
                        <article className={'card'} data-id={'marine-acero'} data-coleccion={'marine'} data-caja={'acero'} data-correa={'acero'} data-precio={'2890'} data-nombre={'Marine Acero'} data-orden={'4'} data-nuevo={'no'}>
                            <div className={'card-media'}><a className={'card-img foto'} href={'producto.html#marine-acero'} tabIndex={'-1'} aria-hidden={'true'}><img src={'assets/relojes/marine-acero.jpg'} alt={'Marine Acero: caja de acero y brazalete de acero de tres eslabones'} loading={'lazy'} data-foto /></a><button className={'fav'} type={'button'} data-fav={'marine-acero'} aria-pressed={'false'} aria-label={'Añadir Marine Acero a favoritos'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-heart'} /></svg></button></div>
                            <div className={'card-body'}><p className={'card-coll'}>Marine</p><h3 className={'card-name'}><a href={'producto.html#marine-acero'}>Marine Acero</a></h3><p className={'card-spec'}>Automático · Acero · 42 mm</p>
                                <div className={'card-foot'}><span className={'card-price'}>2.890 €</span><button className={'add-btn'} type={'button'} data-add={'marine-acero'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-bag'} /></svg>Añadir</button></div></div>
                        </article>
                        <article className={'card'} data-id={'marine-caucho'} data-coleccion={'marine'} data-caja={'acero'} data-correa={'caucho'} data-precio={'2690'} data-nombre={'Marine Caucho'} data-orden={'5'} data-nuevo={'si'}>
                            <div className={'card-media'}><a className={'card-img foto'} href={'producto.html#marine-caucho'} tabIndex={'-1'} aria-hidden={'true'}><img src={'assets/relojes/marine-caucho.jpg'} alt={'Marine Caucho: caja de acero y caucho negro'} loading={'lazy'} data-foto /></a><span className={'tag'}>Nuevo</span><button className={'fav'} type={'button'} data-fav={'marine-caucho'} aria-pressed={'false'} aria-label={'Añadir Marine Caucho a favoritos'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-heart'} /></svg></button></div>
                            <div className={'card-body'}><p className={'card-coll'}>Marine</p><h3 className={'card-name'}><a href={'producto.html#marine-caucho'}>Marine Caucho</a></h3><p className={'card-spec'}>Automático · Acero · 42 mm</p>
                                <div className={'card-foot'}><span className={'card-price'}>2.690 €</span><button className={'add-btn'} type={'button'} data-add={'marine-caucho'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-bag'} /></svg>Añadir</button></div></div>
                        </article>
                        <article className={'card'} data-id={'marine-cobre'} data-coleccion={'marine'} data-caja={'cobre'} data-correa={'caucho'} data-precio={'3190'} data-nombre={'Marine Cobre'} data-orden={'6'} data-nuevo={'no'}>
                            <div className={'card-media'}><a className={'card-img foto'} href={'producto.html#marine-cobre'} tabIndex={'-1'} aria-hidden={'true'}><img src={'assets/relojes/marine-cobre.jpg'} alt={'Marine Cobre: caja de cobre y caucho negro'} loading={'lazy'} data-foto /></a><button className={'fav'} type={'button'} data-fav={'marine-cobre'} aria-pressed={'false'} aria-label={'Añadir Marine Cobre a favoritos'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-heart'} /></svg></button></div>
                            <div className={'card-body'}><p className={'card-coll'}>Marine</p><h3 className={'card-name'}><a href={'producto.html#marine-cobre'}>Marine Cobre</a></h3><p className={'card-spec'}>Automático · Cobre · 42 mm</p>
                                <div className={'card-foot'}><span className={'card-price'}>3.190 €</span><button className={'add-btn'} type={'button'} data-add={'marine-cobre'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-bag'} /></svg>Añadir</button></div></div>
                        </article>
                        <article className={'card'} data-id={'noir-caucho'} data-coleccion={'noir'} data-caja={'negro'} data-correa={'caucho'} data-precio={'3450'} data-nombre={'Noir Caucho'} data-orden={'7'} data-nuevo={'si'}>
                            <div className={'card-media'}><a className={'card-img foto'} href={'producto.html#noir-caucho'} tabIndex={'-1'} aria-hidden={'true'}><img src={'assets/relojes/noir-caucho.jpg'} alt={'Noir Caucho: caja de acero negro y caucho negro'} loading={'lazy'} data-foto /></a><span className={'tag'}>Nuevo</span><button className={'fav'} type={'button'} data-fav={'noir-caucho'} aria-pressed={'false'} aria-label={'Añadir Noir Caucho a favoritos'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-heart'} /></svg></button></div>
                            <div className={'card-body'}><p className={'card-coll'}>Noir</p><h3 className={'card-name'}><a href={'producto.html#noir-caucho'}>Noir Caucho</a></h3><p className={'card-spec'}>Automático · Acero negro · 41 mm</p>
                                <div className={'card-foot'}><span className={'card-price'}>3.450 €</span><button className={'add-btn'} type={'button'} data-add={'noir-caucho'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-bag'} /></svg>Añadir</button></div></div>
                        </article>
                        <article className={'card'} data-id={'noir-piel'} data-coleccion={'noir'} data-caja={'negro'} data-correa={'piel'} data-precio={'3390'} data-nombre={'Noir Piel'} data-orden={'8'} data-nuevo={'no'}>
                            <div className={'card-media'}><a className={'card-img foto'} href={'producto.html#noir-piel'} tabIndex={'-1'} aria-hidden={'true'}><img src={'assets/relojes/noir-piel.jpg'} alt={'Noir Piel: caja de acero negro y piel negra con pespunte cobre'} loading={'lazy'} data-foto /></a><button className={'fav'} type={'button'} data-fav={'noir-piel'} aria-pressed={'false'} aria-label={'Añadir Noir Piel a favoritos'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-heart'} /></svg></button></div>
                            <div className={'card-body'}><p className={'card-coll'}>Noir</p><h3 className={'card-name'}><a href={'producto.html#noir-piel'}>Noir Piel</a></h3><p className={'card-spec'}>Automático · Acero negro · 41 mm</p>
                                <div className={'card-foot'}><span className={'card-price'}>3.390 €</span><button className={'add-btn'} type={'button'} data-add={'noir-piel'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-bag'} /></svg>Añadir</button></div></div>
                        </article>
                        <article className={'card'} data-id={'luna-acero'} data-coleccion={'luna'} data-caja={'acero'} data-correa={'piel'} data-precio={'3150'} data-nombre={'Luna Acero'} data-orden={'9'} data-nuevo={'no'}>
                            <div className={'card-media'}><a className={'card-img foto'} href={'producto.html#luna-acero'} tabIndex={'-1'} aria-hidden={'true'}><img src={'assets/relojes/luna-acero.jpg'} alt={'Luna Acero: caja de acero y piel negra con pespunte cobre'} loading={'lazy'} data-foto /></a><button className={'fav'} type={'button'} data-fav={'luna-acero'} aria-pressed={'false'} aria-label={'Añadir Luna Acero a favoritos'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-heart'} /></svg></button></div>
                            <div className={'card-body'}><p className={'card-coll'}>Luna</p><h3 className={'card-name'}><a href={'producto.html#luna-acero'}>Luna Acero</a></h3><p className={'card-spec'}>Automático con fase lunar · Acero · 40 mm</p>
                                <div className={'card-foot'}><span className={'card-price'}>3.150 €</span><button className={'add-btn'} type={'button'} data-add={'luna-acero'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-bag'} /></svg>Añadir</button></div></div>
                        </article>
                        <article className={'card'} data-id={'luna-cobre'} data-coleccion={'luna'} data-caja={'cobre'} data-correa={'piel'} data-precio={'3350'} data-nombre={'Luna Cobre'} data-orden={'10'} data-nuevo={'si'}>
                            <div className={'card-media'}><a className={'card-img foto'} href={'producto.html#luna-cobre'} tabIndex={'-1'} aria-hidden={'true'}><img src={'assets/relojes/luna-cobre.jpg'} alt={'Luna Cobre: caja de cobre y piel marrón'} loading={'lazy'} data-foto /></a><span className={'tag'}>Nuevo</span><button className={'fav'} type={'button'} data-fav={'luna-cobre'} aria-pressed={'false'} aria-label={'Añadir Luna Cobre a favoritos'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-heart'} /></svg></button></div>
                            <div className={'card-body'}><p className={'card-coll'}>Luna</p><h3 className={'card-name'}><a href={'producto.html#luna-cobre'}>Luna Cobre</a></h3><p className={'card-spec'}>Automático con fase lunar · Cobre · 40 mm</p>
                                <div className={'card-foot'}><span className={'card-price'}>3.350 €</span><button className={'add-btn'} type={'button'} data-add={'luna-cobre'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-bag'} /></svg>Añadir</button></div></div>
                        </article>
                        <article className={'card'} data-id={'origine'} data-coleccion={'origine'} data-caja={'cobre'} data-correa={'piel'} data-precio={'18900'} data-nombre={'Origine Tourbillon'} data-orden={'11'} data-nuevo={'no'}>
                            <div className={'card-media'}><a className={'card-img foto'} href={'producto.html#origine'} tabIndex={'-1'} aria-hidden={'true'}><img src={'assets/relojes/origine.jpg'} alt={'Origine Tourbillon: caja de cobre y piel negra con pespunte cobre'} loading={'lazy'} data-foto /></a><span className={'tag'}>Edición limitada</span><button className={'fav'} type={'button'} data-fav={'origine'} aria-pressed={'false'} aria-label={'Añadir Origine Tourbillon a favoritos'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-heart'} /></svg></button></div>
                            <div className={'card-body'}><p className={'card-coll'}>Origine</p><h3 className={'card-name'}><a href={'producto.html#origine'}>Origine Tourbillon</a></h3><p className={'card-spec'}>Tourbillon de carga manual · Cobre · 43 mm</p>
                                <div className={'card-foot'}><span className={'card-price'}>18.900 €</span><button className={'add-btn'} type={'button'} data-add={'origine'}><svg className={'icon'} aria-hidden={'true'}><use href={'#i-bag'} /></svg>Añadir</button></div></div>
                        </article>
                    </div>
                    <div className={'empty'} id={'shopEmpty'} hidden>
                        <svg className={'mark'} aria-hidden={'true'}><use href={'#emblem'} /></svg>
                        <h2>Ningún reloj con esos filtros</h2>
                        <p>Prueba con otra caja u otra correa, o mira toda la colección.</p>
                        <button className={'btn btn-outline'} type={'button'} data-limpiar>Ver todos los relojes</button>
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
