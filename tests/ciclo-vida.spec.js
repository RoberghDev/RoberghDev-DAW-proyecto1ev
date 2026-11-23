import { expect, test } from '@playwright/test';

// FASE 4: LOS EFECTOS VISUALES NO DEJAN ANIMACIONES, LISTENERS, OBSERVERS NI CONTEXTOS WEBGL VIVOS
// AL DESMONTARSE. Se montan y desmontan varias veces sobre una página sin animaciones propias.
test.slow();

test('hero 3D y engranajes liberan todo al desmontarse', async ({ page }) => {
  const errores = [];
  page.on('pageerror', (e) => errores.push(e.message));
  await page.addInitScript(() => {
    // ESPÍAS SOBRE LAS APIS DEL NAVEGADOR QUE USAN LOS EFECTOS.
    const espia = { raf: 0, contextos: [], observando: 0, desconectados: 0, docAlta: 0, docBaja: 0 };
    window.__espia = espia;
    const rafOriginal = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (fn) => { espia.raf++; return rafOriginal(fn); };
    const getContextOriginal = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (tipo, ...resto) {
      const ctx = getContextOriginal.call(this, tipo, ...resto);
      if (ctx && /webgl/.test(tipo) && !espia.contextos.includes(ctx)) espia.contextos.push(ctx);
      return ctx;
    };
    for (const Clase of ['ResizeObserver', 'IntersectionObserver']) {
      const Original = window[Clase];
      window[Clase] = class extends Original {
        observe(...a) { espia.observando++; return super.observe(...a); }
        disconnect() { espia.desconectados++; return super.disconnect(); }
      };
    }
    const altaOriginal = document.addEventListener.bind(document);
    document.addEventListener = (tipo, fn, opciones) => {
      if (tipo === 'visibilitychange') {
        espia.docAlta++;
        opciones?.signal?.addEventListener('abort', () => { espia.docBaja++; });
      }
      return altaOriginal(tipo, fn, opciones);
    };
  });
  await page.goto('/legal.html');
  await page.locator('#siteHeader').waitFor();

  const resultado = await page.evaluate(async () => {
    const { montar } = await import('/tests/utils/montar.js');
    const { default: HeroColecciones } = await import('/src/components/HeroColecciones.jsx');
    const { default: Engranajes } = await import('/src/components/Engranajes.jsx');
    const espia = window.__espia;
    const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
    const rondas = [];
    for (let i = 0; i < 3; i++) {
      const desmontarHero = montar(HeroColecciones);
      const desmontarEngranajes = montar(Engranajes);
      // ESPERA A QUE EL RENDERER EXISTA Y EL CARRUSEL ESTÉ ANIMANDO.
      for (let t = 0; t < 300 && !document.querySelector('#hero3d')?.width; t++) await esperar(100);
      for (let t = 0; t < 300; t++) { const antes = espia.raf; await esperar(200); if (espia.raf > antes + 2) break; }
      const rafAntes = espia.raf;
      await esperar(500);
      const animando = espia.raf > rafAntes;
      desmontarHero();
      desmontarEngranajes();
      await esperar(300);
      const rafTrasDesmontar = espia.raf;
      await esperar(1000);
      rondas.push({ animando, rafTrasDesmontar: espia.raf - rafTrasDesmontar });
    }
    return {
      rondas,
      contextos: espia.contextos.length,
      contextosVivos: espia.contextos.filter((gl) => !gl.isContextLost()).length,
      observersSinDesconectar: espia.observando - espia.desconectados,
      listenersDocumento: espia.docAlta - espia.docBaja,
      noWebgl: document.documentElement.classList.contains('no-webgl')
    };
  });

  expect(resultado.rondas).toEqual([
    { animando: true, rafTrasDesmontar: 0 },
    { animando: true, rafTrasDesmontar: 0 },
    { animando: true, rafTrasDesmontar: 0 }
  ]);
  expect(resultado.contextos).toBeGreaterThanOrEqual(3);
  expect(resultado.contextosVivos).toBe(0);
  expect(resultado.observersSinDesconectar).toBe(0);
  expect(resultado.listenersDocumento).toBe(0);
  expect(resultado.noWebgl).toBe(false);
  expect(errores).toEqual([]);
});
