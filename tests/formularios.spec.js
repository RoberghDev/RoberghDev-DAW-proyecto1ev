import { expect, test } from '@playwright/test';
import { abrir, serializar, vigilarErrores } from './utils/dom.js';

// COMPORTAMIENTO DE LOS FORMULARIOS DE NEWSLETTER Y CONTACTO.
// Fijado con la versión heredada (comun.js y ayuda.js) antes de migrarlos a React.

for (const [nombre, ruta] of [['journal', '/journal.html'], ['index', '/']]) {
  test(`newsletter de ${nombre}: validación, foco, confirmación y reseteo`, async ({ page }) => {
    const errores = vigilarErrores(page);
    await abrir(page, ruta);
    const form = page.locator('form[data-newsletter]');
    const correo = form.locator('#newsEmail');
    const casilla = form.locator('#newsConsent');
    const mensaje = form.locator('.form-msg');
    const enviar = form.locator('button[type="submit"]');

    await enviar.click();
    await expect(mensaje).toHaveText('Escribe un correo válido, por ejemplo nombre@dominio.com.');
    await expect(correo).toBeFocused();

    await correo.fill('ana@ejemplo');
    await enviar.click();
    await expect(mensaje).toHaveText('Escribe un correo válido, por ejemplo nombre@dominio.com.');

    await correo.fill('ana@ejemplo.com');
    await enviar.click();
    await expect(mensaje).toHaveText('Marca la casilla de privacidad para suscribirte.');
    await expect(casilla).toBeFocused();
    expect(await serializar(page, 'form[data-newsletter]')).toMatchSnapshot(`newsletter-${nombre}-error.json`);

    await casilla.check();
    await correo.press('Enter');
    await expect(mensaje).toHaveText('¡Gracias! Te avisaremos de las novedades en ana@ejemplo.com.');
    await expect(correo).toHaveValue('');
    await expect(casilla).not.toBeChecked();
    expect(await serializar(page, 'form[data-newsletter]')).toMatchSnapshot(`newsletter-${nombre}-ok.json`);
    expect(errores).toEqual([]);
  });
}

test('contacto de ayuda: validaciones en orden, foco, confirmación y reseteo', async ({ page }) => {
  const errores = vigilarErrores(page);
  await abrir(page, '/ayuda.html');
  const form = page.locator('#contactForm');
  const mensaje = form.locator('.form-msg');
  const enviar = form.locator('button[type="submit"]');

  await page.locator('#cNombre').fill(' A ');
  await enviar.click();
  await expect(mensaje).toHaveText('Escribe tu nombre.');
  await expect(page.locator('#cNombre')).toBeFocused();

  await page.locator('#cNombre').fill('Ana');
  await page.locator('#cEmail').fill('ana@');
  await enviar.click();
  await expect(mensaje).toHaveText('Escribe un correo válido para poder responderte.');
  await expect(page.locator('#cEmail')).toBeFocused();

  await page.locator('#cEmail').fill('  ana@ejemplo.com ');
  await page.locator('#cMensaje').fill('Hola     ');
  await enviar.click();
  await expect(mensaje).toHaveText('Cuéntanos un poco más en el mensaje.');
  await expect(page.locator('#cMensaje')).toBeFocused();

  await page.locator('#cMensaje').fill('Quisiera grabar un reloj para regalo.');
  await page.locator('#cMotivo').selectOption('Grabado o regalo');
  await page.locator('#cPedido').fill('A-123');
  await enviar.click();
  await expect(mensaje).toHaveText('Marca la casilla de privacidad para enviar el mensaje.');
  // AQUÍ EL LEGADO NO MUEVE EL FOCO: SE QUEDA EN EL BOTÓN PULSADO.
  await expect(enviar).toBeFocused();
  expect(await serializar(page, '#contactForm')).toMatchSnapshot('contacto-error.json');

  await page.locator('#cAcepto').check();
  await enviar.click();
  await expect(mensaje).toHaveText('Gracias, Ana. Hemos recibido tu mensaje y te responderemos en ana@ejemplo.com.');
  for (const campo of ['#cNombre', '#cEmail', '#cPedido', '#cMensaje']) await expect(page.locator(campo)).toHaveValue('');
  await expect(page.locator('#cMotivo')).toHaveValue('Elegir un reloj');
  await expect(page.locator('#cAcepto')).not.toBeChecked();
  expect(await serializar(page, '#contactForm')).toMatchSnapshot('contacto-ok.json');
  expect(errores).toEqual([]);
});
