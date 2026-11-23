import { expect, test } from '@playwright/test';
import { abrir, estadoConDatos, serializar, vigilarErrores } from './utils/dom.js';

// PARIDAD DEL CONTENIDO DE CADA PÁGINA (<main>). Las instantáneas se generaron con la
// versión heredada (plantilla + scripts de public/js) antes de migrar cada página a React.

const rutas = [
  ['index', '/'],
  ['tienda', '/tienda.html'],
  ['tienda-novedades', '/tienda.html#novedades'],
  ['tienda-marine', '/tienda.html#marine'],
  ['tienda-limitadas', '/tienda.html#limitadas'],
  ['colecciones', '/colecciones.html'],
  ['producto', '/producto.html'],
  ['producto-luna-cobre', '/producto.html#luna-cobre'],
  ['producto-origine', '/producto.html#origine'],
  ['producto-inexistente', '/producto.html#no-existe'],
  ['carrito', '/carrito.html'],
  ['favoritos', '/favoritos.html'],
  ['cuenta', '/cuenta.html'],
  ['ayuda', '/ayuda.html'],
  ['journal', '/journal.html'],
  ['nosotros', '/nosotros.html'],
  ['legal', '/legal.html']
];

for (const [nombre, ruta] of rutas) {
  test(`contenido de ${nombre}: DOM idéntico sin datos y con datos`, async ({ page }) => {
    const errores = vigilarErrores(page);
    await abrir(page, ruta);
    expect(await serializar(page, 'main'), 'sin datos').toMatchSnapshot(`${nombre}-vacio.json`);

    await page.evaluate((datos) => Object.entries(datos).forEach(([k, v]) => localStorage.setItem(k, v)), estadoConDatos);
    await page.reload();
    await abrir(page, ruta);
    expect(await serializar(page, 'main'), 'con datos').toMatchSnapshot(`${nombre}-datos.json`);
    expect(errores).toEqual([]);
  });
}

test('título y meta descripción de cada página', async ({ page }) => {
  const metadatos = {};
  for (const [nombre, ruta] of rutas) {
    await abrir(page, ruta);
    metadatos[nombre] = await page.evaluate(() => [document.title, document.querySelector('meta[name="description"]')?.content ?? null]);
  }
  expect(JSON.stringify(metadatos, null, 1)).toMatchSnapshot('metadatos.json');
});
