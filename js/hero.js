(function () {
    'use strict';
    var hero = document.getElementById('inicio');
    if (!hero) return;

    var $ = OKI.$, $$ = OKI.$$;
    var N = COLECCIONES.length;
    var reduce = OKI.reduceMotion;
    var activo = 0;
    var motor = null;

    var tabs = $$('.hero-tab', hero), titulo = $('#heroTitle'), sub = $('#heroSub');
    var explorar = $('#heroExplore'), ficha = $('#heroModel');

    function pintarTitulo(txt, animar) {
        titulo.setAttribute('aria-label', txt.charAt(0) + txt.slice(1).toLowerCase());
        titulo.innerHTML = txt.split('').map(function (c, k) { return '<span aria-hidden="true" style="--d:' + (k * 45) + 'ms">' + c + '</span>'; }).join('');
        titulo.classList.remove('animate'); sub.classList.remove('animate');
        if (animar) { void titulo.offsetWidth; titulo.classList.add('animate'); sub.classList.add('animate'); }
    }

    function elegir(i, desde) {
        i = ((i % N) + N) % N;
        var cambia = i !== activo;
        activo = i;
        var c = COLECCIONES[i], p = buscarProducto(c.principal);
        tabs.forEach(function (t, k) { t.setAttribute('aria-selected', k === i ? 'true' : 'false'); t.tabIndex = k === i ? 0 : -1; });
        if (cambia) {
            pintarTitulo(c.titulo, true);
            sub.innerHTML = c.sub;
            $('#heroCount').textContent = ('0' + (i + 1)).slice(-2);
            $('#heroSpec').textContent = resumenProducto(p);
            $('#heroPrice').textContent = precioTexto(p.precio);
            explorar.href = 'colecciones.html#' + c.id;
            ficha.href = 'producto.html#' + p.id;
            if (desde !== '3d') tabs[i].parentNode.scrollTo({ left: tabs[i].offsetLeft - 40, behavior: 'smooth' });
        }
        if (desde !== '3d' && motor) motor.irA(i);
    }

    pintarTitulo(COLECCIONES[0].titulo, false);
    tabs.forEach(function (t, k) {
        t.addEventListener('click', function () { elegir(k, 'ui'); });
        t.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                var n = (k + (e.key === 'ArrowRight' ? 1 : -1) + N) % N;
                elegir(n, 'ui'); tabs[n].focus();
            }
        });
    });
    $('#prevBtn').addEventListener('click', function () { elegir(activo - 1, 'ui'); });
    $('#nextBtn').addEventListener('click', function () { elegir(activo + 1, 'ui'); });
    $('#spinBtn').addEventListener('click', function () {
        var on = this.getAttribute('aria-pressed') !== 'true';
        this.setAttribute('aria-pressed', on ? 'true' : 'false');
        if (motor) motor.girar360(on);
    });

    if (!window.OKI3D || !OKI3D.soportado()) {
        document.documentElement.classList.add('no-webgl');
        return;
    }
    motor = iniciar3D();

    function iniciar3D() {
        var THREE = window.THREE;
        var STEP = Math.PI * 2 / N, RADIO = 4.6;
        var canvas = $('#hero3d');
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
        var autoT = 0, ultimaAccion = -1e9, encima = false, modo360 = false, intro = reduce ? 1 : 0;
        var px = 0, py = 0, tpx = 0, tpy = 0, frente = 0;
        var progreso = $('#heroProgress');
        var mod = function (i) { return ((i % N) + N) % N; };

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

        OKI3D.fuentes.then(function () {
            scene.environment = OKI3D.entorno(renderer);
            OKI3D.luces(scene);
            var M = OKI3D.materiales();
            COLECCIONES.forEach(function (c, i) {
                var w = OKI3D.construir(OKI3D.config(c.principal), M), a = i * STEP;
                w.root.position.set(Math.sin(a) * RADIO, 0, Math.cos(a) * RADIO);
                w.root.rotation.y = a;
                w.root.traverse(function (o) { o.userData.index = i; });
                carrusel.add(w.root);
                relojes.push(w);
            });
            arrancar();
        });

        var W = 1, H = 1, D = 13, alturaCam = 1;
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
        new ResizeObserver(tamano).observe(hero);

        function irA(i) {
            var base = Math.round(objetivo), dif = mod(i - mod(base));
            if (dif > N / 2) dif -= N;
            objetivo = base + dif;
            ultimaAccion = performance.now(); autoT = 0;
        }

        var ray = new THREE.Raycaster(), ndcV = new THREE.Vector2();
        function tocado(cx, cy) {
            var r = canvas.getBoundingClientRect();
            ndcV.set((cx - r.left) / r.width * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
            ray.setFromCamera(ndcV, camera);
            var hit = ray.intersectObjects(carrusel.children, true)[0];
            return hit ? hit.object.userData.index : -1;
        }
        canvas.addEventListener('pointerdown', function (e) {
            arrastrando = true; movido = 0; x0 = ultX = e.clientX; ultT = performance.now(); obj0 = objetivo; velArrastre = 0;
            canvas.setPointerCapture(e.pointerId); ultimaAccion = performance.now();
        });
        canvas.addEventListener('pointermove', function (e) {
            var r = canvas.getBoundingClientRect();
            tpx = (e.clientX - r.left) / r.width * 2 - 1; tpy = (e.clientY - r.top) / r.height * 2 - 1;
            if (arrastrando) {
                var dx = e.clientX - x0; movido = Math.max(movido, Math.abs(dx));
                objetivo = obj0 - dx / Math.max(260, W * 0.32);
                var ahora = performance.now(), dt = Math.max(1, ahora - ultT); velArrastre = (e.clientX - ultX) / dt; ultX = e.clientX; ultT = ahora;
                actual = objetivo; vel = 0;
            } else if (e.pointerType === 'mouse') {
                canvas.style.cursor = tocado(e.clientX, e.clientY) >= 0 ? 'pointer' : 'grab';
            }
        });
        canvas.addEventListener('pointerup', function (e) {
            if (!arrastrando) return; arrastrando = false;
            if (movido < 6) {
                var i = tocado(e.clientX, e.clientY);
                if (i >= 0 && i === frente) location.href = 'producto.html#' + COLECCIONES[i].principal;
                else if (i >= 0) elegir(i, 'ui');
                return;
            }
            objetivo = Math.round(objetivo - velArrastre * 0.9);
            ultimaAccion = performance.now(); autoT = 0;
        });
        canvas.addEventListener('pointercancel', function () { arrastrando = false; objetivo = Math.round(objetivo); });
        hero.addEventListener('pointerenter', function () { encima = true; });
        hero.addEventListener('pointerleave', function () { encima = false; tpx = 0; tpy = 0; });

        var visible = true, corriendo = false;
        new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) arrancar(); }, { threshold: 0.01 }).observe(hero);
        document.addEventListener('visibilitychange', arrancar);

        var reloj = new THREE.Clock();
        var suave = function (x) { return 1 - Math.pow(1 - x, 4); };
        function frame() {
            if (!visible || document.hidden) { corriendo = false; return; }
            requestAnimationFrame(frame);
            var dt = Math.min(reloj.getDelta(), 0.05), t = reloj.elapsedTime, ahora = performance.now();

            if (intro < 1) intro = Math.min(1, intro + dt / 2.8);
            var ie = suave(intro);

            if (!arrastrando) {
                var k = 30, c = 2 * Math.sqrt(k);
                vel += (k * (objetivo - actual) - c * vel) * dt; actual += vel * dt;
            }
            carrusel.rotation.y = -actual * STEP - (1 - ie) * Math.PI * 2;

            var f = mod(Math.round(arrastrando ? actual : objetivo));
            if (f !== frente) { frente = f; elegir(f, '3d'); }

            var quieto = !reduce && !arrastrando && !encima && !modo360 && ahora - ultimaAccion > 7000 && intro >= 1;
            if (quieto) { autoT += dt; if (autoT > 6) { autoT = 0; objetivo = Math.round(objetivo) + 1; } }
            progreso.style.transform = 'scaleX(' + Math.min(1, autoT / 6) + ')';

            px += (tpx - px) * Math.min(1, dt * 4); py += (tpy - py) * Math.min(1, dt * 4);
            var hora = OKI3D.horaActual();
            relojes.forEach(function (w, i) {
                var rel = i - actual; rel = ((rel % N) + N + N / 2) % N - N / 2;
                var fw = Math.max(0, 1 - Math.abs(rel));
                if (modo360 && i === frente && !arrastrando) w.spin += dt * 1.1;
                else { var meta = Math.round(w.spin / (Math.PI * 2)) * Math.PI * 2; w.spin += (meta - w.spin) * Math.min(1, dt * 3); }
                var vaiven = reduce ? 0 : Math.sin(t * 0.55 + i) * 0.16;
                w.body.rotation.y = fw * (vaiven + px * 0.32) + w.spin;
                w.body.rotation.x = fw * (py * 0.16 - 0.04);
                w.root.position.y = -(1 - ie) * (2.2 + i * 0.25) + (reduce ? 0 : Math.sin(t * 0.8 + i * 1.3) * 0.03);
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
        function arrancar() {
            if (corriendo || !visible || document.hidden || !relojes.length) return;
            corriendo = true; reloj.getDelta(); requestAnimationFrame(frame);
        }

        return {
            irA: irA,
            girar360: function (on) { modo360 = on; ultimaAccion = performance.now(); }
        };
    }
})();
