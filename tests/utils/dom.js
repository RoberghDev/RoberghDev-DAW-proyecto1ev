// UTILIDADES COMPARTIDAS POR LAS PRUEBAS DE PARIDAD DE LA MIGRACIÓN.

// SERIALIZA UN ELEMENTO A UN ÁRBOL COMPARABLE: ATRIBUTOS ORDENADOS Y TEXTO NORMALIZADO.
// Se ignoran la marca de foto ausente (depende del tiempo de carga) y el año del pie;
// el atributo style se compara por su valor CSS normalizado.
export async function serializar(page, selector) {
  return page.evaluate((sel) => {
    const raiz = document.querySelector(sel);
    if (!raiz) return null;
    const copia = raiz.cloneNode(true);
    copia.normalize();
    const nodo = (n) => {
      if (n.nodeType === 3) {
        const texto = n.textContent.replace(/\s+/g, ' ').trim();
        return texto || null;
      }
      if (n.nodeType !== 1) return null;
      const atributos = {};
      [...n.attributes]
        .filter((a) => a.name !== 'data-falta')
        // EL TAMAÑO DEL BÚFER DE LOS CANVAS LO FIJAN LOS SCRIPTS DE ANIMACIÓN SEGÚN EL MOMENTO DE CARGA.
        .filter((a) => !(n.tagName === 'CANVAS' && (a.name === 'width' || a.name === 'height')))
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((a) => {
          if (a.name === 'class') {
            // SIN LA MARCA sin-foto PUEDE QUEDAR UN class VACÍO: TAMBIÉN DEPENDE DEL MOMENTO DE CARGA.
            const clases = a.value.split(/\s+/).filter((c) => c && c !== 'sin-foto').join(' ');
            if (clases) atributos[a.name] = clases;
          }
          else if (a.name === 'style') atributos[a.name] = n.style.cssText;
          else atributos[a.name] = a.value;
        });
      const hijos = n.hasAttribute('data-year') ? ['<año>'] : [...n.childNodes].map(nodo).filter((x) => x !== null);
      return { t: n.tagName.toLowerCase(), a: atributos, c: hijos };
    };
    return JSON.stringify(nodo(copia), null, 1);
  }, selector);
}

// ESPERA A QUE LA PÁGINA ESTÉ MONTADA (CABECERA REACT) Y SIN PETICIONES PENDIENTES.
export async function abrir(page, ruta) {
  await page.goto(ruta);
  await page.locator('#siteHeader').waitFor();
  await page.locator('main').first().waitFor();
  await page.waitForLoadState('networkidle');
}

export function vigilarErrores(page) {
  const errores = [];
  page.on('pageerror', (error) => errores.push(error.message));
  return errores;
}

export const estadoConDatos = {
  'okidokei.carrito': JSON.stringify([{ id: 'esqueleto-cobre', qty: 2 }, { id: 'origine', qty: 1 }]),
  'okidokei.favoritos': JSON.stringify(['luna-cobre', 'marine-acero']),
  'okidokei.usuario': JSON.stringify({ nombre: 'Ana', email: 'ana@ejemplo.com' })
};
