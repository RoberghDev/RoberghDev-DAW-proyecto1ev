import { expect, test } from '@playwright/test';
import { vigilarErrores } from './utils/dom.js';

// FASE 5: SPA CON REACT ROUTER. Cada ruta funciona al cargarla directamente y al navegar dentro de la
// web; las URLs antiguas *.html se redirigen; navegar a otra página reinicia la interfaz como antes.

const rutas = [
  ['/', 'ESQUELETO', 'OKIDOKEI · Relojería online'],
  ['/tienda', 'Tienda', 'OKIDOKEI · Tienda'],
  ['/colecciones', 'Colecciones', 'OKIDOKEI · Colecciones'],
  ['/producto/luna-cobre', 'Luna Cobre', 'OKIDOKEI · Luna Cobre'],
  ['/producto', 'Esqueleto Cobre', 'OKIDOKEI · Esqueleto Cobre'],
  ['/carrito', 'Carrito', 'OKIDOKEI · Carrito'],
  ['/favoritos', 'Favoritos', 'OKIDOKEI · Favoritos'],
  ['/cuenta', 'Mi cuenta', 'OKIDOKEI · Mi cuenta'],
  ['/ayuda', 'Ayuda', 'OKIDOKEI · Ayuda'],
  ['/journal', 'Journal', 'OKIDOKEI · Journal'],
  ['/nosotros', 'Nosotros', 'OKIDOKEI · Nosotros'],
  ['/legal', 'Legal', 'OKIDOKEI · Legal']
];

for (const [ruta, titular, titulo] of rutas) {
  test(`carga directa de ${ruta}`, async ({ page }) => {
    const errores = vigilarErrores(page);
    await page.goto(ruta);
    await expect(page.locator('main h1').first()).toContainText(titular);
    await expect(page).toHaveTitle(titulo);
    await expect(page).toHaveURL(new RegExp(ruta.replace(/\//g, '\\/') + '$'));
    expect(errores).toEqual([]);
  });
}

const antiguas = [
  ['/index.html', '/'],
  ['/tienda.html', '/tienda'],
  ['/tienda.html#novedades', '/tienda#novedades'],
  ['/colecciones.html#luna', '/colecciones#luna'],
  ['/producto.html', '/producto'],
  ['/producto.html#origine', '/producto/origine'],
  ['/carrito.html', '/carrito'],
  ['/legal.html#cookies', '/legal#cookies'],
  ['/pagina-que-no-existe', '/'],
  ['/otra.html', '/'],
  ['/tienda/extra', '/']
];

test('las URLs antiguas y desconocidas tienen una redirección definida', async ({ page }) => {
  for (const [antigua, nueva] of antiguas) {
    await page.goto(antigua);
    await expect(page).toHaveURL(new RegExp(nueva.replace(/\//g, '\\/').replace('#', '\\#') + '$'));
    await expect(page.locator('main')).toBeVisible();
  }
  // LA REDIRECCIÓN NO DEJA LA URL ANTIGUA EN EL HISTORIAL.
  await page.goto('/');
  await page.goto('/tienda.html');
  await page.goBack();
  await expect(page).toHaveURL(/127\.0\.0\.1:\d+\/$/);
});

test('la navegación interna no recarga el documento y respeta atrás/adelante', async ({ page }) => {
  const errores = vigilarErrores(page);
  await page.goto('/');
  await page.evaluate(() => { window.__mismoDocumento = true; });
  const mismoDocumento = () => page.evaluate(() => window.__mismoDocumento === true);

  await page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Tienda' }).click();
  await expect(page).toHaveURL(/\/tienda$/);
  await expect(page.locator('main h1')).toHaveText('Tienda');
  await expect(page).toHaveTitle('OKIDOKEI · Tienda');

  await page.locator('#shopGrid .card-name a[href="/producto/noir-piel"]').click();
  await expect(page).toHaveURL(/\/producto\/noir-piel$/);
  await expect(page.locator('#pNombre')).toHaveText('Noir Piel');
  await page.locator('#pVariantes a[href="/producto/noir-caucho"]').click();
  await expect(page.locator('#pNombre')).toHaveText('Noir Caucho');

  await page.locator('footer a[href="/nosotros#taller"]').click();
  await expect(page).toHaveURL(/\/nosotros#taller$/);
  await expect(page.locator('#taller')).toBeInViewport();

  await page.locator('#searchBtn').click();
  await page.locator('#searchInput').fill('origine');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/producto\/origine$/);
  await expect(page).toHaveTitle('OKIDOKEI · Origine Tourbillon');

  await page.goBack();
  await expect(page).toHaveURL(/\/nosotros#taller$/);
  await page.goBack();
  await expect(page.locator('#pNombre')).toHaveText('Noir Caucho');
  await page.goBack();
  await expect(page.locator('#pNombre')).toHaveText('Noir Piel');
  await page.goForward();
  await expect(page.locator('#pNombre')).toHaveText('Noir Caucho');

  await page.locator('a.brand').first().click();
  await expect(page).toHaveURL(/127\.0\.0\.1:\d+\/$/);
  await expect(page.locator('#heroTitle')).toBeVisible();
  expect(await mismoDocumento()).toBe(true);
  expect(errores).toEqual([]);
});

test('ir a otra página reinicia la interfaz; cambiar solo el # no', async ({ page }) => {
  await page.goto('/tienda');
  await page.locator('#fCaja').selectOption('cobre');
  await expect(page.locator('#shopCount')).toHaveText('5 relojes');

  // ENLACE A /tienda#novedades DESDE LA TIENDA: SOLO CAMBIA EL FRAGMENTO → SE CONSERVA LA CAJA.
  await page.locator('footer a[href="/tienda#novedades"]').click();
  await expect(page.locator('#shopTitle')).toHaveText('Novedades');
  await expect(page.locator('#fCaja')).toHaveValue('cobre');
  await expect(page.locator('#shopCount')).toHaveText('2 relojes');

  // ENLACE A /tienda: EQUIVALE A CARGAR LA PÁGINA DE NUEVO → FILTROS INICIALES.
  await page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Tienda' }).click();
  await expect(page).toHaveURL(/\/tienda$/);
  await expect(page.locator('#fCaja')).toHaveValue('todas');
  await expect(page.locator('#shopCount')).toHaveText('12 relojes');

  // EL MINICARRITO ABIERTO SE CIERRA AL IR A OTRA PÁGINA, Y EL CARRITO SE CONSERVA.
  await page.locator('[data-add="origine"]').first().click();
  await expect(page.locator('#cart')).toHaveClass(/open/);
  await page.locator('#cart a[href="/carrito"]').click();
  await expect(page).toHaveURL(/\/carrito$/);
  await expect(page.locator('#cart')).not.toHaveClass(/open/);
  await expect(page.locator('#cartRows .row-item')).toHaveCount(1);
  await expect(page.locator('#cartBtn [data-count="carrito"]')).toHaveText('1');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

test('el menú móvil se cierra al navegar', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/legal');
  await page.locator('#menuBtn').click();
  await expect(page.locator('#mnav')).toHaveClass(/open/);
  await page.locator('#mnav .mnav-panel > a[href="/journal"]').click();
  await expect(page).toHaveURL(/\/journal$/);
  await expect(page.locator('#mnav')).not.toHaveClass(/open/);
  await expect(page.locator('#mnav .mnav-panel > a[href="/journal"]')).toHaveAttribute('aria-current', 'page');
});
