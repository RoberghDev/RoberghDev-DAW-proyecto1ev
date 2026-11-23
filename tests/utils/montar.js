import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

// MONTA UN COMPONENTE EN UN CONTENEDOR NUEVO Y DEVUELVE LA FUNCIÓN PARA DESMONTARLO.
// Solo lo usan las pruebas de ciclo de vida (Vite lo sirve desde /tests/utils/montar.js).
export function montar(Componente) {
  const contenedor = document.createElement('div');
  // FIJO SOBRE LA PANTALLA: LOS EFECTOS SOLO ANIMAN SI ESTÁN VISIBLES.
  contenedor.style.cssText = 'position:fixed;inset:0;z-index:9999;overflow:auto';
  document.body.appendChild(contenedor);
  const raiz = createRoot(contenedor);
  raiz.render(createElement(Componente));
  return () => { raiz.unmount(); contenedor.remove(); };
}
