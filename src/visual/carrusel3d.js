import { COLECCIONES } from '../data.js';

// MOTOR DEL CARRUSEL 3D DE LA PORTADA (antes la función iniciar3D de public/js/hero.js).
// Mismos cálculos de cámara, arrastre, inercia, giro automático, polvo y animación de entrada.
// Diferencias: recibe sus dependencias (THREE, modelos, elementos del hero y las funciones elegir e
// irAProducto, que abre la ficha al pulsar el reloj frontal)
// y devuelve destruir() para no dejar animaciones, listeners ni recursos WebGL al desmontar.
// Devuelve null (y marca no-webgl) si no se puede crear el renderer, como hacía hero.js.
// CREA LA ESCENA 3D INTERACTIVA DEL CARRUSEL DE RELOJES.
export function iniciarCarrusel3D(opciones) {
    var THREE = opciones.THREE, modelos = opciones.relojes3d, hero = opciones.hero, canvas = opciones.canvas;
    var progreso = opciones.progreso, reducirMovimiento = opciones.reducirMovimiento, elegir = opciones.elegir, irAProducto = opciones.irAProducto;
    var cantidadColecciones = COLECCIONES.length;
    // TODO LO QUE SE REGISTRA AQUÍ SE RETIRA EN destruir().
    var controlador = new AbortController(), raf = 0, destruido = false;
    var escuchar = function (objetivo, tipo, funcion) { objetivo.addEventListener(tipo, funcion, { signal: controlador.signal }); };
    var STEP = Math.PI * 2 / cantidadColecciones, RADIO = 4.6;
    var renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' }); }
    catch (e) { document.documentElement.classList.add('no-webgl'); return null; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0x000000, 0);

    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0908, 14, 18);
    var camera = new THREE.PerspectiveCamera(28, 1, 0.1, 80);
    var carrusel = new THREE.Group(); carrusel.position.z = -RADIO; scene.add(carrusel);
    var relojes = [];

    var actual = 0, objetivo = 0, vel = 0, arrastrando = false, x0 = 0, obj0 = 0, ultX = 0, ultT = 0, velArrastre = 0, movido = 0;
    var autoT = 0, ultimaAccion = -1e9, encima = false, modo360 = false, intro = reducirMovimiento ? 1 : 0;
    var px = 0, py = 0, tpx = 0, tpy = 0, frente = 0;
    // NORMALIZA UN ÍNDICE PARA QUE PERMANEZCA DENTRO DEL CARRUSEL.
    var mod = function (i) { return ((i % cantidadColecciones) + cantidadColecciones) % cantidadColecciones; };

    var polvo = (function () {
        var n = 160, pos = new Float32Array(n * 3), semillas = [];
        for (var i = 0; i < n; i++) { pos[i * 3] = (Math.random() - 0.5) * 16; pos[i * 3 + 1] = (Math.random() - 0.4) * 9; pos[i * 3 + 2] = (Math.random() - 0.7) * 10; semillas.push(Math.random()); }
        var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        var spr = document.createElement('canvas'); spr.width = spr.height = 64; var c = spr.getContext('2d');
        var rg = c.createRadialGradient(32, 32, 0, 32, 32, 32); rg.addColorStop(0, 'rgba(255,214,180,1)'); rg.addColorStop(0.4, 'rgba(255,190,140,.35)'); rg.addColorStop(1, 'rgba(255,190,140,0)');
        c.fillStyle = rg; c.fillRect(0, 0, 64, 64);
        var tex = new THREE.CanvasTexture(spr); tex.colorSpace = THREE.SRGBColorSpace;
        var p = new THREE.Points(g, new THREE.PointsMaterial({ size: 0.07, map: tex, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
        p.userData.semillas = semillas; scene.add(p); return p;
    })();

    modelos.fuentes.then(function () {
        if (destruido) return;
        scene.environment = modelos.entorno(renderer);
        modelos.luces(scene);
        var M = modelos.materiales();
        COLECCIONES.forEach(function (coleccion, indiceColeccion) {
            var w = modelos.construir(modelos.config(coleccion.principal), M), a = indiceColeccion * STEP;
            w.root.position.set(Math.sin(a) * RADIO, 0, Math.cos(a) * RADIO);
            w.root.rotation.y = a;
            w.root.traverse(function (objeto) { objeto.userData.index = indiceColeccion; });
            carrusel.add(w.root);
            relojes.push(w);
        });
        arrancar();
    });

    var W = 1, H = 1, D = 13, alturaCam = 1;
    // AJUSTA EL RENDERER Y LA CÁMARA AL TAMAÑO DEL HERO.
    function tamano() {
        var r = hero.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height);
        renderer.setSize(W, H, false);
        var aspecto = W / H, tanH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        D = Math.max(13, 3.7 / (0.86 * 2 * tanH * aspecto));
        var ndc = aspecto < 0.9 ? -0.36 : -0.33;
        alturaCam = -ndc * D * tanH;
        camera.aspect = aspecto; camera.updateProjectionMatrix();
        scene.fog.near = D + 0.5; scene.fog.far = D + 3.9;
    }
    tamano();
    var observadorTamano = new ResizeObserver(tamano); observadorTamano.observe(hero);

    // DESPLAZA EL CARRUSEL HACIA LA COLECCIÓN INDICADA.
    function irA(indiceColeccion) {
        var base = Math.round(objetivo), dif = mod(indiceColeccion - mod(base));
        if (dif > cantidadColecciones / 2) dif -= cantidadColecciones;
        objetivo = base + dif;
        ultimaAccion = performance.now(); autoT = 0;
    }

    var ray = new THREE.Raycaster(), ndcV = new THREE.Vector2();
    // DEVUELVE EL ÍNDICE DEL RELOJ BAJO LAS COORDENADAS INDICADAS.
    function tocado(coordenadaX, coordenadaY) {
        var r = canvas.getBoundingClientRect();
        ndcV.set((coordenadaX - r.left) / r.width * 2 - 1, -((coordenadaY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(ndcV, camera);
        var hit = ray.intersectObjects(carrusel.children, true)[0];
        return hit ? hit.object.userData.index : -1;
    }
    // INICIA EL ARRASTRE DEL CARRUSEL AL PULSAR SOBRE EL CANVAS.
    escuchar(canvas, 'pointerdown', function (eventoPuntero) {
        arrastrando = true; movido = 0; x0 = ultX = eventoPuntero.clientX; ultT = performance.now(); obj0 = objetivo; velArrastre = 0;
        canvas.setPointerCapture(eventoPuntero.pointerId); ultimaAccion = performance.now();
    });
    // ACTUALIZA LA ROTACIÓN DEL CARRUSEL Y EL SEGUIMIENTO DEL PUNTERO.
    escuchar(canvas, 'pointermove', function (eventoPuntero) {
        var r = canvas.getBoundingClientRect();
        tpx = (eventoPuntero.clientX - r.left) / r.width * 2 - 1; tpy = (eventoPuntero.clientY - r.top) / r.height * 2 - 1;
        if (arrastrando) {
            var dx = eventoPuntero.clientX - x0; movido = Math.max(movido, Math.abs(dx));
            objetivo = obj0 - dx / Math.max(260, W * 0.32);
            var ahora = performance.now(), dt = Math.max(1, ahora - ultT); velArrastre = (eventoPuntero.clientX - ultX) / dt; ultX = eventoPuntero.clientX; ultT = ahora;
            actual = objetivo; vel = 0;
        } else if (eventoPuntero.pointerType === 'mouse') {
            canvas.style.cursor = tocado(eventoPuntero.clientX, eventoPuntero.clientY) >= 0 ? 'pointer' : 'grab';
        }
    });
    // FINALIZA EL ARRASTRE O ABRE EL PRODUCTO AL HACER CLIC EN UN RELOJ.
    escuchar(canvas, 'pointerup', function (eventoPuntero) {
        if (!arrastrando) return; arrastrando = false;
        if (movido < 6) {
            var indiceTocado = tocado(eventoPuntero.clientX, eventoPuntero.clientY);
            if (indiceTocado >= 0 && indiceTocado === frente) irAProducto(COLECCIONES[indiceTocado].principal);
            else if (indiceTocado >= 0) elegir(indiceTocado, 'ui');
            return;
        }
        objetivo = Math.round(objetivo - velArrastre * 0.9);
        ultimaAccion = performance.now(); autoT = 0;
    });
    // DETIENE EL ARRASTRE SI EL DISPOSITIVO CANCELA EL GESTO.
    escuchar(canvas, 'pointercancel', function () { arrastrando = false; objetivo = Math.round(objetivo); });
    // PAUSA LA ROTACIÓN AUTOMÁTICA MIENTRAS EL PUNTERO ESTÁ SOBRE EL HERO.
    escuchar(hero, 'pointerenter', function () { encima = true; });
    // REANUDA EL ESTADO DE REPOSO AL SALIR EL PUNTERO DEL HERO.
    escuchar(hero, 'pointerleave', function () { encima = false; tpx = 0; tpy = 0; });

    var visible = true, corriendo = false;
    // PAUSA O REANUDA EL RENDER SEGÚN LA VISIBILIDAD DEL HERO.
    var observadorVisibilidad = new IntersectionObserver(function (entradas) { visible = entradas[0].isIntersecting; if (visible) arrancar(); }, { threshold: 0.01 }); observadorVisibilidad.observe(hero);
    // REANUDA EL RENDER CUANDO CAMBIA LA VISIBILIDAD DE LA PESTAÑA.
    escuchar(document, 'visibilitychange', arrancar);

    var reloj = new THREE.Clock();
    // APLICA UNA CURVA DE SUAVIZADO A LA ANIMACIÓN DE ENTRADA.
    var suave = function (progreso) { return 1 - Math.pow(1 - progreso, 4); };
    // ACTUALIZA Y RENDERIZA UN FRAME DE LA ESCENA 3D.
    function frame() {
        if (destruido || !visible || document.hidden) { corriendo = false; return; }
        raf = requestAnimationFrame(frame);
        var dt = Math.min(reloj.getDelta(), 0.05), t = reloj.elapsedTime, ahora = performance.now();

        if (intro < 1) intro = Math.min(1, intro + dt / 2.8);
        var ie = suave(intro);

        if (!arrastrando) {
            var k = 30, c = 2 * Math.sqrt(k);
            vel += (k * (objetivo - actual) - c * vel) * dt; actual += vel * dt;
        }
        carrusel.rotation.y = -actual * STEP - (1 - ie) * Math.PI * 2;

        var indiceFrontal = mod(Math.round(arrastrando ? actual : objetivo));
        if (indiceFrontal !== frente) { frente = indiceFrontal; elegir(indiceFrontal, '3d'); }

        var quieto = !reducirMovimiento && !arrastrando && !encima && !modo360 && ahora - ultimaAccion > 7000 && intro >= 1;
        if (quieto) { autoT += dt; if (autoT > 6) { autoT = 0; objetivo = Math.round(objetivo) + 1; } }
        progreso.style.transform = 'scaleX(' + Math.min(1, autoT / 6) + ')';

        px += (tpx - px) * Math.min(1, dt * 4); py += (tpy - py) * Math.min(1, dt * 4);
        var hora = modelos.horaActual();
        relojes.forEach(function (w, indiceReloj) {
            var rel = indiceReloj - actual; rel = ((rel % cantidadColecciones) + cantidadColecciones + cantidadColecciones / 2) % cantidadColecciones - cantidadColecciones / 2;
            var fw = Math.max(0, 1 - Math.abs(rel));
            if (modo360 && indiceReloj === frente && !arrastrando) w.spin += dt * 1.1;
            else { var meta = Math.round(w.spin / (Math.PI * 2)) * Math.PI * 2; w.spin += (meta - w.spin) * Math.min(1, dt * 3); }
            var vaiven = reducirMovimiento ? 0 : Math.sin(t * 0.55 + indiceReloj) * 0.16;
            w.body.rotation.y = fw * (vaiven + px * 0.32) + w.spin;
            w.body.rotation.x = fw * (py * 0.16 - 0.04);
            w.root.position.y = -(1 - ie) * (2.2 + indiceReloj * 0.25) + (reducirMovimiento ? 0 : Math.sin(t * 0.8 + indiceReloj * 1.3) * 0.03);
            w.tick(t, hora);
        });
        var pos = polvo.geometry.attributes.position, sem = polvo.userData.semillas;
        for (var i = 0; i < sem.length; i++) { var y = pos.getY(i) + dt * (0.05 + sem[i] * 0.12); if (y > 5) y = -4; pos.setY(i, y); pos.setX(i, pos.getX(i) + Math.sin(t * 0.3 + sem[i] * 10) * dt * 0.03); }
        pos.needsUpdate = true;
        polvo.material.opacity = 0.55 * ie;

        camera.position.set(px * 0.35, alturaCam - py * 0.2, D + (1 - ie) * 6);
        camera.lookAt(px * 0.2, alturaCam, 0);
        renderer.render(scene, camera);
    }
    // INICIA EL BUCLE DE ANIMACIÓN SI LA ESCENA ESTÁ DISPONIBLE Y VISIBLE.
    function arrancar() {
        if (destruido || corriendo || !visible || document.hidden || !relojes.length) return;
        corriendo = true; reloj.getDelta(); raf = requestAnimationFrame(frame);
    }

    // DETIENE LA ANIMACIÓN, RETIRA LISTENERS Y OBSERVERS Y LIBERA LOS RECURSOS WEBGL.
    function destruir() {
        destruido = true;
        cancelAnimationFrame(raf);
        controlador.abort();
        observadorTamano.disconnect();
        observadorVisibilidad.disconnect();
        scene.traverse(function (objeto) {
            if (objeto.geometry) objeto.geometry.dispose();
            if (objeto.material) [].concat(objeto.material).forEach(function (material) { if (material.map) material.map.dispose(); material.dispose(); });
        });
        if (scene.environment) scene.environment.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
    }

    return {
        irA: irA,
        girar360: function (giroContinuoActivo) { modo360 = giroContinuoActivo; ultimaAccion = performance.now(); },
        destruir: destruir
    };
}
