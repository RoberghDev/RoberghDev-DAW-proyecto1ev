import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { COLECCIONES, buscarProducto, precioTexto, resumenProducto } from '../data.js';
import { iniciarCarrusel3D } from '../visual/carrusel3d.js';
import { crearRelojes3D } from '../visual/relojes3d.js';
import { cargarThree } from '../visual/three.js';

// HERO DE LA PORTADA CON EL CARRUSEL 3D DE COLECCIONES (antes public/js/hero.js).
// Mismo HTML que la plantilla; la colección activa, las pestañas, los textos y el botón de giro
// son estado React, y el motor 3D se crea al montar y se destruye al desmontar.

const cantidadColecciones = COLECCIONES.length;
const normalizar = (indice) => ((indice % cantidadColecciones) + cantidadColecciones) % cantidadColecciones;
const dosCifras = (numero) => ('0' + numero).slice(-2);

function marcarSinWebgl() { document.documentElement.classList.add('no-webgl'); }

export default function HeroColecciones() {
  const [indice, setIndice] = useState(0);
  // HASTA LA PRIMERA SELECCIÓN, LAS PESTAÑAS CONSERVAN LOS tabindex INICIALES DE LA PLANTILLA.
  const [seleccionUsada, setSeleccionUsada] = useState(false);
  const [cambios, setCambios] = useState(0);
  const [giro, setGiro] = useState(false);
  const indiceRef = useRef(0);
  const motorRef = useRef(null);
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const progresoRef = useRef(null);
  const tituloRef = useRef(null);
  const subRef = useRef(null);
  const pestanasRef = useRef([]);
  const giroRef = useRef(false);
  giroRef.current = giro;

  // CAMBIA LA COLECCIÓN ACTIVA Y SINCRONIZA EL CONTENIDO Y EL CARRUSEL 3D.
  const elegir = useCallback((indiceColeccion, origen) => {
    indiceColeccion = normalizar(indiceColeccion);
    const cambiaSeleccion = indiceColeccion !== indiceRef.current;
    indiceRef.current = indiceColeccion;
    setSeleccionUsada(true);
    if (cambiaSeleccion) {
      setIndice(indiceColeccion);
      setCambios((n) => n + 1);
      const pestana = pestanasRef.current[indiceColeccion];
      if (origen !== '3d') pestana.parentNode.scrollTo({ left: pestana.offsetLeft - 40, behavior: 'smooth' });
    }
    if (origen !== '3d' && motorRef.current) motorRef.current.irA(indiceColeccion);
  }, []);
  const elegirRef = useRef(elegir);
  elegirRef.current = elegir;

  // REINICIA LA ANIMACIÓN DEL TÍTULO Y DEL SUBTÍTULO EN CADA CAMBIO DE COLECCIÓN.
  useLayoutEffect(() => {
    if (!cambios) return;
    const titulo = tituloRef.current, sub = subRef.current;
    titulo.classList.remove('animate'); sub.classList.remove('animate');
    void titulo.offsetWidth;
    titulo.classList.add('animate'); sub.classList.add('animate');
  }, [cambios]);

  // CREA EL MOTOR 3D (SI HAY WEBGL) Y LO LIBERA AL DESMONTAR.
  useEffect(() => {
    let cancelado = false, relojes3d = null, motor = null;
    cargarThree().then((THREE) => {
      if (cancelado) return;
      relojes3d = crearRelojes3D(THREE);
      if (!relojes3d.soportado()) { marcarSinWebgl(); return; }
      motor = iniciarCarrusel3D({
        THREE,
        relojes3d,
        hero: heroRef.current,
        canvas: canvasRef.current,
        progreso: progresoRef.current,
        reducirMovimiento: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        elegir: (indiceColeccion, origen) => elegirRef.current(indiceColeccion, origen)
      });
      motorRef.current = motor;
      // SI SE ELIGIÓ OTRA COLECCIÓN O SE ACTIVÓ EL GIRO ANTES DE QUE CARGARA THREE.JS, SE APLICA AHORA.
      if (motor && indiceRef.current !== 0) motor.irA(indiceRef.current);
      if (motor && giroRef.current) motor.girar360(true);
    }, () => { if (!cancelado) marcarSinWebgl(); });
    return () => {
      cancelado = true;
      motorRef.current = null;
      if (motor) motor.destruir();
      if (relojes3d) relojes3d.liberar();
    };
  }, []);
  const coleccion = COLECCIONES[indice];
  const principal = buscarProducto(coleccion.principal);
  const tabIndexDe = (i) => (seleccionUsada ? (i === indice ? 0 : -1) : (i === 0 ? undefined : -1));

  return (
    <section ref={heroRef} className="hero" id="inicio" aria-label="Colecciones OKIDOKEI">
        <canvas ref={canvasRef} id="hero3d" aria-hidden="true"></canvas>
        <svg className="hero-fallback" aria-hidden="true"><use href="#emblem" /></svg>
        <div className="hero-ui">
            <div className="tabs" role="tablist" aria-label="Colecciones">
                {COLECCIONES.map((item, i) => <button key={item.id} ref={(boton) => { pestanasRef.current[i] = boton; }} className="hero-tab" type="button" role="tab" aria-selected={String(i === indice)} tabIndex={tabIndexDe(i)} data-tab={i}
                    onClick={() => elegir(i, 'ui')}
                    onKeyDown={(evento) => {
                      // PERMITE CAMBIAR ENTRE PESTAÑAS CON LAS FLECHAS DEL TECLADO.
                      if (evento.key === 'ArrowRight' || evento.key === 'ArrowLeft') {
                        evento.preventDefault();
                        const siguiente = (i + (evento.key === 'ArrowRight' ? 1 : -1) + cantidadColecciones) % cantidadColecciones;
                        elegir(siguiente, 'ui'); pestanasRef.current[siguiente].focus();
                      }
                    }}>{item.nombre}</button>)}
            </div>
            <div className="hero-copy">
                <h1 ref={tituloRef} className="hero-title" id="heroTitle" aria-label={coleccion.titulo.charAt(0) + coleccion.titulo.slice(1).toLowerCase()}>{coleccion.titulo.split('').map((caracter, i) => <span key={`${coleccion.id}-${i}`} aria-hidden="true" style={{ '--d': `${i * 45}ms` }}>{caracter}</span>)}</h1>
                <p ref={subRef} className="hero-sub" id="heroSub" dangerouslySetInnerHTML={{ __html: coleccion.sub }}></p>
                <span className="hero-dash" aria-hidden="true"></span>
                <a className="btn btn-outline" id="heroExplore" href={`colecciones.html#${coleccion.id}`}>Explorar colección</a>
            </div>
        </div>
        <div className="hero-foot">
            <div className="counter"><strong id="heroCount">{dosCifras(indice + 1)}</strong><span className="progress" aria-hidden="true"><i ref={progresoRef} id="heroProgress"></i></span><span>06</span></div>
            <div className="drag-hint"><svg className="icon" aria-hidden="true"><use href="#i-drag" /></svg>Arrastra para girar</div>
            <div className="hero-actions">
                <a className="hero-model" id="heroModel" href={`producto.html#${principal.id}`}><span className="spec" id="heroSpec">{resumenProducto(principal)}</span><span className="price" id="heroPrice">{precioTexto(principal.precio)}</span></a>
                <button className="round-btn" id="spinBtn" type="button" aria-pressed={String(giro)} aria-label="Girar el reloj 360 grados" onClick={() => {
                  // ACTIVA O DESACTIVA EL GIRO CONTINUO DEL RELOJ SELECCIONADO.
                  const activo = !giro;
                  setGiro(activo);
                  if (motorRef.current) motorRef.current.girar360(activo);
                }}><svg className="icon" aria-hidden="true"><use href="#i-rotate" /></svg></button>
                <button className="round-btn" id="prevBtn" type="button" aria-label="Reloj anterior" onClick={() => elegir(indiceRef.current - 1, 'ui')}><svg className="icon" aria-hidden="true"><use href="#i-left" /></svg></button>
                <button className="round-btn" id="nextBtn" type="button" aria-label="Reloj siguiente" onClick={() => elegir(indiceRef.current + 1, 'ui')}><svg className="icon" aria-hidden="true"><use href="#i-right" /></svg></button>
            </div>
        </div>
    </section>
  );
}
