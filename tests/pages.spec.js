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

// ANCLAS: CON REACT ROUTER LA PÁGINA BAJA A LA SECCIÓN, TANTO AL NAVEGAR DESDE UN ENLACE COMO AL
// ABRIR LA URL DIRECTAMENTE (ANTES DE LA FASE 5 NO OCURRÍA: EL CONTENIDO SE PINTABA DESPUÉS DE CARGAR).
test('los enlaces con ancla llevan a su sección', async ({ page }) => {
  await page.goto('/');
  await page.locator('footer a[href="/legal#privacidad"]').click();
  await expect(page).toHaveURL(/\/legal#privacidad$/);
  await expect(page.locator('#privacidad')).toBeInViewport();

  await page.goto('/nosotros#taller');
  await expect(page.locator('#taller')).toBeInViewport();

  // URL ANTIGUA CON ANCLA: SE REDIRIGE Y TAMBIÉN BAJA A LA SECCIÓN.
  await page.goto('/ayuda.html#garantia');
  await expect(page).toHaveURL(/\/ayuda#garantia$/);
  await expect(page.locator('#garantia')).toBeInViewport();

  // ANCLA DENTRO DE LA MISMA PÁGINA.
  await page.goto('/colecciones');
  await page.locator('.subnav a[href="#luna"]').click();
  await expect(page).toHaveURL(/\/colecciones#luna$/);
  await expect(page.locator('#luna')).toBeInViewport();
});
