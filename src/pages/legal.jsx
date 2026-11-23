import React from 'react';
// Migrated from the original legal.html page markup.
export const title = 'OKIDOKEI · Legal';
export const description = 'Aviso legal, privacidad y cookies de OKIDOKEI.';
export default function Legal() {
  return (
<main>

    <section className={'page-hero'}>
        <div className={'wrap'}>
            <nav className={'crumbs'} aria-label={'Estás aquí'}><a href={'/'}>Inicio</a><span aria-hidden={'true'}>/</span><span aria-current={'page'}>Legal</span></nav>
            <p className={'eyebrow'}>Información legal</p>
            <h1 className={'page-title'}>Legal</h1>
            <p className={'page-sub'}>Aviso legal, política de privacidad y política de cookies.</p>
        </div>
        <svg className={'page-mark'} aria-hidden={'true'}><use href={'#emblem'} /></svg>
    </section>

    <div className={'on-light'}><div className={'wrap legal'}>
        <nav className={'legal-nav'} aria-label={'Textos legales'}><a href={'#aviso'}>Aviso legal</a><a href={'#privacidad'}>Privacidad</a><a href={'#cookies'}>Cookies</a></nav>
        <div>
            <section id={'aviso'} className={'prose'} aria-labelledby={'avisoTitle'}>
                <h2 id={'avisoTitle'}>Aviso legal y condiciones de compra</h2>
                <p className={'note'}>Texto orientativo. Sustituye los datos entre corchetes por los de tu empresa y revísalo con un profesional antes de publicar la web.</p>
                <p>En cumplimiento de la Ley 34/2002 de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), te informamos de que este sitio web pertenece a <strong>[Razón social]</strong>, con NIF <strong>[NIF]</strong> y domicilio en <strong>[Dirección completa]</strong>. Correo de contacto: <strong>[correo de la tienda]</strong>.</p>
                <h3>Compras</h3>
                <p>Los precios incluyen el IVA vigente. El contrato de compraventa se perfecciona cuando recibes la confirmación del pedido por correo electrónico. Tienes derecho a desistir de la compra según lo explicado en <a href={'/ayuda#devoluciones'}>Devoluciones</a>.</p>
                <h3>Propiedad intelectual</h3>
                <p>La marca OKIDOKEI, su logotipo, los textos y los diseños de esta web pertenecen a [Razón social]. No se pueden reproducir sin autorización.</p>
            </section>
            <section id={'privacidad'} className={'prose'} aria-labelledby={'privTitle'}>
                <h2 id={'privTitle'}>Política de privacidad</h2>
                <p>Tratamos tus datos conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018 (LOPDGDD).</p>
                <ul><li><strong>Responsable:</strong> [Razón social], [NIF].</li><li><strong>Finalidad:</strong> gestionar tus pedidos, responder a tus consultas y, si lo aceptas, enviarte la newsletter.</li><li><strong>Legitimación:</strong> la ejecución del contrato de compra y tu consentimiento.</li><li><strong>Conservación:</strong> el tiempo necesario para cumplir las obligaciones legales.</li><li><strong>Derechos:</strong> puedes acceder, rectificar, suprimir, oponerte y portar tus datos escribiendo a [correo de la tienda]. También puedes reclamar ante la Agencia Española de Protección de Datos.</li></ul>
            </section>
            <section id={'cookies'} className={'prose'} aria-labelledby={'cookTitle'}>
                <h2 id={'cookTitle'}>Política de cookies</h2>
                <p>Esta web no usa cookies de publicidad ni de analítica. Solo guarda en tu navegador (almacenamiento local) lo necesario para que funcione: tu carrito, tus favoritos y, si creas una cuenta, tu nombre y correo.</p>
                <p>Puedes borrar estos datos en cualquier momento desde la configuración de tu navegador. Si en el futuro añadimos herramientas de analítica o publicidad, te pediremos permiso antes con un aviso de cookies.</p>
            </section>
        </div>
    </div></div>

</main>
  );
}
