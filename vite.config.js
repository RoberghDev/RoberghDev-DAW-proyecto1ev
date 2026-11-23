import { defineConfig } from 'vite';

// SPA CON UN ÚNICO index.html. Con appType 'spa' (valor por defecto), el servidor de desarrollo y
// `vite preview` devuelven index.html para cualquier ruta que no sea un archivo, y React Router
// decide qué página mostrar (incluidas las URLs antiguas *.html, que redirige a su ruta nueva).
export default defineConfig({
  appType: 'spa'
});
