// MARCA LAS IMÁGENES QUE NO SE CARGAN Y LIMPIA ESA MARCA SI SE RECUPERAN
// (equivalente React de OKI.prepararFotos en public/js/comun.js).

function marcarImagenAusente(imagen) {
    imagen.classList.add('sin-foto');
    if (imagen.parentNode) imagen.parentNode.setAttribute('data-falta', imagen.getAttribute('src'));
}

export const eventosFoto = {
    // AL MONTARSE, COMO prepararFotos: SI LA IMAGEN YA CONSTA COMO TERMINADA Y SIN PÍXELES, SE MARCA.
    ref(imagen) {
        if (imagen && imagen.complete && imagen.naturalWidth === 0) marcarImagenAusente(imagen);
    },
    onError(event) {
        marcarImagenAusente(event.currentTarget);
    },
    onLoad(event) {
        const imagen = event.currentTarget;
        imagen.classList.remove('sin-foto');
        if (imagen.parentNode) imagen.parentNode.removeAttribute('data-falta');
    }
};
