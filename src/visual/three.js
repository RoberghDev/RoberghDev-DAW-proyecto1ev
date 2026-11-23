// CARGA LA COPIA LOCAL DE THREE.JS (public/js/vendor/three.min.js) UNA SOLA VEZ.
// Se mantiene como script clásico con el global THREE, igual que antes de la migración.
let promesaThree = null;

export function cargarThree() {
    if (window.THREE) return Promise.resolve(window.THREE);
    if (!promesaThree) {
        promesaThree = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = new URL('/js/vendor/three.min.js', window.location.href).href;
            script.async = false;
            script.onload = () => resolve(window.THREE);
            script.onerror = () => { promesaThree = null; reject(new Error('No se pudo cargar el script js/vendor/three.min.js')); };
            document.head.appendChild(script);
        });
    }
    return promesaThree;
}
