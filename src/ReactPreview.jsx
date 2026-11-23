import React, { useEffect } from 'react';
import { StoreProvider } from './store.jsx';
import { CartDrawer, Footer, Header } from './components/SiteShell.jsx';
import * as ayudaPage from './pages/ayuda.jsx';
import * as carritoPage from './pages/carrito.jsx';
import * as coleccionesPage from './pages/colecciones.jsx';
import * as cuentaPage from './pages/cuenta.jsx';
import * as favoritosPage from './pages/favoritos.jsx';
import * as indexPage from './pages/index.jsx';
import * as journalPage from './pages/journal.jsx';
import * as legalPage from './pages/legal.jsx';
import * as nosotrosPage from './pages/nosotros.jsx';
import * as productoPage from './pages/producto.jsx';
import * as tiendaPage from './pages/tienda.jsx';

const pages = {
	ayuda: ayudaPage,
	carrito: carritoPage,
	colecciones: coleccionesPage,
	cuenta: cuentaPage,
	favoritos: favoritosPage,
	index: indexPage,
	journal: journalPage,
	legal: legalPage,
	nosotros: nosotrosPage,
	producto: productoPage,
	tienda: tiendaPage
};

function getPageKey() {
	const filename = window.location.pathname.split('/').pop();
	const key = filename === '' ? 'index' : filename.replace(/\.html$/, '');
	return Object.hasOwn(pages, key) ? key : 'index';
}

function keepPreviewNavigation(event) {
	if (!(event.target instanceof Element)) return;
	const anchor = event.target.closest('a[href]');
	if (!anchor || event.defaultPrevented || anchor.target || anchor.hasAttribute('download')) return;

	const destination = new URL(anchor.href, window.location.href);
	if (
		destination.origin !== window.location.origin ||
		!destination.pathname.endsWith('.html') ||
		destination.pathname === window.location.pathname
	) return;

	destination.searchParams.set('react', '1');
	event.preventDefault();
	window.location.assign(destination.href);
}

function ReactPreview() {
	const pageKey = getPageKey();
	const page = pages[pageKey];
	const Page = page.default;

	useEffect(() => {
		document.title = page.title;
		const description = document.querySelector('meta[name="description"]');
		if (description) description.content = page.description;
	}, [page]);

	return (
		<StoreProvider>
			<div className="react-preview" onClick={keepPreviewNavigation}>
				<Header page={pageKey} />
				<Page />
				<Footer />
				<CartDrawer />
			</div>
		</StoreProvider>
	);
}

export default ReactPreview;
