import React, { useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import parse from 'html-react-parser';
import { login } from '../services/api.js';
import '../css/tokens.css';
import '../css/base.css';
import '../css/components.css';
import '../css/layouts.css';
import '../css/hero.css';
import '../css/pages.css';
import '../css/responsive.css';
import ayudaHtml from './legacy-pages/ayuda.html?raw';
import carritoHtml from './legacy-pages/carrito.html?raw';
import coleccionesHtml from './legacy-pages/colecciones.html?raw';
import cuentaHtml from './legacy-pages/cuenta.html?raw';
import favoritosHtml from './legacy-pages/favoritos.html?raw';
import indexHtml from './legacy-pages/index.html?raw';
import journalHtml from './legacy-pages/journal.html?raw';
import legalHtml from './legacy-pages/legal.html?raw';
import nosotrosHtml from './legacy-pages/nosotros.html?raw';
import productoHtml from './legacy-pages/producto.html?raw';
import tiendaHtml from './legacy-pages/tienda.html?raw';

const pageTemplates = {
	ayuda: ayudaHtml,
	carrito: carritoHtml,
	colecciones: coleccionesHtml,
	cuenta: cuentaHtml,
	favoritos: favoritosHtml,
	index: indexHtml,
	journal: journalHtml,
	legal: legalHtml,
	nosotros: nosotrosHtml,
	producto: productoHtml,
	tienda: tiendaHtml
};

// IDENTIFICA LA PÁGINA SOLICITADA A PARTIR DE LA URL ACTUAL.
function getPageKey() {
	const nombreArchivo = window.location.pathname.split('/').pop();
	const clavePagina = nombreArchivo === '' ? 'index' : nombreArchivo.replace(/\.html$/, '');
	return Object.hasOwn(pageTemplates, clavePagina) ? clavePagina : 'index';
}

// EXTRAe EL CONTENIDO Y METADATOS DE UNA PLANTILLA HTML.
function parseTemplate(template) {
	const documentoPlantilla = new DOMParser().parseFromString(template, 'text/html');
	const fuentesScripts = Array.from(documentoPlantilla.body.querySelectorAll('script[src]'), (elementoScript) => elementoScript.getAttribute('src'));
	documentoPlantilla.body.querySelectorAll('script').forEach((elementoScript) => elementoScript.remove());
	return {
		content: documentoPlantilla.body.innerHTML,
		scripts: fuentesScripts,
		title: documentoPlantilla.title,
		description: documentoPlantilla.querySelector('meta[name="description"]')?.content ?? ''
	};
}

// CARGA LOS SCRIPTS DE LA PLANTILLA EN EL ORDEN DECLARADO.
function loadScripts(fuentesScripts) {
	return fuentesScripts.reduce(
		(promesaAnterior, fuenteScript) =>
			promesaAnterior.then(
				() =>
					new Promise((resolve, reject) => {
						const elementoScript = document.createElement('script');
						elementoScript.src = new URL(fuenteScript, window.location.href).href;
						elementoScript.async = false;
						elementoScript.onload = resolve;
						elementoScript.onerror = () => reject(new Error(`No se pudo cargar el script ${fuenteScript}`));
						document.head.appendChild(elementoScript);
					})
			),
		Promise.resolve()
	);
}

// MONTA LA PLANTILLA Y CARGA LOS SCRIPTS NECESARIOS PARA LA PÁGINA.
function App() {
	const clavePagina = getPageKey();
	const plantillaPagina = useMemo(() => parseTemplate(pageTemplates[clavePagina]), [clavePagina]);

	useEffect(() => {
		document.title = plantillaPagina.title;
		const description = document.querySelector('meta[name="description"]');
		if (description) description.content = plantillaPagina.description;

		window.OKI_API = { login };

		let efectoActivo = true;
		loadScripts(plantillaPagina.scripts).catch((errorCarga) => {
			if (!efectoActivo) return;
			const avisoError = document.createElement('p');
			avisoError.setAttribute('role', 'alert');
			avisoError.className = 'react-migration-error';
			avisoError.textContent = `Error al iniciar la página: ${errorCarga.message}`;
			document.getElementById('root')?.prepend(avisoError);
		});

		return () => {
			efectoActivo = false;
		};
	}, [plantillaPagina]);

	return <div id="legacy-page-content">{parse(plantillaPagina.content)}</div>;
}

createRoot(document.getElementById('root')).render(<App />);
