import { expect, test } from '@playwright/test';
import { abrir, serializar, vigilarErrores } from './utils/dom.js';

// FILTROS, ORDENACIÓN Y URL DE LA TIENDA. Fijado con la versión heredada (tienda.js).

async function estadoTienda(page) {
  return page.evaluate(() => {
    const tarjetas = [...document.querySelectorAll('#shopGrid > .card')];
    return {
      hash: location.hash,
      titulo: document.querySelector('#shopTitle').textContent,
      contador: document.querySelector('#shopCount').textContent,
      vacioOculto: document.querySelector('#shopEmpty').hidden,
      chips: [...document.querySelectorAll('[data-filtro-coleccion]')].filter((b) => b.getAttribute('aria-pressed') === 'true').map((b) => b.dataset.filtroColeccion),
      caja: document.querySelector('#fCaja').value,
      correa: document.querySelector('#fCorrea').value,
      orden: document.querySelector('#fOrden').value,
      novedades: document.querySelector('#fNuevos').checked,
      orden_dom: tarjetas.map((t) => (t.hidden ? '-' : '+') + t.dataset.id)
    };
  });
}

test('tienda: secuencia de filtros, orden, URL y limpieza', async ({ page }) => {
  const errores = vigilarErrores(page);
  await abrir(page, '/tienda.html');
  const pasos = { inicio: await estadoTienda(page) };
  const paso = async (nombre, accion) => { await accion(); pasos[nombre] = await estadoTienda(page); };

  await paso('chip-marine', () => page.locator('[data-filtro-coleccion="marine"]').click());
  await paso('caja-cobre', () => page.locator('#fCaja').selectOption('cobre'));
  await paso('caja-todas', () => page.locator('#fCaja').selectOption('todas'));
  await paso('correa-caucho', () => page.locator('#fCorrea').selectOption('caucho'));
  await paso('orden-precio-desc', () => page.locator('#fOrden').selectOption('precio-desc'));
  await paso('chip-todas', () => page.locator('[data-filtro-coleccion="todas"]').click());
  await paso('novedades', () => page.locator('#fNuevos').check());
  await paso('orden-nombre', () => page.locator('#fOrden').selectOption('nombre'));
  await paso('orden-precio-asc', () => page.locator('#fOrden').selectOption('precio-asc'));
  await paso('chip-heritage-con-novedades', () => page.locator('[data-filtro-coleccion="heritage"]').click());
  expect(pasos['chip-heritage-con-novedades'].vacioOculto).toBe(false);
  pasos['vacio-dom'] = JSON.parse(await serializar(page, '#shopEmpty'));
  await paso('limpiar-desde-vacio', () => page.locator('#shopEmpty [data-limpiar]').click());
  await paso('noir-y-acero', async () => { await page.locator('[data-filtro-coleccion="noir"]').click(); await page.locator('#fCaja').selectOption('negro'); });
  await paso('hash-luna', () => page.evaluate(() => { location.hash = 'luna'; }).then(() => page.waitForFunction(() => document.querySelector('#shopTitle').textContent === 'Colección Luna')));
  await paso('hash-limitadas', () => page.evaluate(() => { location.hash = 'limitadas'; }).then(() => page.waitForFunction(() => document.querySelector('#shopTitle').textContent === 'Colección Origine')));
  await paso('hash-novedades', () => page.evaluate(() => { location.hash = 'novedades'; }).then(() => page.waitForFunction(() => document.querySelector('#shopTitle').textContent === 'Novedades')));
  await paso('hash-desconocido', () => page.evaluate(() => { location.hash = 'nada'; }).then(() => page.waitForFunction(() => document.querySelector('#shopTitle').textContent === 'Todos los relojes')));
  await paso('limpiar-cabecera', () => page.locator('.shop-head [data-limpiar]').click());

  expect(JSON.stringify(pasos, null, 1)).toMatchSnapshot('tienda-pasos.json');
  expect(errores).toEqual([]);
});

test('tienda: cards añaden al carrito y marcan favoritos aunque estén reordenadas', async ({ page }) => {
  const errores = vigilarErrores(page);
  await abrir(page, '/tienda.html#marine');
  await page.locator('#fOrden').selectOption('precio-asc');
  await page.locator('#shopGrid .card:not([hidden]) [data-fav]').first().click();
  await expect(page.locator('#toast')).toHaveText('Marine Caucho guardado en favoritos');
  await page.locator('#shopGrid .card:not([hidden]) [data-add]').last().click();
  await expect(page.locator('#toast')).toHaveText('Marine Cobre añadido al carrito');
  await expect(page.locator('#cart')).toHaveClass(/open/);
  await page.keyboard.press('Escape');
  expect(await serializar(page, '#shopGrid')).toMatchSnapshot('tienda-grid-tras-acciones.json');
  expect(errores).toEqual([]);
});
