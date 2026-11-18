import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PRODUCTOS, buscarProducto } from './data.js';

const PREFIX = 'okidokei.';
const fallback = {};
const StoreContext = createContext(null);

function read(key, initial) {
  try {
    const stored = localStorage.getItem(PREFIX + key);
    return stored == null ? initial : JSON.parse(stored);
  } catch {
    return Object.hasOwn(fallback, key) ? fallback[key] : initial;
  }
}
function write(key, value) {
  fallback[key] = value;
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch {}
  window.dispatchEvent(new CustomEvent('oki:change'));
}
function clear(key) {
  delete fallback[key];
  try { localStorage.removeItem(PREFIX + key); } catch {}
  window.dispatchEvent(new CustomEvent('oki:change'));
}

export function StoreProvider({ children }) {
  const [revision, setRevision] = useState(0);
  const [toast, setToast] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  useEffect(() => {
    const update = () => setRevision((value) => value + 1);
    window.addEventListener('oki:change', update);
    window.addEventListener('storage', update);
    return () => { window.removeEventListener('oki:change', update); window.removeEventListener('storage', update); };
  }, []);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);
  const cart = read('carrito', []).filter((line) => buscarProducto(line.id) && line.qty > 0);
  const favorites = read('favoritos', []).filter((id) => buscarProducto(id));
  const user = read('usuario', null);
  const api = useMemo(() => ({
    revision, toast, setToast, cartOpen, setCartOpen, cart, favorites, user,
    cartCount: cart.reduce((sum, line) => sum + line.qty, 0),
    total: cart.reduce((sum, line) => sum + buscarProducto(line.id).precio * line.qty, 0),
    add(id, qty = 1) {
      if (!buscarProducto(id)) return;
      const lines = [...read('carrito', [])];
      const found = lines.find((line) => line.id === id);
      if (found) found.qty += qty; else lines.push({ id, qty });
      write('carrito', lines);
    },
    setQty(id, qty) { write('carrito', read('carrito', []).map((line) => line.id === id ? { id, qty } : line).filter((line) => line.qty > 0)); },
    remove(id) { write('carrito', read('carrito', []).filter((line) => line.id !== id)); },
    clearCart() { write('carrito', []); },
    toggleFavorite(id) {
      const list = read('favoritos', []).filter((value) => buscarProducto(value));
      const added = !list.includes(id);
      write('favoritos', added ? [...list, id] : list.filter((value) => value !== id));
      return added;
    },
    save(key, value) { write(key, value); },
    forget(key) { clear(key); }
  }), [revision, toast, cartOpen, cart, favorites, user]);
  return <StoreContext.Provider value={api}>{children}{toast && <div className="toast show" role="status" aria-live="polite">{toast}</div>}</StoreContext.Provider>;
}
export function useStore() { return useContext(StoreContext); }
export function useStoreRevision() {
  const store = useStore();
  return store?.revision ?? 0;
}
export function usePageEvents() {
  const store = useStore();
  const onClick = useCallback((event) => {
    const addButton = event.target.closest('[data-add]');
    if (addButton) {
      const id = addButton.dataset.add;
      const product = PRODUCTOS.find((item) => item.id === id);
      if (!product) return;
      store.add(id);
      store.setToast(`${product.nombre} añadido al carrito`);
      store.setCartOpen(true);
      return;
    }
    const favoriteButton = event.target.closest('[data-fav]');
    if (favoriteButton) {
      event.preventDefault();
      const id = favoriteButton.dataset.fav;
      const product = buscarProducto(id);
      const added = store.toggleFavorite(id);
      if (product) store.setToast(`${product.nombre} ${added ? 'guardado en' : 'quitado de'} favoritos`);
    }
  }, [store]);
  return onClick;
}
