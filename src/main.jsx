import React, { useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import parse from 'html-react-parser';
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

function getPageKey() {
  const file = window.location.pathname.split('/').pop();
  const key = file === '' ? 'index' : file.replace(/\.html$/, '');
  return Object.hasOwn(pageTemplates, key) ? key : 'index';
}

function parseTemplate(template) {
  const documentTemplate = new DOMParser().parseFromString(template, 'text/html');
  const scripts = Array.from(documentTemplate.body.querySelectorAll('script[src]'), (script) => script.getAttribute('src'));
  documentTemplate.body.querySelectorAll('script').forEach((script) => script.remove());
  return {
    content: documentTemplate.body.innerHTML,
    scripts,
    title: documentTemplate.title,
    description: documentTemplate.querySelector('meta[name="description"]')?.content ?? ''
  };
}

function loadScripts(sources) {
  return sources.reduce(
    (previous, source) =>
      previous.then(
        () =>
          new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = new URL(source, window.location.href).href;
            script.async = false;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`No se pudo cargar el script ${source}`));
            document.head.appendChild(script);
          })
      ),
    Promise.resolve()
  );
}

function App() {
  const pageKey = getPageKey();
  const template = useMemo(() => parseTemplate(pageTemplates[pageKey]), [pageKey]);

  useEffect(() => {
    document.title = template.title;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = template.description;

    let active = true;
    loadScripts(template.scripts).catch((error) => {
      if (!active) return;
      const notice = document.createElement('p');
      notice.setAttribute('role', 'alert');
      notice.className = 'react-migration-error';
      notice.textContent = `Error al iniciar la página: ${error.message}`;
      document.getElementById('root')?.prepend(notice);
    });

    return () => {
      active = false;
    };
  }, [template]);

  return <div id="legacy-page-content">{parse(template.content)}</div>;
}

createRoot(document.getElementById('root')).render(<App />);
