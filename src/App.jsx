import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate, useNavigationType } from 'react-router';
import { StoreProvider } from './store.jsx';
import { CartDrawer, Footer, Header } from './components/SiteShell.jsx';
import { claveDeRuta, rutaDesdeAntigua } from './rutas.js';
import { NavegacionContext } from './navegacion.js';
import * as ayudaPage from './pages/ayuda.jsx';
import * as carritoPage from './pages/carrito.jsx';
import * as coleccionesPage from './pages/colecciones.jsx';
import * as cuentaPage from './pages/cuenta.jsx';
import * as favoritosPage from './pages/favoritos.jsx';
import * as incidenciasPage from './pages/incidencias.jsx';
import * as indexPage from './pages/index.jsx';
import * as journalPage from './pages/journal.jsx';
import * as legalPage from './pages/legal.jsx';
import * as nosotrosPage from './pages/nosotros.jsx';
import * as productoPage from './pages/producto.jsx';
import * as tiendaPage from './pages/tienda.jsx';

// NAVEGACIÓN INTERNA. Reproduce la semántica de la antigua web multipágina:
// - Ir a otra página equivale a cargarla de nuevo: se reinicia el estado de la interfaz (menús,
//   buscador, minicarrito, filtros…) y se empieza arriba, o en la sección del #fragmento si existe.
// - Cambiar solo el #fragmento de la página actual no la recarga (como un ancla del navegador).
// - Pasar de un producto a otro tampoco, porque antes era el #id dentro de producto.html.
let contadorCargas = 0;
const nuevaCarga = () => `carga-${++contadorCargas}`;

// ACTUALIZA EL TÍTULO Y LA META DESCRIPCIÓN DEL DOCUMENTO.
function actualizarMetadatos(titulo, descripcion) {
	document.title = titulo;
	const description = document.querySelector('meta[name="description"]');
	if (description) description.content = descripcion;
}

// PÁGINA: COMPONENTE REACT DE src/pages/ CON SU TÍTULO Y META DESCRIPCIÓN.
function PaginaReact({ pagina }) {
	// EFECTO DE DISEÑO: SE EJECUTA ANTES QUE LOS EFECTOS DE LA PÁGINA, QUE PUEDEN AJUSTAR EL TÍTULO
	// (LA FICHA DE PRODUCTO USA EL NOMBRE DEL RELOJ).
	useLayoutEffect(() => actualizarMetadatos(pagina.title, pagina.description), [pagina]);
	const Pagina = pagina.default;
	return <Pagina />;
}

// RUTAS ANTIGUAS (*.html) → RUTA NUEVA EQUIVALENTE; CUALQUIER OTRA RUTA DESCONOCIDA → PORTADA
// (la web multipágina también mostraba la portada para páginas desconocidas).
function RedireccionAntigua() {
	const location = useLocation();
	const destino = rutaDesdeAntigua(location.pathname, location.hash) ?? '/';
	return <Navigate to={destino} replace state={{ desplazar: 'inicio' }} />;
}

function Layout() {
	const location = useLocation();
	const tipoNavegacion = useNavigationType();
	const navigate = useNavigate();
	const anterior = useRef(null);

	// IDENTIFICADOR DE "CARGA DE PÁGINA": AL CAMBIAR, SE MONTA DE NUEVO TODA LA INTERFAZ.
	const carga = useMemo(() => {
		if (location.state?.carga) return location.state.carga;
		// SIN ESTADO (CARGA INICIAL O ATRÁS/ADELANTE A ELLA): SI SOLO CAMBIA EL FRAGMENTO, ES LA MISMA PÁGINA.
		if (anterior.current && anterior.current.pathname === location.pathname) return anterior.current.carga;
		return `inicial-${location.key}`;
	}, [location]);
	useEffect(() => { anterior.current = { pathname: location.pathname, carga }; }, [location.pathname, carga]);

	// NAVEGA A UNA RUTA INTERNA DECIDIENDO SI EQUIVALE A CARGAR OTRA PÁGINA O A UN CAMBIO DENTRO DE ELLA.
	const navegar = useCallback((destino) => {
		const actual = window.location;
		const url = new URL(destino, actual.href);
		const ruta = url.pathname + url.search + url.hash;
		const mismaUrl = ruta === actual.pathname + actual.search + actual.hash;
		const soloFragmento = url.hash && url.pathname === actual.pathname && url.search === actual.search;
		const entreProductos = claveDeRuta(url.pathname) === 'producto' && claveDeRuta(actual.pathname) === 'producto' && url.pathname !== '/producto';
		const mismaPagina = soloFragmento || entreProductos;
		navigate(ruta, {
			replace: mismaUrl,
			state: { carga: mismaPagina ? carga : nuevaCarga(), desplazar: soloFragmento ? 'fragmento' : mismaPagina ? null : 'inicio' }
		});
	}, [navigate, carga]);
	const navegarRef = useRef(navegar);
	navegarRef.current = navegar;

	// LOS ENLACES INTERNOS (<a href="/tienda">, <a href="#seccion">…) NAVEGAN CON EL ROUTER, SIN RECARGAR.
	useEffect(() => {
		const alHacerClic = (evento) => {
			if (evento.defaultPrevented || evento.button !== 0 || evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
			if (!(evento.target instanceof Element)) return;
			const enlace = evento.target.closest('a[href]');
			if (!enlace || (enlace.target && enlace.target !== '_self') || enlace.hasAttribute('download')) return;
			const url = new URL(enlace.href, window.location.href);
			if (url.origin !== window.location.origin) return;
			evento.preventDefault();
			navegarRef.current(url.pathname + url.search + url.hash);
		};
		document.addEventListener('click', alHacerClic);
		return () => document.removeEventListener('click', alHacerClic);
	}, []);

	// DESPLAZAMIENTO: AL "CARGAR" UNA PÁGINA, ARRIBA O A LA SECCIÓN DEL FRAGMENTO; EN UN CAMBIO DE
	// FRAGMENTO, A ESA SECCIÓN. ATRÁS/ADELANTE LO GESTIONA EL NAVEGADOR.
	const primeraVez = useRef(true);
	useLayoutEffect(() => {
		const seccion = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
		if (primeraVez.current) {
			primeraVez.current = false;
			if (seccion) seccion.scrollIntoView();
			return;
		}
		if (tipoNavegacion === 'POP') return;
		const desplazar = location.state?.desplazar;
		if (desplazar === 'inicio') { if (seccion) seccion.scrollIntoView(); else window.scrollTo(0, 0); }
		else if (desplazar === 'fragmento' && seccion) seccion.scrollIntoView();
	}, [location, tipoNavegacion]);

	const clave = claveDeRuta(location.pathname);
	return (
		<NavegacionContext.Provider value={navegar}>
			<StoreProvider key={carga}>
				<Header page={clave} />
				<Outlet />
				<Footer />
				<CartDrawer />
			</StoreProvider>
		</NavegacionContext.Provider>
	);
}

// LAS ONCE PÁGINAS DEL SITIO (MISMO ORDEN Y CORRESPONDENCIA QUE EL PLAN DE MIGRACIÓN).
export default function App() {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route index element={<PaginaReact pagina={indexPage} />} />
				<Route path="tienda" element={<PaginaReact pagina={tiendaPage} />} />
				<Route path="colecciones" element={<PaginaReact pagina={coleccionesPage} />} />
				<Route path="producto" element={<PaginaReact pagina={productoPage} />} />
				<Route path="producto/:id" element={<PaginaReact pagina={productoPage} />} />
				<Route path="carrito" element={<PaginaReact pagina={carritoPage} />} />
				<Route path="favoritos" element={<PaginaReact pagina={favoritosPage} />} />
				<Route path="cuenta" element={<PaginaReact pagina={cuentaPage} />} />
				<Route path="ayuda" element={<PaginaReact pagina={ayudaPage} />} />
				<Route path="journal" element={<PaginaReact pagina={journalPage} />} />
				<Route path="nosotros" element={<PaginaReact pagina={nosotrosPage} />} />
				<Route path="legal" element={<PaginaReact pagina={legalPage} />} />
				<Route path="incidencias" element={<PaginaReact pagina={incidenciasPage} />} />
				<Route path="*" element={<RedireccionAntigua />} />
			</Route>
		</Routes>
	);
}
