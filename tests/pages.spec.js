import { expect, test } from '@playwright/test';

const pages = [
  ['/', 'ESQUELETO'],
  ['/tienda.html', 'Tienda'],
  ['/colecciones.html', 'Colecciones'],
  ['/producto.html', 'Esqueleto Cobre'],
  ['/carrito.html', 'Carrito'],
  ['/favoritos.html', 'Favoritos'],
  ['/cuenta.html', 'Mi cuenta'],
  ['/ayuda.html', 'Ayuda'],
  ['/journal.html', 'Journal'],
  ['/nosotros.html', 'Nosotros'],
  ['/legal.html', 'Legal']
];

for (const [path, heading] of pages) {
  test(`${path} carga su contenido sin errores de JavaScript`, async ({ page }) => {
    const runtimeErrors = [];
    page.on('pageerror', (error) => runtimeErrors.push(error.message));

    await page.goto(path);
    await page.locator('#siteHeader').waitFor();
    await page.waitForLoadState('networkidle');

    await expect(page.locator('#siteHeader')).toBeVisible();
    await expect(page.locator('main h1').first()).toContainText(heading);
    await expect(page.locator('.react-migration-error')).toHaveCount(0);
    expect(runtimeErrors).toEqual([]);
  });
}

test('la vista React muestra sus componentes y conserva el modo al navegar', async ({ page }) => {
  const runtimeErrors = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));

  await page.goto('/index.html?react=1');
  await expect(page.locator('#siteHeader')).toBeVisible();
  await expect(page.locator('#heroTitle')).toBeVisible();
  await expect(page.locator('#legacy-page-content')).toHaveCount(0);

  await page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Tienda' }).click();
  await expect(page).toHaveURL(/tienda\.html\?react=1$/);
  await expect(page.locator('#legacy-page-content')).toHaveCount(0);
  await expect(page.locator('main h1').first()).toHaveText('Tienda');
  expect(runtimeErrors).toEqual([]);
});

// FALLO PREVIO (YA PRESENTE ANTES DE LA MIGRACIÓN): al abrir una URL con ancla, el navegador no
// desplaza hasta la sección porque el contenido lo pinta React después de cargar el documento.
// Se documenta su comportamiento actual para detectar cambios.
test('los enlaces con ancla abren la página correcta (sin desplazamiento: fallo previo)', async ({ page }) => {
  await page.goto('/index.html');
  await page.locator('footer a[href="legal.html#privacidad"]').click();
  await expect(page).toHaveURL(/legal\.html#privacidad$/);
  await expect(page.locator('#privacidad')).toBeAttached();
  await expect(page.locator('#privacidad')).not.toBeInViewport();
});
