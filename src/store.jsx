import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { buscarProducto } from './data.js';
import { borrar, carrito, favoritos, guardar, leer } from './store/storage.js';
import { aviso, suscribirUI } from './store/ui.js';

// CAPA REACT SOBRE src/store/storage.js Y src/store/ui.js. No reimplementa la lógica
// de negocio: la expone en un contexto y se vuelve a pintar cuando cambia el estado.
const StoreContext = createContext(null);

const DURACION_AVISO = 2800;

// AVISO GLOBAL. Siempre presente en el DOM (como el #toast heredado) para que la
// transición CSS de .toast/.show funcione; al ocultarse conserva el último texto.
function Toast({ texto, visible }) {
  return <div className={`toast${visible ? ' show' : ''}`} id="toast" role="status" aria-live="polite">{texto}</div>;
}

export function StoreProvider({ children }) {
  const [revision, setRevision] = useState(0);
  const [avisoActual, setAvisoActual] = useState({ texto: '', visible: false, numero: 0 });
  const [cartOpen, setCartOpen] = useState(false);
  const refresh = useCallback(() => setRevision((value) => value + 1), []);
  useEffect(() => {
    document.addEventListener('oki:carrito', refresh);
    document.addEventListener('oki:favoritos', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      document.removeEventListener('oki:carrito', refresh);
      document.removeEventListener('oki:favoritos', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [refresh]);
  useEffect(() => suscribirUI((orden) => {
    if (orden.tipo === 'aviso') setAvisoActual((anterior) => ({ texto: orden.texto, visible: true, numero: anterior.numero + 1 }));
    if (orden.tipo === 'abrir-carrito') setCartOpen(true);
  }), []);
  useEffect(() => {
    if (!avisoActual.visible) return undefined;
    // CADA AVISO NUEVO REINICIA EL TEMPORIZADOR, AUNQUE EL TEXTO SE REPITA.
    const timer = window.setTimeout(() => setAvisoActual((anterior) => ({ ...anterior, visible: false })), DURACION_AVISO);
    return () => window.clearTimeout(timer);
  }, [avisoActual.numero, avisoActual.visible]);
  // LOS DATOS SOLO SE RELEEN CUANDO CAMBIA EL ESTADO COMPARTIDO (IGUAL QUE EL LEGADO).
  const datos = useMemo(() => ({
    cart: carrito.items(),
    favorites: favoritos.lista(),
    user: leer('usuario', null),
    cartCount: carrito.cantidad(),
    total: carrito.total()
  }), [revision]);
  const api = useMemo(() => ({
    ...datos,
    revision, cartOpen, setCartOpen,
    toast: avisoActual.visible ? avisoActual.texto : '',
    setToast(texto) { aviso(texto); },
    add(id, qty = 1) {
      if (!buscarProducto(id)) return;
      carrito.anadir(id, qty);
    },
    setQty(id, qty) { carrito.poner(id, qty); },
    remove(id) { carrito.quitar(id); },
    clearCart() { carrito.vaciar(); },
    toggleFavorite(id) { return favoritos.alternar(id); },
    read(key, initial) { return leer(key, initial); },
    save(key, value) { guardar(key, value); refresh(); },
    forget(key) { borrar(key); refresh(); }
  }), [datos, revision, cartOpen, avisoActual, refresh]);
  return <StoreContext.Provider value={api}>{children}<Toast texto={avisoActual.texto} visible={avisoActual.visible} /></StoreContext.Provider>;
}
export function useStore() { return useContext(StoreContext); }
