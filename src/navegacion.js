import { createContext, useContext } from 'react';

// CONTEXTO CON LA FUNCIÓN navegar(destino) DEL LAYOUT (src/App.jsx), PARA LOS COMPONENTES QUE
// NAVEGAN SIN UN ENLACE (BUSCADOR CON ENTER, CLIC EN UN RELOJ DEL CARRUSEL 3D).
export const NavegacionContext = createContext(null);
export function useNavegar() { return useContext(NavegacionContext); }
