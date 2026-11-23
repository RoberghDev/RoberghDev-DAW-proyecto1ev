import { expect, test } from '@playwright/test';
import { abrir, serializar, vigilarErrores } from './utils/dom.js';

// PÁGINAS DE CARRITO Y FAVORITOS. Fijado con la versión heredada (carrito.js y favoritos.js).

const almacen = (page, clave) => page.evaluate((c) => JSON.parse(localStorage.getItem('okidokei.' + c)), clave);

function sembrar(page, datos) {
  return page.addInitScript((d) => {
    if (sessionStorage.getItem('semilla')) return;
    sessionStorage.setItem('semilla', '1');
    Object.entries(d).forEach(([k, v]) => localStorage.setItem('okidokei.' + k, JSON.stringify(v)));
  }, datos);
}

test('carrito: cantidades, IVA, eliminar, pago de prueba y vaciar', async ({ page }) => {
  const errores = vigilarErrores(page);
  await sembrar(page, { carrito: [{ id: 'heritage-acero', qty: 1 }, { id: 'luna-cobre', qty: 2 }, { id: 'no-existe', qty: 1 }] });
  await abrir(page, '/carrito.html');
  await expect(page.locator('#cartRows .row-item')).toHaveCount(2);
  await expect(page.locator('#sumItems')).toHaveText('3 artículos');
  await expect(page.locator('#sumIva')).toHaveText('Incluye 1.473 € de IVA (21 %)');

  await page.locator('#cartRows [data-id="heritage-acero"] [data-q="1"]').click();
  await expect(page.locator('#cartRows [data-id="heritage-acero"] .row-price small')).toHaveText('1.790 € / ud.');
  expect(await serializar(page, 'main')).toMatchSnapshot('carrito-tras-cantidad.json');
  await expect(page.locator('#cartBtn [data-count="carrito"]')).toHaveText('4');

  const pago = page.locator('#checkout button[type="submit"]');
  await pago.click();
  await expect(page.locator('#checkoutMsg')).toHaveText('Acepta las condiciones de compra para continuar.');
  await page.locator('#acepto').check();
  await pago.click();
  await expect(page.locator('#checkoutMsg')).toHaveText('Pago de prueba: aquí se conectará la pasarela de pago de la tienda.');
  await expect(page.locator('#acepto')).toBeChecked();

  await page.locator('#cartRows [data-id="luna-cobre"] [data-rm]').click();
  await expect(page.locator('#toast')).toHaveText('Luna Cobre eliminado del carrito');
  await page.locator('#cartRows [data-id="heritage-acero"] [data-q="-1"]').click();
  await page.locator('#cartRows [data-id="heritage-acero"] [data-q="-1"]').click();
  await expect(page.locator('#cartPageEmpty')).toBeVisible();
  await expect(page.locator('#cartPageFull')).toBeHidden();
  expect(await almacen(page, 'carrito')).toEqual([]);
  expect(await serializar(page, 'main')).toMatchSnapshot('carrito-vaciado-por-cantidad.json');
  expect(errores).toEqual([]);
});

test('carrito: botón vaciar y sincronización con el minicarrito', async ({ page }) => {
  const errores = vigilarErrores(page);
  await sembrar(page, { carrito: [{ id: 'origine', qty: 1 }] });
  await abrir(page, '/carrito.html');
  // UN CAMBIO EN EL MINICARRITO SE REFLEJA EN LA PÁGINA.
  await page.locator('#cartRows [data-q="1"]').click();
  await expect(page.locator('#cartList .qty span')).toHaveText('2');
  await page.locator('#cartClear').click();
  await expect(page.locator('#toast')).toHaveText('Carrito vaciado');
  await expect(page.locator('#cartPageEmpty')).toBeVisible();
  await expect(page.locator('#cartList .cart-empty')).toHaveCount(1);
  expect(errores).toEqual([]);
});

test('favoritos: rejilla, contador, todos al carrito y quitar', async ({ page }) => {
  const errores = vigilarErrores(page);
  await sembrar(page, { favoritos: ['origine', 'no-existe', 'heritage-cobre', 'marine-caucho'], carrito: [{ id: 'origine', qty: 1 }] });
  await abrir(page, '/favoritos.html');
  await expect(page.locator('#favCountText')).toHaveText('3 relojes guardados');
  await page.locator('#favAllToCart').click();
  await expect(page.locator('#toast')).toHaveText('3 relojes añadidos al carrito');
  await expect(page.locator('#cart')).toHaveClass(/open/);
  expect(await almacen(page, 'carrito')).toEqual([{ id: 'origine', qty: 2 }, { id: 'heritage-cobre', qty: 1 }, { id: 'marine-caucho', qty: 1 }]);
  await page.keyboard.press('Escape');

  await page.locator('#favGrid [data-fav="heritage-cobre"]').click();
  await expect(page.locator('#favCountText')).toHaveText('2 relojes guardados');
  await page.locator('#favGrid [data-add="marine-caucho"]').click();
  await expect(page.locator('#toast')).toHaveText('Marine Caucho añadido al carrito');
  await page.keyboard.press('Escape');
  expect(await serializar(page, 'main')).toMatchSnapshot('favoritos-tras-acciones.json');
  expect(errores).toEqual([]);
});
