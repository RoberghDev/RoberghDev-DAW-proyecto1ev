import { expect, test } from '@playwright/test';
import { abrir, rutaAntigua, serializar, vigilarErrores } from './utils/dom.js';

// PORTADA. Fijado con la versión heredada (plantilla index.html + comun.js + scripts 3D).
// El WebGL por software hace estas pruebas lentas: se triplica su tiempo límite.
test.slow();

const almacen = (page, clave) => page.evaluate((c) => JSON.parse(localStorage.getItem('okidokei.' + c)), clave);

// ESTADO VISIBLE DEL HERO (TEXTOS, ENLACES Y PESTAÑAS) TRAS CADA ACCIÓN.
async function estadoHero(page) {
  const estado = await page.evaluate(() => ({
    titulo: document.querySelector('#heroTitle').textContent,
    tituloLabel: document.querySelector('#heroTitle').getAttribute('aria-label'),
    sub: document.querySelector('#heroSub').innerHTML,
    explorar: document.querySelector('#heroExplore').getAttribute('href'),
    contador: document.querySelector('#heroCount').textContent,
    modelo: document.querySelector('#heroModel').getAttribute('href'),
    spec: document.querySelector('#heroSpec').textContent,
    precio: document.querySelector('#heroPrice').textContent,
    pestanas: [...document.querySelectorAll('.hero-tab')].map((t) => `${t.getAttribute('aria-selected')}/${t.getAttribute('tabindex')}`).join(' '),
    girar: document.querySelector('#spinBtn').getAttribute('aria-pressed')
  }));
  return { ...estado, explorar: rutaAntigua(estado.explorar), modelo: rutaAntigua(estado.modelo) };
}

test('inicio: el hero cambia de colección con pestañas, flechas y teclado', async ({ page }) => {
  const errores = vigilarErrores(page);
  await abrir(page, '/');
  const pasos = { inicio: await estadoHero(page) };
  await page.locator('.hero-tab[data-tab="2"]').click();
  await expect(page.locator('#heroTitle')).toHaveText('MARINE');
  pasos.pestana2 = await estadoHero(page);
  await page.locator('#nextBtn').click();
  await expect(page.locator('#heroTitle')).toHaveText('NOIR');
  pasos.siguiente = await estadoHero(page);
  await page.locator('#prevBtn').click();
  await page.locator('#prevBtn').click();
  await page.locator('#prevBtn').click();
  await expect(page.locator('#heroTitle')).toHaveText('ESQUELETO');
  await page.locator('#prevBtn').click();
  await expect(page.locator('#heroTitle')).toHaveText('ORIGINE');
  pasos.vueltaAtras = await estadoHero(page);
  await page.locator('.hero-tab[data-tab="5"]').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#heroTitle')).toHaveText('ESQUELETO');
  pasos.tecladoDerecha = await estadoHero(page);
  pasos.foco = await page.evaluate(() => document.activeElement.getAttribute('data-tab'));
  // CLIC FORZADO: CON EL 3D ANIMANDO SIN GPU, EL BOTÓN NUNCA SE DA POR «ESTABLE» A TIEMPO.
  await page.locator('#spinBtn').click({ force: true });
  await expect(page.locator('#spinBtn')).toHaveAttribute('aria-pressed', 'true');
  pasos.girar = await estadoHero(page);
  expect(JSON.stringify(pasos, null, 1)).toMatchSnapshot('inicio-hero-pasos.json');
  expect(errores).toEqual([]);
});

test('inicio: canvas 3D y de engranajes activos', async ({ page }) => {
  const errores = vigilarErrores(page);
  await abrir(page, '/');
  // UN CANVAS MIDE 300 PX POR DEFECTO: SUPERARLO INDICA QUE EL RENDERER YA AJUSTÓ SU TAMAÑO.
  await expect.poll(() => page.evaluate(() => document.querySelector('#hero3d').width), { timeout: 30_000 }).toBeGreaterThan(300);
  const estado = await page.evaluate(() => ({
    // EL CANVAS DEL HERO TIENE UN CONTEXTO WEBGL ACTIVO (ANTES SE COMPROBABA EL GLOBAL window.OKI3D).
    webgl: Boolean(document.querySelector('#hero3d').getContext('webgl2') || document.querySelector('#hero3d').getContext('webgl')),
    sinWebgl: document.documentElement.classList.contains('no-webgl'),
    heroCanvas: document.querySelector('#hero3d').width > 0,
    engranajes: document.querySelector('canvas[data-engranajes]').width > 0
  }));
  expect(estado).toEqual({ webgl: true, sinWebgl: false, heroCanvas: true, engranajes: true });
  expect(errores).toEqual([]);
});

test('inicio: destacados añaden al carrito y a favoritos', async ({ page }) => {
  const errores = vigilarErrores(page);
  await abrir(page, '/');
  await page.locator('.featured [data-fav="noir-caucho"]').click();
  await expect(page.locator('#toast')).toHaveText('Noir Caucho guardado en favoritos');
  await page.locator('.featured [data-add="marine-acero"]').click();
  await expect(page.locator('#toast')).toHaveText('Marine Acero añadido al carrito');
  await expect(page.locator('#cart')).toHaveClass(/open/);
  await page.keyboard.press('Escape');
  expect(await almacen(page, 'favoritos')).toEqual(['noir-caucho']);
  expect(await almacen(page, 'carrito')).toEqual([{ id: 'marine-acero', qty: 1 }]);
  expect(await serializar(page, '.featured')).toMatchSnapshot('inicio-destacados-tras-acciones.json');
  expect(errores).toEqual([]);
});
