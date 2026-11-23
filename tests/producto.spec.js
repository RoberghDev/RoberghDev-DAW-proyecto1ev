import { expect, test } from '@playwright/test';
import { abrir, serializar, vigilarErrores } from './utils/dom.js';

// FICHA DE PRODUCTO. Fijado con la versión heredada (producto.js) antes de migrarla.

const almacen = (page, clave) => page.evaluate((c) => JSON.parse(localStorage.getItem('okidokei.' + c)), clave);

test('producto: título por producto y cambio de variante por hash', async ({ page }) => {
  const errores = vigilarErrores(page);
  await abrir(page, '/producto.html#heritage-acero');
  await expect(page).toHaveTitle('OKIDOKEI · Heritage Acero');

  await page.mouse.wheel(0, 900);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(300);
  await page.locator('#pQty').fill('4');
  await page.locator('#pVariantes a[href="producto.html#heritage-cobre"]').click();
  await expect(page).toHaveURL(/#heritage-cobre$/);
  await expect(page).toHaveTitle('OKIDOKEI · Heritage Cobre');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.locator('#pQty')).toHaveValue('1');
  await page.waitForLoadState('networkidle');
  expect(await serializar(page, 'main')).toMatchSnapshot('producto-tras-variante.json');

  await page.evaluate(() => { location.hash = 'no-existe'; });
  await expect(page).toHaveTitle('OKIDOKEI · Esqueleto Cobre');
  expect(errores).toEqual([]);
});

test('producto: cantidad con límites y añadir al carrito', async ({ page }) => {
  const errores = vigilarErrores(page);
  await abrir(page, '/producto.html#luna-acero');
  const menos = page.locator('[data-step="-1"]');
  const mas = page.locator('[data-step="1"]');
  const cantidad = page.locator('#pQty');

  await menos.click();
  await expect(cantidad).toHaveValue('1');
  for (let i = 0; i < 12; i++) await mas.click();
  await expect(cantidad).toHaveValue('9');
  await cantidad.fill('');
  await mas.click();
  await expect(cantidad).toHaveValue('2');
  await cantidad.fill('3');
  expect(await page.evaluate(() => document.querySelector('#pQty').getAttribute('value'))).toBe('1');

  await page.locator('#pAdd').click();
  await expect(page.locator('#toast')).toHaveText('3 × Luna Acero añadido al carrito');
  await expect(page.locator('#cart')).toHaveClass(/open/);
  expect(await almacen(page, 'carrito')).toEqual([{ id: 'luna-acero', qty: 3 }]);
  await page.keyboard.press('Escape');

  await cantidad.fill('25');
  await page.locator('#pAdd').click();
  await expect(page.locator('#toast')).toHaveText('9 × Luna Acero añadido al carrito');
  await page.keyboard.press('Escape');
  await cantidad.fill('');
  await page.locator('#pAdd').click();
  await expect(page.locator('#toast')).toHaveText('1 × Luna Acero añadido al carrito');
  expect(await almacen(page, 'carrito')).toEqual([{ id: 'luna-acero', qty: 13 }]);
  expect(errores).toEqual([]);
});

test('producto: favorito de la ficha y acciones en relacionados', async ({ page }) => {
  const errores = vigilarErrores(page);
  await abrir(page, '/producto.html#marine-acero');
  await page.locator('#pFav').click();
  await expect(page.locator('#toast')).toHaveText('Marine Acero guardado en favoritos');
  await expect(page.locator('#pFav')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#pFav')).toHaveAttribute('aria-label', 'Quitar Marine Acero de favoritos');

  await page.locator('#pRelacionados [data-fav="marine-caucho"]').click();
  await expect(page.locator('#toast')).toHaveText('Marine Caucho guardado en favoritos');
  await page.locator('#pRelacionados [data-add="heritage-cobre"]').click();
  await expect(page.locator('#toast')).toHaveText('Heritage Cobre añadido al carrito');
  await page.keyboard.press('Escape');
  expect(await almacen(page, 'favoritos')).toEqual(['marine-acero', 'marine-caucho']);
  expect(await serializar(page, 'main')).toMatchSnapshot('producto-tras-acciones.json');

  // AL CAMBIAR DE PRODUCTO, EL CORAZÓN DE LA FICHA REFLEJA EL NUEVO PRODUCTO.
  await page.locator('#pVariantes a[href="producto.html#marine-caucho"]').click();
  await expect(page.locator('#pFav')).toHaveAttribute('data-fav', 'marine-caucho');
  await expect(page.locator('#pFav')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#pVariantes a[href="producto.html#marine-cobre"]').click();
  await expect(page.locator('#pFav')).toHaveAttribute('aria-pressed', 'false');
  expect(errores).toEqual([]);
});

test('producto: miniaturas sin imágenes disponibles', async ({ page }) => {
  await abrir(page, '/producto.html#origine');
  await expect(page.locator('#pThumbs')).toBeHidden();
  expect(await serializar(page, '.pdp-gallery')).toMatchSnapshot('producto-galeria.json');
});
