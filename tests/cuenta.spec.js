import { expect, test } from '@playwright/test';
import { abrir, serializar, vigilarErrores } from './utils/dom.js';

// PÁGINA DE CUENTA. Fijado con la versión heredada (cuenta.js) antes de migrarla.
// La API NO se llama de verdad: page.route simula sus respuestas y registra lo que se envía.

const almacen = (page, clave) => page.evaluate((c) => JSON.parse(localStorage.getItem('okidokei.' + c)), clave);

// SIMULA LOS ENDPOINTS DE LA API. Cada respuesta puede ser una función (peticion) => opciones de route.fulfill
// o 'abort' para un fallo de red. Devuelve la lista de peticiones recibidas.
async function simularApi(page, respuestas) {
  const peticiones = [];
  await page.route('**/api/usuarios/**', async (route) => {
    const endpoint = new URL(route.request().url()).pathname.split('/').pop();
    peticiones.push({ endpoint, metodo: route.request().method(), cuerpo: route.request().postDataJSON() });
    const respuesta = respuestas[endpoint];
    if (respuesta === 'abort') return route.abort('failed');
    const opciones = await respuesta(route.request());
    return route.fulfill(opciones);
  });
  return peticiones;
}

const json = (status, cuerpo) => ({ status, contentType: 'application/json', body: JSON.stringify(cuerpo) });
const texto = (status, cuerpo) => ({ status, contentType: 'text/plain', body: cuerpo });

function vigilarConsola(page) {
  const mensajes = [];
  page.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('Failed to load resource')) mensajes.push(m.text()); });
  return mensajes;
}

// LAS PESTAÑAS SOLO SE VEN EN MÓVIL; EN ESCRITORIO SE MUESTRAN LOS DOS FORMULARIOS.
test('cuenta: pestañas de entrar y crear cuenta (móvil)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await abrir(page, '/cuenta.html');
  await expect(page.locator('#formRegistro')).toBeHidden();
  await page.locator('[data-tab-cuenta="formRegistro"]').click();
  expect(await serializar(page, '#accountForms')).toMatchSnapshot('cuenta-pestana-registro.json');
  await page.locator('[data-tab-cuenta="formEntrar"]').click();
  await expect(page.locator('#formEntrar')).toHaveClass(/is-active/);
  await expect(page.locator('[data-tab-cuenta="formEntrar"]')).toHaveAttribute('aria-selected', 'true');
});

test('cuenta: validaciones de inicio de sesión sin llamar a la API', async ({ page }) => {
  const peticiones = await simularApi(page, {});
  await abrir(page, '/cuenta.html');
  const form = page.locator('#formEntrar');
  const mensaje = form.locator('.form-msg');
  const entrar = form.locator('button[type="submit"]');

  await entrar.click();
  await expect(mensaje).toHaveText('Escribe tu correo electrónico.');
  await page.locator('#entrarEmail').fill('  ana@ejemplo.es ');
  await entrar.click();
  await expect(mensaje).toHaveText('Escribe un correo válido terminado en .com.');
  await page.locator('#entrarEmail').fill('ana@ejemplo.COM');
  await page.locator('#entrarPass').fill('ab');
  await entrar.click();
  await expect(mensaje).toHaveText('La contraseña tiene al menos 6 caracteres.');
  expect(peticiones).toEqual([]);
});

test('cuenta: inicio de sesión correcto', async ({ page }) => {
  const errores = vigilarErrores(page);
  let liberar;
  const espera = new Promise((resolve) => { liberar = resolve; });
  const peticiones = await simularApi(page, { login: async () => { await espera; return json(200, { token: 'tok-123' }); } });
  await page.addInitScript(() => {
    if (sessionStorage.getItem('semilla')) return;
    sessionStorage.setItem('semilla', '1');
    localStorage.setItem('okidokei.favoritos', '["origine"]');
    localStorage.setItem('okidokei.carrito', '[{"id":"luna-acero","qty":3}]');
  });
  await abrir(page, '/cuenta.html');
  await page.locator('#entrarEmail').fill(' ana@ejemplo.com ');
  await page.locator('#entrarPass').fill(' abc ');
  await page.locator('#formEntrar button[type="submit"]').click();
  await expect(page.locator('#formEntrar .form-msg')).toHaveText('Iniciando sesión…');
  await expect(page.locator('#formEntrar button[type="submit"]')).toBeDisabled();
  liberar();

  await expect(page.locator('#toast')).toHaveText('Hola de nuevo, ana@ejemplo.com');
  await expect(page.locator('#accountPanel')).toBeVisible();
  await expect(page.locator('#accountForms')).toBeHidden();
  await expect(page.locator('#formEntrar button[type="submit"]')).toBeEnabled();
  expect(peticiones).toEqual([{ endpoint: 'login', metodo: 'POST', cuerpo: { email: 'ana@ejemplo.com', password: ' abc ' } }]);
  expect(await almacen(page, 'token')).toBe('tok-123');
  expect(await almacen(page, 'usuario')).toEqual({ nombre: 'ana@ejemplo.com', email: 'ana@ejemplo.com' });
  expect(await serializar(page, 'main')).toMatchSnapshot('cuenta-tras-login.json');
  // LA CABECERA NO REFLEJA LA SESIÓN HASTA EL SIGUIENTE CAMBIO DE CARRITO/FAVORITOS O RECARGA.
  await expect(page.locator('#userBtn')).toHaveAttribute('aria-label', 'Mi cuenta');

  await page.locator('#logout').click();
  await expect(page.locator('#toast')).toHaveText('Has cerrado la sesión');
  await expect(page.locator('#accountForms')).toBeVisible();
  expect(await almacen(page, 'token')).toBeNull();
  expect(await almacen(page, 'usuario')).toBeNull();
  expect(await serializar(page, 'main')).toMatchSnapshot('cuenta-tras-logout.json');
  expect(errores).toEqual([]);
});

const erroresLogin = [
  ['401 con mensaje del servidor', () => json(401, { message: 'Usuario bloqueado' }), 'Usuario bloqueado'],
  ['401 sin cuerpo JSON', () => texto(401, 'no'), 'Correo electrónico o contraseña incorrectos.'],
  ['400', () => json(400, {}), 'Falta el correo electrónico o la contraseña.'],
  ['500', () => texto(500, ''), 'Error interno del servidor.'],
  ['418 desconocido', () => texto(418, ''), 'Error al iniciar sesión (418).'],
  ['200 sin token', () => json(200, { ok: true }), 'La API no devolvió el token de sesión esperado.'],
  ['fallo de red', 'abort', 'Failed to fetch']
];

for (const [nombre, respuesta, esperado] of erroresLogin) {
  test(`cuenta: error de login (${nombre})`, async ({ page }) => {
    const consola = vigilarConsola(page);
    await simularApi(page, { login: respuesta });
    await abrir(page, '/cuenta.html');
    await page.locator('#entrarEmail').fill('ana@ejemplo.com');
    await page.locator('#entrarPass').fill('secreto');
    await page.locator('#formEntrar button[type="submit"]').click();
    await expect(page.locator('#formEntrar .form-msg')).toHaveText(esperado);
    await expect(page.locator('#formEntrar button[type="submit"]')).toBeEnabled();
    expect(await almacen(page, 'token')).toBeNull();
    expect(consola.length).toBe(1);
    expect(consola[0]).toMatch(/^Error al registrar /);
  });
}

test('cuenta: validaciones de registro sin llamar a la API', async ({ page }) => {
  const peticiones = await simularApi(page, {});
  await abrir(page, '/cuenta.html');
  const mensaje = page.locator('#formRegistro .form-msg');
  const crear = page.locator('#formRegistro button[type="submit"]');

  await page.locator('#regNombre').fill(' A ');
  await crear.click();
  await expect(mensaje).toHaveText('Escribe tu nombre.');
  await page.locator('#regNombre').fill('Ana');
  await page.locator('#regEmail').fill('ana@ejemplo');
  await crear.click();
  await expect(mensaje).toHaveText('Escribe un correo válido, por ejemplo nombre@dominio.com.');
  await page.locator('#regEmail').fill('ana@ejemplo.es');
  await page.locator('#regPass').fill(' 12345 ');
  await crear.click();
  await expect(mensaje).toHaveText('La contraseña necesita al menos 6 caracteres.');
  await page.locator('#regPass').fill('123456');
  await page.locator('#regTelefono').fill('6000000');
  await crear.click();
  await expect(mensaje).toHaveText('Escribe un número de teléfono válido.');
  await page.locator('#regTelefono').fill(' 600000000 ');
  await crear.click();
  await expect(mensaje).toHaveText('Acepta la política de privacidad o pacto con el diablo para crear la cuenta.');
  expect(peticiones).toEqual([]);
});

test('cuenta: registro correcto (registro + login)', async ({ page }) => {
  const errores = vigilarErrores(page);
  const peticiones = await simularApi(page, {
    registro: () => texto(201, 'Usuario creado'),
    login: () => json(200, { token: 'tok-reg' })
  });
  await page.addInitScript(() => {
    if (sessionStorage.getItem('semilla')) return;
    sessionStorage.setItem('semilla', '1');
    localStorage.setItem('okidokei.cuentas', '{"luis@ejemplo.com":{"nombre":"Luis","email":"luis@ejemplo.com"}}');
  });
  await abrir(page, '/cuenta.html');
  await page.locator('#regNombre').fill(' Ana ');
  await page.locator('#regEmail').fill(' Ana@Ejemplo.es ');
  await page.locator('#regTelefono').fill('600000000');
  await page.locator('#regPass').fill(' secreto ');
  await page.locator('#regAcepto').check();
  await page.locator('#formRegistro button[type="submit"]').click();

  await expect(page.locator('#toast')).toHaveText('Cuenta creada. Bienvenido, Ana');
  expect(peticiones).toEqual([
    { endpoint: 'registro', metodo: 'POST', cuerpo: { nombreUsuario: 'Ana', password: 'secreto', email: 'Ana@Ejemplo.es', numTlf: '600000000', rol: 'USER' } },
    { endpoint: 'login', metodo: 'POST', cuerpo: { email: 'Ana@Ejemplo.es', password: 'secreto' } }
  ]);
  expect(await almacen(page, 'token')).toBe('tok-reg');
  expect(await almacen(page, 'usuario')).toEqual({ nombre: 'Ana', email: 'Ana@Ejemplo.es' });
  expect(await almacen(page, 'cuentas')).toEqual({
    'luis@ejemplo.com': { nombre: 'Luis', email: 'luis@ejemplo.com' },
    'ana@ejemplo.es': { nombre: 'Ana', email: 'Ana@Ejemplo.es' }
  });
  for (const campo of ['#regNombre', '#regEmail', '#regTelefono', '#regPass']) await expect(page.locator(campo)).toHaveValue('');
  await expect(page.locator('#regAcepto')).not.toBeChecked();
  expect(await serializar(page, 'main')).toMatchSnapshot('cuenta-tras-registro.json');
  expect(errores).toEqual([]);
});

test('cuenta: error en el registro', async ({ page }) => {
  const consola = vigilarConsola(page);
  const peticiones = await simularApi(page, { registro: () => texto(409, 'El correo ya está registrado') });
  await abrir(page, '/cuenta.html');
  await page.locator('#regNombre').fill('Ana');
  await page.locator('#regEmail').fill('ana@ejemplo.com');
  await page.locator('#regTelefono').fill('600000000');
  await page.locator('#regPass').fill('secreto');
  await page.locator('#regAcepto').check();
  await page.locator('#formRegistro button[type="submit"]').click();
  await expect(page.locator('#formRegistro .form-msg')).toHaveText('El correo ya está registrado');
  await expect(page.locator('#formRegistro button[type="submit"]')).toBeEnabled();
  await expect(page.locator('#regNombre')).toHaveValue('Ana');
  expect(peticiones.map((p) => p.endpoint)).toEqual(['registro']);
  expect(consola.length).toBe(1);
  expect(consola[0]).toMatch(/^Error al registrar usuario: /);
});
