import React, { useEffect, useRef } from 'react';
import { iniciarEngranajes } from '../visual/engranajes.js';

// CANVAS ANIMADO DE ENGRANAJES DE LA PORTADA (antes public/js/engranajes.js).
export default function Engranajes() {
  const canvasRef = useRef(null);
  useEffect(() => iniciarEngranajes(canvasRef.current), []);
  return <canvas ref={canvasRef} data-engranajes="" role="img" aria-label="Animación de los engranajes de un movimiento mecánico"></canvas>;
}
