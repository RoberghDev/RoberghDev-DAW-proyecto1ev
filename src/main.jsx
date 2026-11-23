import React, { useLayoutEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { StoreProvider } from './store.jsx';
import { CartDrawer, Footer, Header } from './components/SiteShell.jsx';
import '../css/tokens.css';
import '../css/base.css';
import '../css/components.css';
import '../css/layouts.css';
import '../css/hero.css';
import '../css/pages.css';
import '../css/responsive.css';
import * as legalPage from './pages/legal.jsx';
import * as nosotrosPage from './pages/nosotros.jsx';
import * as journalPage from './pages/journal.jsx';
import * as ayudaPage from './pages/ayuda.jsx';
import * as coleccionesPage from './pages/colecciones.jsx';
import * as tiendaPage from './pages/tienda.jsx';
import * as productoPage from './pages/producto.jsx';
import * as carritoPage from './pages/carrito.jsx';
import * as favoritosPage from './pages/favoritos.jsx';
import * as cuentaPage from './pages/cuenta.jsx';
import * as indexPage from './pages/index.jsx';

// LAS ONCE PÁGINAS DEL SITIO, YA MIGRADAS A REACT (FASE 3).
const paginasReact = {
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

// IDENTIFICA LA PÁGINA SOLICITADA A PARTIR DE LA URL ACTUAL.
function getPageKey() {
	const nombreArchivo = window.location.pathname.split('/').pop();
	const clavePagina = nombreArchivo === '' ? 'index' : nombreArchivo.replace(/\.html$/, '');
	return Object.hasOwn(paginasReact, clavePagina) ? clavePagina : 'index';
}

// ACTUALIZA EL TÍTULO Y LA META DESCRIPCIÓN DEL DOCUMENTO.
function actualizarMetadatos(titulo, descripcion) {
	document.title = titulo;
	const description = document.querySelector('meta[name="description"]');
	if (description) description.content = descripcion;
}

// PÁGINA: COMPONENTE REACT DE src/pages/ CON SU TÍTULO Y META DESCRIPCIÓN.
function PaginaReact({ pagina }) {
	// EFECTO DE DISEÑO: SE EJECUTA ANTES QUE LOS EFECTOS DE LA PÁGINA, QUE PUEDEN AJUSTAR EL TÍTULO
	// (LA FICHA DE PRODUCTO USA EL NOMBRE DEL RELOJ, COMO HACÍA producto.js).
	useLayoutEffect(() => actualizarMetadatos(pagina.title, pagina.description), [pagina]);
	const Pagina = pagina.default;
	return <Pagina />;
}

// MONTA LAS PARTES COMUNES Y EL CONTENIDO DE LA PÁGINA SOLICITADA.
function App() {
	const clavePagina = getPageKey();
	return (
		<StoreProvider>
			<Header page={clavePagina} />
			<PaginaReact pagina={paginasReact[clavePagina]} />
			<Footer />
			<CartDrawer />
		</StoreProvider>
	);
}

const root = createRoot(document.getElementById('root'));

if (new URLSearchParams(window.location.search).get('react') === '1') {
	import('./ReactPreview.jsx').then(
		({ default: ReactPreview }) => root.render(<ReactPreview />),
		(error) => root.render(<p role="alert">No se pudo cargar la vista React: {error.message}</p>)
	);
} else {
	root.render(<App />);
}
