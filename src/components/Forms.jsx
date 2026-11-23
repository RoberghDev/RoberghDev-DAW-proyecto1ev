import React, { useRef, useState } from 'react';

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// NEWSLETTER (PORTADA Y JOURNAL). Mismo HTML y validación que comun.js.
export function NewsletterForm() {
  const [message, setMessage] = useState('');
  const emailRef = useRef(null);
  const consentRef = useRef(null);
  function submit(event) {
    event.preventDefault();
    const email = emailRef.current;
    const consent = consentRef.current;
    if (!CORREO_VALIDO.test(email.value)) { setMessage('Escribe un correo válido, por ejemplo nombre@dominio.com.'); email.focus(); return; }
    if (!consent.checked) { setMessage('Marca la casilla de privacidad para suscribirte.'); consent.focus(); return; }
    setMessage(`¡Gracias! Te avisaremos de las novedades en ${email.value}.`);
    event.currentTarget.reset();
  }
  return <form className="news-form" data-newsletter="" noValidate onSubmit={submit}>
    <div className="news-row">
      <label className="sr-only" htmlFor="newsEmail">Correo electrónico</label>
      <input ref={emailRef} id="newsEmail" name="email" type="email" placeholder="Tu correo electrónico" autoComplete="email" required />
      <button className="btn btn-dark" type="submit">Suscribirme</button>
    </div>
    <label className="check" htmlFor="newsConsent"><input ref={consentRef} id="newsConsent" type="checkbox" required /> <span>Acepto recibir comunicaciones de OKIDOKEI y la <a href="legal.html#privacidad">política de privacidad</a>.</span></label>
    <p className="form-msg" role="status">{message}</p>
  </form>;
}

// CONTACTO (AYUDA). Mismo HTML y validación que public/js/ayuda.js.
export function ContactForm() {
  const [message, setMessage] = useState('');
  function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const campo = (id) => form.querySelector(`#${id}`);
    const name = campo('cNombre').value.trim();
    const email = campo('cEmail').value.trim();
    const note = campo('cMensaje').value.trim();
    if (name.length < 2) { setMessage('Escribe tu nombre.'); campo('cNombre').focus(); return; }
    if (!CORREO_VALIDO.test(email)) { setMessage('Escribe un correo válido para poder responderte.'); campo('cEmail').focus(); return; }
    if (note.length < 10) { setMessage('Cuéntanos un poco más en el mensaje.'); campo('cMensaje').focus(); return; }
    if (!campo('cAcepto').checked) { setMessage('Marca la casilla de privacidad para enviar el mensaje.'); return; }
    setMessage(`Gracias, ${name}. Hemos recibido tu mensaje y te responderemos en ${email}.`);
    form.reset();
  }
  return <form className="contact-form" id="contactForm" noValidate onSubmit={submit}>
    <div className="field"><label htmlFor="cNombre">Nombre</label><input className="input" id="cNombre" type="text" autoComplete="name" /></div>
    <div className="field"><label htmlFor="cEmail">Correo electrónico</label><input className="input" id="cEmail" type="email" autoComplete="email" /></div>
    <div className="field"><label htmlFor="cMotivo">Motivo</label><select className="select" id="cMotivo"><option>Elegir un reloj</option><option>Un pedido</option><option>Grabado o regalo</option><option>Revisión o reparación</option><option>Trabajar con nosotros</option><option>Otro</option></select></div>
    <div className="field"><label htmlFor="cPedido">Nº de pedido (opcional)</label><input className="input" id="cPedido" type="text" /></div>
    <div className="field full"><label htmlFor="cMensaje">Mensaje</label><textarea className="textarea" id="cMensaje" /></div>
    <label className="check full" htmlFor="cAcepto"><input type="checkbox" id="cAcepto" /> <span>He leído la <a href="legal.html#privacidad">política de privacidad</a>.</span></label>
    <button className="btn btn-copper" type="submit">Enviar mensaje</button>
    <p className="form-msg full" role="status">{message}</p>
  </form>;
}
