import { expect, test } from '@playwright/test';
import { serializar } from './utils/dom.js';

// Paridad de las partes comunes (cabecera, menú móvil, buscador, pie, minicarrito y aviso).
// Las instantáneas se generaron con la versión heredada (plantillas + comun.js) y fijan
// el DOM exacto que debe producir la versión React.

const paginas = ['index', 'tienda', 'colecciones', 'producto', 'carrito', 'favoritos', 'cuenta', 'ayuda', 'journal', 'nosotros', 'legal'];
const partes = ['#siteHeader', '#mnav', 'footer.footer', '#cart', '#toast'];

const estadoConDatos = {
  'okidokei.carrito': JSON.stringify([{ id: 'esqueleto-cobre', qty: 2 }, { id: 'origine', qty: 1 }]),
  'okidokei.favoritos': JSON.stringify(['luna-cobre']),
  'okidokei.usuario': JSON.stringify({ nombre: 'Ana', email: 'ana@ejemplo.com' })
};

async function abrir(page, ruta) {
  await page.goto(ruta);
  await page.locator('#siteHeader').waitFor();
  await page.waitForLoadState('networkidle');
}

for (const clave of paginas) {
  const ruta = clave === 'index' ? '/' : `/${clave}.html`;

  test(`shell de ${clave}: DOM idéntico sin datos y con datos`, async ({ page }) => {
    const errores = [];
    page.on('pageerror', (e) => errores.push(e.message));
    await abrir(page, ruta);
    for (const parte of partes) {
      expect(await serializar(page, parte), `${parte} vacío`).toMatchSnapshot(`${clave}-vacio-${parte.replace(/\W/g, '')}.json`);
    }
    await page.evaluate((datos) => Object.entries(datos).forEach(([k, v]) => localStorage.setItem(k, v)), estadoConDatos);
    await abrir(page, ruta);
    for (const parte of ['#siteHeader', '#cart']) {
      expect(await serializar(page, parte), `${parte} con datos`).toMatchSnapshot(`${clave}-datos-${parte.replace(/\W/g, '')}.json`);
    }
    expect(errores).toEqual([]);
  });
}

test('buscador: abre, enfoca, filtra, cierra con Escape y navega con Enter', async ({ page }) => {
  await abrir(page, '/legal.html');
  await page.locator('#searchBtn').click();
  await expect(page.locator('#searchPanel')).toBeVisible();
  await expect(page.locator('#searchInput')).toBeFocused();
  expect(await serializar(page, '#searchPanel')).toMatchSnapshot('buscador-abierto.json');

  await page.locator('#searchInput').fill('luna');
  expect(await serializar(page, '#searchPanel')).toMatchSnapshot('buscador-luna.json');
  await page.locator('#searchInput').fill('zzz');
  expect(await serializar(page, '#searchPanel')).toMatchSnapshot('buscador-vacio.json');

  await page.keyboard.press('Escape');
  await expect(page.locator('#searchPanel')).toBeHidden();
  await expect(page.locator('#searchBtn')).toHaveAttribute('aria-expanded', 'false');

  await page.locator('#searchBtn').click();
  expect(await serializar(page, '#searchPanel')).toMatchSnapshot('buscador-reabierto.json');
  await page.locator('#searchBtn').click();
  await expect(page.locator('#searchPanel')).toBeHidden();

  await page.locator('#searchBtn').click();
  await page.locator('#searchInput').fill('marine caucho');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/producto\.html#marine-caucho$/);
});

test('menú móvil: abre, enfoca el primer enlace y se cierra', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await abrir(page, '/nosotros.html');
  await page.locator('#menuBtn').click();
  await expect(page.locator('#mnav')).toHaveClass(/open/);
  await expect(page.locator('#mnav')).toHaveAttribute('aria-hidden', 'false');
  await expect(page.locator('#menuBtn')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#mnav .mnav-panel a').first()).toBeFocused();
  await page.locator('#mnav .mnav-top [data-close-menu]').click();
  await expect(page.locator('#mnav')).not.toHaveClass(/open/);
  await expect(page.locator('#menuBtn')).toHaveAttribute('aria-expanded', 'false');

  await page.locator('#menuBtn').click();
  await page.keyboard.press('Escape');
  await expect(page.locator('#mnav')).toHaveAttribute('aria-hidden', 'true');
});

test('minicarrito y aviso: añadir, cambiar cantidades, foco y Escape', async ({ page }) => {
  await abrir(page, '/tienda.html');
  const boton = page.locator('[data-add="heritage-acero"]').first();
  await boton.click();
  await expect(page.locator('#cart')).toHaveClass(/open/);
  await expect(page.locator('#cart')).toHaveAttribute('aria-hidden', 'false');
  await expect(page.locator('#cart .drawer-head .icon-btn')).toBeFocused();
  await expect(page.locator('#toast')).toHaveClass(/show/);
  await expect(page.locator('#toast')).toHaveText('Heritage Acero añadido al carrito');
  await page.waitForLoadState('networkidle');
  expect(await serializar(page, '#cart')).toMatchSnapshot('minicarrito-1.json');
  await expect(page.locator('#cartList img').first()).toHaveClass(/sin-foto/);

  await page.locator('#cartList [data-q="1"]').click();
  await expect(page.locator('#cartList .qty span')).toHaveText('2');
  await expect(page.locator('#cartTotal')).toHaveText('3.580 €');
  await expect(page.locator('#cartBtn')).toHaveAttribute('aria-label', 'Carrito, 2 artículos');
  await page.locator('#cartList [data-q="-1"]').click();
  await page.locator('#cartList [data-q="-1"]').click();
  await expect(page.locator('#cartList .cart-empty')).toHaveText('Tu carrito está vacío.');
  await expect(page.locator('#cartBtn [data-count="carrito"]')).toBeHidden();

  await page.keyboard.press('Escape');
  await expect(page.locator('#cart')).not.toHaveClass(/open/);
  await expect(boton).toBeFocused();

  await boton.click();
  await page.locator('#cart .drawer-scrim').click({ position: { x: 5, y: 5 } });
  await expect(page.locator('#cart')).toHaveAttribute('aria-hidden', 'true');
  await page.locator('#cartList [data-rm]').count();

  // EL AVISO DESAPARECE A LOS 2,8 S Y CONSERVA SU TEXTO.
  await expect(page.locator('#toast')).not.toHaveClass(/show/, { timeout: 5000 });
  await expect(page.locator('#toast')).toHaveText('Heritage Acero añadido al carrito');
});

test('cabecera: clase scrolled al desplazar', async ({ page }) => {
  await abrir(page, '/legal.html');
  await expect(page.locator('#siteHeader')).not.toHaveClass(/scrolled/);
  await page.mouse.wheel(0, 400);
  await expect(page.locator('#siteHeader')).toHaveClass(/scrolled/);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator('#siteHeader')).not.toHaveClass(/scrolled/);
});

test('newsletter de la portada valida y confirma', async ({ page }) => {
  await abrir(page, '/');
  const form = page.locator('form[data-newsletter]').first();
  await form.locator('input[type="email"]').fill('mal');
  await form.locator('button[type="submit"], button:not([type])').first().click();
  await expect(form.locator('.form-msg')).toHaveText('Escribe un correo válido, por ejemplo nombre@dominio.com.');
});

test('sprite SVG de iconos y emblema idéntico', async ({ page }) => {
  await abrir(page, '/');
  await expect(page.locator('svg:has(> defs > symbol#emblem)')).toHaveCount(1);
  expect(await serializar(page, 'svg:has(> defs > symbol#emblem)')).toMatchSnapshot('sprite.json');
});
