import React, { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router';
import { useStore } from '../store.jsx';
import { aviso } from '../store/ui.js';
import { buscarProducto } from '../catalogo.js';
import { datosDeSesion } from '../sesion.js';
import { fechaCorta, textoEstado } from '../incidencias.js';
import IncidenciasModerador from '../components/IncidenciasModerador.jsx';
import { crearTicket, verMisTickets } from '../../services/api.js';

// PÁGINA DE INCIDENCIAS DE MANTENIMIENTO (/incidencias).
// Cada página exporta su título y su descripción (App.jsx los pone en el <head>)
// y, por defecto, el componente que se pinta.
export const title = 'OKIDOKEI · Incidencias';
export const description = 'Gestiona las incidencias de mantenimiento de tus relojes.';

// ─────────────────────────────────────────────────────────────────────────────
// PÁGINA: COMPRUEBA LA SESIÓN Y ELIGE QUÉ VISTA PINTAR SEGÚN EL ROL.
// Cada vista es un componente distinto con sus propios hooks; así ninguna tiene que
// preocuparse de los datos de la otra.
// ─────────────────────────────────────────────────────────────────────────────
export default function Incidencias() {
    const { user } = useStore();
    const sesion = datosDeSesion();

    // SIN SESIÓN (O CON UN TOKEN QUE NO SE PUEDE LEER): SE REDIRIGE AL LOGIN.
    if (!user || !sesion) return <Navigate to="/cuenta" replace state={{ desplazar: 'inicio' }} />;

    // MOD Y ADMIN VEN LA MISMA TABLA DE GESTIÓN; EL ADMIN, ADEMÁS, PUEDE ELIMINAR.
    const esAdmin = sesion.rol === 'ADMIN';
    const esModerador = sesion.rol === 'MOD' || esAdmin;

    return (
<main>
    <section className="page-hero">
        <div className="wrap">
            <nav className="crumbs" aria-label="Estás aquí"><a href="/">Inicio</a><span aria-hidden="true">/</span><span aria-current="page">Incidencias</span></nav>
            <p className="eyebrow">{esModerador ? 'Panel del taller' : 'Servicio de taller'}</p>
            <h1 className="page-title">Incidencias</h1>
            <p className="page-sub">{esModerador
                ? `Hola, ${user.nombre}. Revisa las incidencias de los clientes, asígnate las que vayas a atender y actualiza su estado${esAdmin ? ', o elimina las que ya no sirvan' : ''}.`
                : `Hola, ${user.nombre}. Comunica cualquier problema con tus relojes y sigue cómo avanza su reparación.`}</p>
        </div>
        <svg className="page-mark" aria-hidden="true"><use href="#emblem" /></svg>
    </section>

    <section className="section-dark section">
        {/* RENDERIZADO CONDICIONAL POR ROL: UNA VISTA U OTRA. */}
        {esModerador
            ? <div className="wrap"><IncidenciasModerador sesion={sesion} puedeEliminar={esAdmin} /></div>
            : <IncidenciasUsuario sesion={sesion} />}
    </section>
</main>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// VISTA DEL USUARIO (ROL USER): BOTÓN PARA CREAR + TABLA CON SUS INCIDENCIAS.
// ─────────────────────────────────────────────────────────────────────────────
function IncidenciasUsuario({ sesion }) {
    const { catalogo } = useStore();

    // ESTADO DE LA PÁGINA. Cada useState guarda un dato; al cambiarlo con su "set…",
    // React vuelve a ejecutar esta función y repinta lo que haya cambiado.
    const [incidencias, setIncidencias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    // ¿ESTÁ ABIERTO EL MODAL? EL BOTÓN LO PONE A true Y CERRARLO LO VUELVE A false.
    const [modalAbierto, setModalAbierto] = useState(false);
    // CONTADOR QUE SOLO SIRVE PARA PEDIR LA LISTA OTRA VEZ (SUBE AL CREAR UNA INCIDENCIA).
    const [recargas, setRecargas] = useState(0);

    // useEffect: CÓDIGO QUE SE EJECUTA DESPUÉS DE PINTAR. Aquí, pedir las incidencias a la API.
    // El array del final [sesion.token, recargas] dice CUÁNDO repetirlo: al entrar y cada vez que
    // cambie alguno de esos valores.
    useEffect(() => {
        let activo = true;
        setCargando(true);
        setError('');

        verMisTickets(sesion.token)
            .then((datos) => { if (activo) setIncidencias(datos); })
            .catch((errorCarga) => { if (activo) setError(errorCarga.message); })
            .finally(() => { if (activo) setCargando(false); });

        // ESTA FUNCIÓN SE EJECUTA AL SALIR DE LA PÁGINA O ANTES DE REPETIR EL EFECTO.
        return () => { activo = false; };
    }, [sesion.token, recargas]);

    function incidenciaCreada() {
        setModalAbierto(false);
        setRecargas((n) => n + 1);
    }

    return (
        <>
            <div className="wrap inc-grid">
                {/* LOS COMPONENTES SE USAN COMO ETIQUETAS. Lo que se les pasa (incidencias=…, cargando=…)
                    son sus "props": los parámetros que reciben. */}
                <PanelNuevaIncidencia alPulsar={() => setModalAbierto(true)} />
                <TablaIncidencias incidencias={incidencias} cargando={cargando} error={error} />
            </div>

            <ModalNuevaIncidencia abierto={modalAbierto} alCerrar={() => setModalAbierto(false)}>
                <FormularioIncidencia sesion={sesion} relojes={catalogo.productos} alCrear={incidenciaCreada} alCancelar={() => setModalAbierto(false)} />
            </ModalNuevaIncidencia>
        </>
    );
}

// BOTÓN PARA CREAR UNA NUEVA INCIDENCIA
function PanelNuevaIncidencia({ alPulsar }) {
    return (
        <div className="inc-box">
            <h2>¿Algún problema?</h2>
            <p>Si alguno de tus relojes necesita revisión, abre una incidencia y nuestro taller se encargará.</p>
            <button className="btn btn-copper" type="button" onClick={alPulsar}>Nueva incidencia</button>
        </div>
    );
}

// VENTANA EMERGENTE PARA CREAR UNA NUEVA INCIDENCIA
function ModalNuevaIncidencia({ abierto, alCerrar, children }) {
    const dialogo = useRef(null);

    useEffect(() => {
        if (abierto) dialogo.current.showModal();
        else dialogo.current.close();
    }, [abierto]);

    return (
        <dialog
            ref={dialogo}
            className="inc-modal"
            aria-labelledby="incModalTitulo"
            
            onClose={alCerrar}

            onClick={(evento) => { if (evento.target === dialogo.current) alCerrar(); }}
        >
            <div className="inc-modal-caja">
                <button className="icon-btn inc-modal-cerrar" type="button" aria-label="Cerrar" onClick={alCerrar}><svg className="icon" aria-hidden="true"><use href="#i-close" /></svg></button>
                {abierto && children}
            </div>
        </dialog>
    );
}

// FORMULARIO DEL MODAL
const LONGITUD_MINIMA = 10;

function FormularioIncidencia({ sesion, relojes, alCrear, alCancelar }) {
    // COMPONENTES CONTROLADOS: el valor de cada campo vive en el estado de React
    // (value={…}) y cada tecla lo actualiza (onChange). React siempre sabe qué hay escrito.
    const [idProducto, setIdProducto] = useState('');
    const [texto, setTexto] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [enviando, setEnviando] = useState(false);

    async function enviar(evento) {
        evento.preventDefault(); // EVITA QUE EL NAVEGADOR RECARGUE LA PÁGINA AL ENVIAR.

        if (!idProducto) { setMensaje('Elige el reloj que tiene el problema.'); return; }
        if (texto.trim().length < LONGITUD_MINIMA) { setMensaje(`Describe el problema con al menos ${LONGITUD_MINIMA} caracteres.`); return; }


        setEnviando(true);
        setMensaje('Enviando incidencia…');
        try {
            await crearTicket(sesion.token, sesion.id, idProducto, texto.trim());
            aviso('Incidencia enviada. Te avisaremos cuando el taller la revise.');
            // NO HACE FALTA VACIAR LOS CAMPOS: alCrear() CIERRA EL MODAL Y EL FORMULARIO DESAPARECE.
            alCrear();
        } catch (error) {
            setMensaje(error.message);
            setEnviando(false);
        }
    }

    return (
        <form className="inc-form" noValidate onSubmit={enviar}>
            <h2 id="incModalTitulo">Nueva incidencia</h2>
            <p>Cuéntanos qué le pasa a tu reloj y lo revisará nuestro taller.</p>
            <div className="field">
                <label htmlFor="incReloj">Reloj</label>
                <select className="select" id="incReloj" value={idProducto} onChange={(evento) => setIdProducto(evento.target.value)} disabled={relojes.length === 0}>
                    <option value="">{relojes.length === 0 ? 'Cargando relojes…' : 'Elige un reloj'}</option>
                    {relojes.map((reloj) => <option key={reloj.id} value={reloj.id}>{reloj.nombre}</option>)}
                </select>
            </div>
            <div className="field">
                <label htmlFor="incTexto">¿Qué le pasa?</label>
                <textarea className="textarea" id="incTexto" value={texto} onChange={(evento) => setTexto(evento.target.value)} placeholder="Por ejemplo: se retrasa varios minutos al día" maxLength={500} />
            </div>
            <p className="form-msg" role="status">{mensaje}</p>
            <div className="inc-form-botones">
                <button className="btn btn-ghost" type="button" onClick={alCancelar}>Cancelar</button>
                <button className="btn btn-copper" type="submit" disabled={enviando}>Enviar incidencia</button>
            </div>
        </form>
    );
}

// LISTA TODAS LAS INCIDENCIAS
//      - EL USUARIO VE TODAS SUS INCIDENCIAS
//      - EL MOD Y ADMIN VE TODAS LAS INCIDENCIAS
function TablaIncidencias({ incidencias, cargando, error }) {
    // LAS MÁS RECIENTES PRIMERO. Se copia con [...] porque sort() cambia el array original,
    // y en React los datos que llegan por props no se modifican.
    const ordenadas = [...incidencias].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const abiertas = incidencias.filter((ticket) => ticket.estado === 'abierto' || ticket.estado === 'en curso').length;

    // RENDERIZADO CONDICIONAL: SEGÚN EL CASO, SE DEVUELVE UNA COSA U OTRA.
    let contenido;
    if (cargando) contenido = <p className="inc-aviso">Cargando incidencias…</p>;
    else if (error) contenido = <p className="inc-aviso inc-error" role="alert">{error}</p>;
    else if (ordenadas.length === 0) contenido = <p className="inc-aviso">No hay incidencias abiertas</p>;
    else contenido = (
        <div className="inc-tabla-wrap">
            <table className="inc-tabla">
                <thead>
                    <tr><th scope="col">Reloj</th><th scope="col">Incidencia</th><th scope="col">Estado</th><th scope="col">Fecha</th></tr>
                </thead>
                <tbody>
                    {/* map() CONVIERTE CADA TICKET EN UNA FILA. "key" ES OBLIGATORIO EN LAS LISTAS:
                        un identificador único para que React sepa qué fila es cuál. */}
                    {ordenadas.map((ticket) => (
                        <tr key={ticket._id}>
                            <td>{buscarProducto(ticket.idProducto)?.nombre || 'Reloj no disponible'}</td>
                            <td>{ticket.incidencia}</td>
                            <td><span className="inc-estado" data-estado={ticket.estado}>{textoEstado(ticket.estado)}</span></td>
                            <td>{fechaCorta(ticket.createdAt)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="inc-box">
            <h2>Mis incidencias</h2>
            {!cargando && !error && incidencias.length > 0 && <p>{abiertas === 1 ? 'Tienes 1 incidencia abierta.' : `Tienes ${abiertas} incidencias abiertas.`}</p>}
            {contenido}
        </div>
    );
}

