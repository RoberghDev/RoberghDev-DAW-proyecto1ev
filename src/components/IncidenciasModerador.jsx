import React, { useEffect, useState } from 'react';
import { aviso } from '../store/ui.js';
import { buscarProducto } from '../catalogo.js';
import { ESTADOS_TICKET, fechaCorta, referenciaCorta } from '../incidencias.js';
import { editarUnTicket, eliminarTicket, verTodosLosTickets } from '../../services/api.js';

// VISTA DE GESTIÓN (ROLES MOD Y ADMIN): TABLA CON TODAS LAS INCIDENCIAS.
// Solo se pueden cambiar dos cosas: el estado (desplegable) y el responsable
// (botón para asignársela uno mismo). El resto de columnas son de solo lectura.
// Props:
// - sesion: { token, id, rol } de quien ha iniciado sesión.
// - puedeEliminar: true para el ADMIN; añade la columna con el botón "Eliminar".
//   "= false" es el valor por defecto si no se pasa la prop (el caso del MOD).
export default function IncidenciasModerador({ sesion, puedeEliminar = false }) {
    const [incidencias, setIncidencias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    // ID DE LA INCIDENCIA QUE SE ESTÁ GUARDANDO (PARA DESACTIVAR SU FILA MIENTRAS TANTO).
    const [guardando, setGuardando] = useState(null);

    useEffect(() => {
        let activo = true;
        verTodosLosTickets(sesion.token)
            .then((datos) => { if (activo) setIncidencias(datos); })
            .catch((errorCarga) => { if (activo) setError(errorCarga.message); })
            .finally(() => { if (activo) setCargando(false); });
        return () => { activo = false; };
    }, [sesion.token]);

    // GUARDA UN CAMBIO EN LA API Y, SI SALE BIEN, SUSTITUYE ESA FILA POR LA QUE DEVUELVE EL BACKEND.
    // Si falla, el estado de React no se toca, así que el desplegable vuelve solo a su valor anterior.
    async function guardarCambio(ticket, cambios, mensajeOk) {
        setGuardando(ticket._id);
        try {
            const actualizado = await editarUnTicket(sesion.token, ticket._id, cambios);
            // INMUTABILIDAD: NO SE MODIFICA EL ARRAY, SE CREA OTRO CON ESA FILA CAMBIADA.
            // Así React detecta el cambio y repinta.
            setIncidencias((anteriores) => anteriores.map((otro) => otro._id === actualizado._id ? actualizado : otro));
            aviso(mensajeOk);
        } catch (errorGuardado) {
            aviso(errorGuardado.message);
        } finally {
            setGuardando(null);
        }
    }

    const cambiarEstado = (ticket, estado) => guardarCambio(ticket, { estado }, 'Estado actualizado');
    // NO SE ENVÍA NINGÚN ID: EL BACKEND ASIGNA EL TICKET A QUIEN FIRMA EL TOKEN.
    const asignarme = (ticket) => guardarCambio(ticket, { asignarme: true }, 'Incidencia asignada a ti');

    // ELIMINA UNA INCIDENCIA. Como no se puede deshacer, primero se pide confirmación.
    async function eliminar(ticket) {
        // window.confirm ABRE UN CUADRO DEL NAVEGADOR CON "ACEPTAR" Y "CANCELAR" Y DEVUELVE true O false.
        if (!window.confirm(`¿Eliminar la incidencia ${referenciaCorta(ticket._id)}? No se puede deshacer.`)) return;
        setGuardando(ticket._id);
        try {
            await eliminarTicket(sesion.token, ticket._id);
            // filter() DEVUELVE UN ARRAY NUEVO SIN ESA FILA: OTRA VEZ, SIN MODIFICAR EL ORIGINAL.
            setIncidencias((anteriores) => anteriores.filter((otro) => otro._id !== ticket._id));
            aviso(`Incidencia ${referenciaCorta(ticket._id)} eliminada`);
        } catch (errorBorrado) {
            aviso(errorBorrado.message);
        } finally {
            setGuardando(null);
        }
    }

    const ordenadas = [...incidencias].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const sinAsignar = incidencias.filter((ticket) => !ticket.idModAsignado).length;

    let contenido;
    if (cargando) contenido = <p className="inc-aviso">Cargando incidencias…</p>;
    else if (error) contenido = <p className="inc-aviso inc-error" role="alert">{error}</p>;
    else if (ordenadas.length === 0) contenido = <p className="inc-aviso">No hay incidencias abiertas</p>;
    else contenido = (
        <div className="inc-tabla-wrap">
            <table className="inc-tabla">
                <thead>
                    <tr>
                        <th scope="col">Referencia</th>
                        <th scope="col">Cliente</th>
                        <th scope="col">Reloj</th>
                        <th scope="col">Problema descrito</th>
                        <th scope="col">Abierta el</th>
                        <th scope="col">Último cambio</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Responsable</th>
                        {/* LA COLUMNA SOLO EXISTE SI puedeEliminar ES true. */}
                        {puedeEliminar && <th scope="col"><span className="sr-only">Acciones</span></th>}
                    </tr>
                </thead>
                <tbody>
                    {ordenadas.map((ticket) => (
                        <FilaModerador
                            key={ticket._id}
                            ticket={ticket}
                            miId={sesion.id}
                            ocupada={guardando === ticket._id}
                            alCambiarEstado={(estado) => cambiarEstado(ticket, estado)}
                            alAsignarme={() => asignarme(ticket)}
                            // AL MOD NO SE LE PASA alEliminar (QUEDA undefined) Y LA FILA NO PINTA EL BOTÓN.
                            alEliminar={puedeEliminar ? () => eliminar(ticket) : undefined}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="inc-box">
            <h2>Todas las incidencias</h2>
            {!cargando && !error && incidencias.length > 0 && <p>{`${incidencias.length} en total · ${sinAsignar} sin responsable.`}</p>}
            {contenido}
        </div>
    );
}

// UNA FILA DE LA TABLA. Solo pinta y avisa: no llama a la API ni guarda estado.
function FilaModerador({ ticket, miId, ocupada, alCambiarEstado, alAsignarme, alEliminar }) {
    // idModAsignado PUEDE LLEGAR COMO TEXTO (EL ID) O, SI EL BACKEND HACE populate, COMO OBJETO.
    const idResponsable = ticket.idModAsignado?._id ?? ticket.idModAsignado;

    let responsable;
    if (!idResponsable) responsable = <button className="btn btn-outline inc-btn-mini" type="button" onClick={alAsignarme} disabled={ocupada}>Asignármela</button>;
    else if (String(idResponsable) === String(miId)) responsable = <span className="inc-tu">Tú</span>;
    else responsable = <span className="inc-otro">Otro moderador</span>;

    return (
        <tr aria-busy={ocupada}>
            <td className="inc-ref">{referenciaCorta(ticket._id)}</td>
            <td className="inc-ref">{referenciaCorta(ticket.idUsuario?._id ?? ticket.idUsuario)}</td>
            <td>{buscarProducto(ticket.idProducto)?.nombre || 'Reloj no disponible'}</td>
            <td>{ticket.incidencia}</td>
            <td>{fechaCorta(ticket.createdAt)}</td>
            <td>{fechaCorta(ticket.updatedAt)}</td>
            <td>
                {/* DESPLEGABLE CONTROLADO: value VIENE DEL TICKET. Al elegir otra opción no se cambia
                    aquí: se avisa con alCambiarEstado y, cuando el backend confirma, llega el ticket nuevo. */}
                <label className="sr-only" htmlFor={`estado-${ticket._id}`}>Estado de la incidencia {referenciaCorta(ticket._id)}</label>
                <select className="select inc-select" id={`estado-${ticket._id}`} value={ticket.estado} disabled={ocupada} onChange={(evento) => alCambiarEstado(evento.target.value)}>
                    {ESTADOS_TICKET.map((estado) => <option key={estado.valor} value={estado.valor}>{estado.texto}</option>)}
                </select>
            </td>
            <td>{responsable}</td>
            {alEliminar && (
                <td>
                    <button className="btn inc-btn-mini inc-btn-borrar" type="button" onClick={alEliminar} disabled={ocupada} aria-label={`Eliminar la incidencia ${referenciaCorta(ticket._id)}`}>Eliminar</button>
                </td>
            )}
        </tr>
    );
}
