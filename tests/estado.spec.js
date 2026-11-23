import { expect, test } from '@playwright/test';

// Regresión del estado compartido (carrito, favoritos y sesión).
// El comportamiento de referencia es el de las páginas heredadas.

const leerAlmacen = (page, clave) =>
  page.evaluate((c) => JSON.parse(localStorage.getItem('okidokei.' + c)), clave);

// ABRE UNA PÁGINA (HEREDADA O YA MIGRADA) Y ESPERA A QUE ESTÉ LISTA.
async function abrirPagina(page, ruta) {
  await page.goto(ruta);
  await page.locator('#siteHeader').waitFor();
  await page.waitForLoadState('networkidle');
}

function vigilarErrores(page) {
  const errores = [];
  page.on('pageerror', (error) => errores.push(error.message));
  return errores;
}

test('añadir desde la tienda actualiza contador, minicarrito, aviso y persiste', async ({ page }) => {
  const errores = vigilarErrores(page);
  await abrirPagina(page, '/tienda.html');

  const boton = page.locator('[data-add="esqueleto-cobre"]').first();
  await boton.click();
  await page.keyboard.press('Escape');
  await boton.click();

  await expect(page.locator('#cart')).toHaveClass(/open/);
  await expect(page.locator('#toast')).toHaveText('Esqueleto Cobre añadido al carrito');
  await expect(page.locator('#cartBtn [data-count="carrito"]')).toHaveText('2');
  await expect(page.locator('#cartTotal')).toHaveText('9.900 €');
  expect(await leerAlmacen(page, 'carrito')).toEqual([{ id: 'esqueleto-cobre', qty: 2 }]);

  await abrirPagina(page, '/carrito.html');
  await expect(page.locator('#cartRows .row-item')).toHaveCount(1);
  await expect(page.locator('#sumItems')).toHaveText('2 artículos');
  await expect(page.locator('#sumTotal')).toHaveText('9.900 €');
  await expect(page.locator('#sumIva')).toHaveText('Incluye 1.718 € de IVA (21 %)');

  await page.locator('#cartRows [data-q="-1"]').click();
  expect(await leerAlmacen(page, 'carrito')).toEqual([{ id: 'esqueleto-cobre', qty: 1 }]);
  await page.locator('#cartRows [data-rm]').click();
  await expect(page.locator('#toast')).toHaveText('Esqueleto Cobre eliminado del carrito');
  await expect(page.locator('#cartPageEmpty')).toBeVisible();
  expect(await leerAlmacen(page, 'carrito')).toEqual([]);
  expect(errores).toEqual([]);
});

test('favoritos se alternan, persisten y se pasan al carrito', async ({ page }) => {
  const errores = vigilarErrores(page);
  await abrirPagina(page, '/tienda.html');

  const corazon = page.locator('[data-fav="luna-cobre"]').first();
  await corazon.click();
  await expect(page.locator('#toast')).toHaveText('Luna Cobre guardado en favoritos');
  await expect(corazon).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#favBtn [data-count="favoritos"]')).toHaveText('1');
  expect(await leerAlmacen(page, 'favoritos')).toEqual(['luna-cobre']);

  await abrirPagina(page, '/favoritos.html');
  await expect(page.locator('#favGrid .card')).toHaveCount(1);
  await expect(page.locator('#favCountText')).toHaveText('1 reloj guardado');
  await page.locator('#favAllToCart').click();
  await expect(page.locator('#toast')).toHaveText('1 reloj añadido al carrito');
  await page.keyboard.press('Escape');
  expect(await leerAlmacen(page, 'carrito')).toEqual([{ id: 'luna-cobre', qty: 1 }]);

  await page.locator('#favGrid [data-fav="luna-cobre"]').click();
  await expect(page.locator('#toast')).toHaveText('Luna Cobre quitado de favoritos');
  await expect(page.locator('#favEmpty')).toBeVisible();
  expect(await leerAlmacen(page, 'favoritos')).toEqual([]);
  expect(errores).toEqual([]);
});

test('los productos inexistentes guardados se ignoran y se depuran al escribir', async ({ page }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem('semilla')) return;
    sessionStorage.setItem('semilla', '1');
    localStorage.setItem('okidokei.carrito', JSON.stringify([{ id: 'no-existe', qty: 3 }, { id: 'noir-piel', qty: 1 }]));
    localStorage.setItem('okidokei.favoritos', JSON.stringify(['no-existe', 'noir-piel']));
  });
  await abrirPagina(page, '/tienda.html');

  await expect(page.locator('#cartBtn [data-count="carrito"]')).toHaveText('1');
  await expect(page.locator('#favBtn [data-count="favoritos"]')).toHaveText('1');

  await page.locator('[data-add="noir-piel"]').first().click();
  await page.keyboard.press('Escape');
  expect(await leerAlmacen(page, 'carrito')).toEqual([{ id: 'noir-piel', qty: 2 }]);
  await page.locator('[data-fav="heritage-acero"]').first().click();
  expect(await leerAlmacen(page, 'favoritos')).toEqual(['noir-piel', 'heritage-acero']);
});

test('la cuenta muestra la sesión guardada y el logout la borra sin llamar a la API', async ({ page }) => {
  const errores = vigilarErrores(page);
  await page.addInitScript(() => {
    if (sessionStorage.getItem('semilla')) return;
    sessionStorage.setItem('semilla', '1');
    localStorage.setItem('okidokei.usuario', JSON.stringify({ nombre: 'Ana', email: 'ana@ejemplo.com' }));
    localStorage.setItem('okidokei.token', JSON.stringify('t0k3n'));
    localStorage.setItem('okidokei.favoritos', JSON.stringify(['origine']));
  });
  await abrirPagina(page, '/cuenta.html');

  await expect(page.locator('#accountPanel')).toBeVisible();
  await expect(page.locator('#accName')).toHaveText('Ana');
  await expect(page.locator('#accFavs')).toHaveText('1 reloj guardado');
  await expect(page.locator('#userBtn')).toHaveClass(/is-logged/);

  await page.locator('#logout').click();
  await expect(page.locator('#toast')).toHaveText('Has cerrado la sesión');
  await expect(page.locator('#accountForms')).toBeVisible();
  expect(await leerAlmacen(page, 'usuario')).toBeNull();
  expect(await leerAlmacen(page, 'token')).toBeNull();
  expect(errores).toEqual([]);
});

test('el estado se conserva al navegar y al recargar', async ({ page }) => {
  const errores = vigilarErrores(page);
  await abrirPagina(page, '/tienda');
  await page.locator('[data-add="marine-acero"]').first().click();
  await page.keyboard.press('Escape');
  await page.locator('[data-fav="marine-acero"]').first().click();

  // NAVEGACIÓN INTERNA (SIN RECARGA): LA CABECERA Y LA PÁGINA DE DESTINO VEN EL MISMO ESTADO.
  await page.getByRole('link', { name: /^Carrito/ }).click();
  await expect(page).toHaveURL(/\/carrito$/);
  await expect(page.locator('#cartBtn [data-count="carrito"]')).toHaveText('1');
  await expect(page.locator('#favBtn [data-count="favoritos"]')).toHaveText('1');
  await expect(page.locator('#cartRows .row-item')).toHaveCount(1);

  // RECARGA: EL ESTADO PERSISTE EN localStorage.
  await page.evaluate(() => {
    localStorage.setItem('okidokei.carrito', JSON.stringify([{ id: 'marine-acero', qty: 1 }, { id: 'origine', qty: 1 }]));
  });
  await page.reload();
  await page.locator('#siteHeader').waitFor();
  await expect(page.locator('#cartRows .row-item')).toHaveCount(2);
  await expect(page.locator('#sumTotal')).toHaveText('21.790 €');
  expect(errores).toEqual([]);
});

test('las tarjetas escriben el almacenamiento con las mismas reglas que la versión original', async ({ page }) => {
  const errores = vigilarErrores(page);
  await page.addInitScript(() => {
    if (sessionStorage.getItem('semilla')) return;
    sessionStorage.setItem('semilla', '1');
    localStorage.setItem('okidokei.carrito', JSON.stringify([{ id: 'no-existe', qty: 3 }, { id: 'noir-piel', qty: 1 }]));
    localStorage.setItem('okidokei.favoritos', JSON.stringify(['no-existe', 'noir-piel']));
  });
  await page.goto('/');

  await expect(page.locator('#cartBtn [data-count="carrito"]')).toHaveText('1');
  await expect(page.locator('#favBtn [data-count="favoritos"]')).toHaveText('1');

  await page.locator('[data-add="esqueleto-cobre"]').first().click();
  await expect(page.locator('#cartBtn [data-count="carrito"]')).toHaveText('2');
  expect(await leerAlmacen(page, 'carrito')).toEqual([{ id: 'noir-piel', qty: 1 }, { id: 'esqueleto-cobre', qty: 1 }]);
  await page.keyboard.press('Escape');
  await page.locator('[data-fav="esqueleto-cobre"]').first().click();
  expect(await leerAlmacen(page, 'favoritos')).toEqual(['noir-piel', 'esqueleto-cobre']);
  expect(errores).toEqual([]);
});
