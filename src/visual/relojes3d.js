import { buscarColeccion, buscarProducto } from '../data.js';
import { EMBLEMA } from '../components/emblema.js';

// MODELOS 3D DE LOS RELOJES (antes public/js/relojes3d.js, que se exponía como window.OKI3D).
// Los cálculos de geometría, texturas y animación son los mismos; cambia el empaquetado:
// recibe THREE, importa el catálogo y el emblema, y añade liberar() para soltar sus cachés
// de texturas y geometrías cuando se desmonta el carrusel.
export function crearRelojes3D(THREE) {

    var DIAL_R = 1.15;
    var EMBLEM = new Path2D(EMBLEMA);

    var soporte = null;
    function soportado() {
        if (soporte !== null) return soporte;
        try {
            var c = document.createElement('canvas'), gl = c.getContext('webgl2') || c.getContext('webgl');
            soporte = !!gl;
            // LIBERA EL CONTEXTO DE PRUEBA EN LUGAR DE DEJARLO VIVO HASTA LA RECOLECCIÓN.
            var perder = gl && gl.getExtension('WEBGL_lose_context');
            if (perder) perder.loseContext();
        }
        catch (e) { soporte = false; }
        if (!soporte) document.documentElement.classList.add('no-webgl');
        return soporte;
    }

    var fuentes = Promise.race([
        Promise.all(['500 64px Cinzel', '600 64px Cinzel', '500 32px Jost', '400 32px Jost'].map(function (f) { return document.fonts.load(f); })),
        new Promise(function (r) { setTimeout(r, 2500); })
    ]).catch(function () { });

    function config(idProducto) {
        var p = buscarProducto(idProducto); if (!p) return null;
        var c = buscarColeccion(p.coleccion);
        return Object.assign({ id: p.id }, c.modelo3d, p.modelo);
    }

    var TEX = {};
    function canvasTex(key, size, draw, opts) {
        opts = opts || {};
        if (TEX[key]) return TEX[key];
        var c = document.createElement('canvas'); c.width = c.height = size;
        draw(c.getContext('2d'), size);
        var t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 8;
        if (opts.repeatV) t.wrapT = THREE.RepeatWrapping;
        TEX[key] = t; return t;
    }
    function dialTex(key, draw, r) {
        r = r || DIAL_R;
        return canvasTex(key, 1024, function (ctx, S) { ctx.translate(S / 2, S / 2); draw(ctx, S / 2 / r, S); });
    }
    function cuGrad(ctx, u) {
        var g = ctx.createLinearGradient(-0.4 * u, -0.6 * u, 0.4 * u, 0.2 * u);
        g.addColorStop(0, '#f4cdab'); g.addColorStop(0.4, '#c3814f'); g.addColorStop(0.7, '#ebb58c'); g.addColorStop(1, '#94552f');
        return g;
    }
    function emblemAt(ctx, x, y, size, fill) {
        ctx.save(); ctx.translate(x - size / 2, y - size / 2); ctx.scale(size / 100, size / 100); ctx.fillStyle = fill; ctx.fill(EMBLEM, 'evenodd'); ctx.restore();
    }
    function text(ctx, str, x, y, font, fill, spacing) {
        ctx.font = font; ctx.fillStyle = fill; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        if (spacing && 'letterSpacing' in ctx) { ctx.letterSpacing = spacing + 'px'; ctx.fillText(str, x + spacing / 2, y); ctx.letterSpacing = '0px'; }
        else ctx.fillText(str, x, y);
    }
    function pol(r, a) { return [Math.sin(a) * r, -Math.cos(a) * r]; }
    function ticks(ctx, u, r0, r1, every, wMinor, wMajor, col, colMajor) {
        for (var i = 0; i < 60; i++) {
            var a = i / 60 * Math.PI * 2, major = i % every === 0;
            var p0 = pol(r0 * u - (major ? 0.02 * u : 0), a), p1 = pol(r1 * u, a);
            ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]);
            ctx.lineWidth = (major ? wMajor : wMinor) * u; ctx.strokeStyle = major ? colMajor : col; ctx.stroke();
        }
    }
    function sunburst(ctx, u, alpha) {
        if (!ctx.createConicGradient) return;
        var g = ctx.createConicGradient(0, 0, 0);
        for (var i = 0; i <= 96; i++) g.addColorStop(i / 96, i % 2 ? 'rgba(255,255,255,' + alpha + ')' : 'rgba(255,255,255,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 1.16 * u, 0, Math.PI * 2); ctx.fill();
    }
    function roman(ctx, u, list, r, font, fill, radial, maxW) {
        ctx.font = font; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = fill;
        list.forEach(function (n, i) {
            if (!n) return;
            var a = i * Math.PI / 6;
            ctx.save();
            if (radial) { ctx.rotate(a); ctx.translate(0, -r * u); }
            else { var p = pol(r * u, a); ctx.translate(p[0], p[1]); }
            var w = ctx.measureText(n).width;
            if (w > maxW * u) ctx.scale(maxW * u / w, 1);
            ctx.fillText(n, 0, 0);
            ctx.restore();
        });
    }
    var ROMAN = ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

    var DIALS = {
        heritage: function () {
            return dialTex('heritage', function (ctx, u) {
                var g = ctx.createRadialGradient(-0.25 * u, -0.35 * u, 0, 0, 0, 1.2 * u);
                g.addColorStop(0, '#fffdf9'); g.addColorStop(0.6, '#efe9df'); g.addColorStop(1, '#ddd4c6');
                ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 1.16 * u, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = '#26221f'; ctx.lineWidth = 0.006 * u;
                [1.0, 1.075].forEach(function (r) { ctx.beginPath(); ctx.arc(0, 0, r * u, 0, Math.PI * 2); ctx.stroke(); });
                ticks(ctx, u, 1.0, 1.075, 5, 0.006, 0.014, '#26221f', '#26221f');
                roman(ctx, u, ROMAN, 0.84, '500 ' + 0.16 * u + 'px Cinzel', '#1c1917', true, 0.3);
                emblemAt(ctx, 0, -0.48 * u, 0.14 * u, '#a5653f');
                text(ctx, 'OKIDOKEI', 0, -0.31 * u, '600 ' + 0.085 * u + 'px Cinzel', '#1c1917', 0.02 * u);
                text(ctx, 'AUTOMATIC', 0, 0.36 * u, '500 ' + 0.042 * u + 'px Jost', '#6b625a', 0.018 * u);
                text(ctx, 'OK-1101', 0, 0.44 * u, '400 ' + 0.032 * u + 'px Jost', '#8a8178', 0.01 * u);
            });
        },
        skeleton: function () {
            return dialTex('skeleton', function (ctx, u) {
                ctx.beginPath(); ctx.arc(0, 0, 1.15 * u, 0, Math.PI * 2); ctx.arc(0, 0, 0.86 * u, 0, Math.PI * 2, true); ctx.fillStyle = '#0d0d0e'; ctx.fill('evenodd');
                for (var r = 0.87; r < 1.15; r += 0.004) { ctx.beginPath(); ctx.arc(0, 0, r * u, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(255,255,255,' + (0.012 + Math.random() * 0.03) + ')'; ctx.lineWidth = 0.002 * u; ctx.stroke(); }
                ticks(ctx, u, 1.075, 1.13, 5, 0.005, 0.01, 'rgba(255,255,255,.75)', '#d9a07a');
                var list = ROMAN.map(function (n, i) { return i % 3 === 0 ? n : ''; });
                roman(ctx, u, list, 0.975, '600 ' + 0.12 * u + 'px Cinzel', cuGrad(ctx, u), false, 0.26);
                for (var i = 0; i < 12; i++) { if (i % 3 === 0) continue; ctx.save(); ctx.rotate(i * Math.PI / 6); ctx.fillStyle = cuGrad(ctx, u); ctx.fillRect(-0.012 * u, -1.03 * u, 0.024 * u, 0.12 * u); ctx.restore(); }
                ctx.beginPath(); ctx.arc(0, 0, 0.866 * u, 0, Math.PI * 2); ctx.strokeStyle = '#c98a5f'; ctx.lineWidth = 0.008 * u; ctx.stroke();
            });
        },
        marine: function () {
            return dialTex('marine', function (ctx, u) {
                var g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1.2 * u); g.addColorStop(0, '#1f1f20'); g.addColorStop(1, '#060606');
                ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 1.16 * u, 0, Math.PI * 2); ctx.fill();
                sunburst(ctx, u, 0.035);
                ticks(ctx, u, 1.04, 1.1, 5, 0.006, 0.012, 'rgba(255,255,255,.8)', '#ffffff');
                for (var i = 0; i < 12; i++) {
                    ctx.save(); ctx.rotate(i * Math.PI / 6);
                    ctx.fillStyle = '#f2efe6'; ctx.strokeStyle = '#b9b9b9'; ctx.lineWidth = 0.008 * u;
                    if (i === 0) { ctx.beginPath(); ctx.moveTo(-0.085 * u, -0.98 * u); ctx.lineTo(0.085 * u, -0.98 * u); ctx.lineTo(0, -0.76 * u); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#c98a5f'; ctx.stroke(); }
                    else if (i === 3) {  }
                    else if (i === 6 || i === 9) { ctx.beginPath(); ctx.rect(-0.045 * u, -0.97 * u, 0.09 * u, 0.22 * u); ctx.fill(); ctx.stroke(); }
                    else { ctx.beginPath(); ctx.arc(0, -0.875 * u, 0.068 * u, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
                    ctx.restore();
                }
                ctx.fillStyle = '#f7f5ef'; ctx.strokeStyle = '#c98a5f'; ctx.lineWidth = 0.01 * u;
                ctx.fillRect(0.66 * u, -0.085 * u, 0.22 * u, 0.17 * u); ctx.strokeRect(0.66 * u, -0.085 * u, 0.22 * u, 0.17 * u);
                text(ctx, String(new Date().getDate()), 0.77 * u, 0.005 * u, '500 ' + 0.12 * u + 'px Jost', '#111');
                emblemAt(ctx, 0, -0.52 * u, 0.12 * u, '#d08f63');
                text(ctx, 'OKIDOKEI', 0, -0.36 * u, '600 ' + 0.08 * u + 'px Cinzel', '#ffffff', 0.02 * u);
                text(ctx, 'MARINE', 0, 0.36 * u, '500 ' + 0.058 * u + 'px Jost', '#ffffff', 0.03 * u);
                text(ctx, '300 M · 1000 FT', 0, 0.46 * u, '400 ' + 0.04 * u + 'px Jost', '#d08f63', 0.012 * u);
            });
        },
        marineBezel: function () {
            return dialTex('marineBezel', function (ctx, u) {
                ctx.beginPath(); ctx.arc(0, 0, 1.48 * u, 0, Math.PI * 2); ctx.arc(0, 0, 1.24 * u, 0, Math.PI * 2, true); ctx.fillStyle = '#0b0b0b'; ctx.fill('evenodd');
                for (var i = 0; i < 60; i++) {
                    ctx.save(); ctx.rotate(i / 60 * Math.PI * 2);
                    if (i === 0) { ctx.beginPath(); ctx.moveTo(-0.075 * u, -1.45 * u); ctx.lineTo(0.075 * u, -1.45 * u); ctx.lineTo(0, -1.3 * u); ctx.closePath(); ctx.fillStyle = '#d4925f'; ctx.fill(); ctx.beginPath(); ctx.arc(0, -1.405 * u, 0.018 * u, 0, Math.PI * 2); ctx.fillStyle = '#f2efe6'; ctx.fill(); }
                    else if (i % 10 === 0) { text(ctx, String(i), 0, -1.36 * u, '500 ' + 0.1 * u + 'px Jost', '#f2efe6'); }
                    else if (i % 5 === 0) { ctx.fillStyle = '#f2efe6'; ctx.fillRect(-0.016 * u, -1.43 * u, 0.032 * u, 0.12 * u); }
                    else if (i < 15) { ctx.fillStyle = '#f2efe6'; ctx.fillRect(-0.006 * u, -1.43 * u, 0.012 * u, 0.06 * u); }
                    ctx.restore();
                }
            }, 1.48);
        },
        noir: function () {
            return dialTex('noir', function (ctx, u) {
                var g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1.2 * u); g.addColorStop(0, '#19191a'); g.addColorStop(1, '#040404');
                ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 1.16 * u, 0, Math.PI * 2); ctx.fill();
                sunburst(ctx, u, 0.045);
                ticks(ctx, u, 1.05, 1.1, 5, 0.005, 0.011, '#b97b52', '#e2a97f');
                ctx.beginPath(); ctx.arc(0, 0, 1.1 * u, 0, Math.PI * 2); ctx.strokeStyle = '#b97b52'; ctx.lineWidth = 0.005 * u; ctx.stroke();
                emblemAt(ctx, 0, -0.52 * u, 0.12 * u, cuGrad(ctx, u));
                text(ctx, 'OKIDOKEI', 0, -0.36 * u, '600 ' + 0.08 * u + 'px Cinzel', cuGrad(ctx, u), 0.02 * u);
                text(ctx, 'NOIR', 0, 0.38 * u, '500 ' + 0.055 * u + 'px Jost', '#d39468', 0.05 * u);
                text(ctx, 'AUTOMATIC', 0, 0.47 * u, '400 ' + 0.034 * u + 'px Jost', '#8b8580', 0.016 * u);
            });
        },
        luna: function () {
            return dialTex('luna', function (ctx, u) {
                var g = ctx.createRadialGradient(-0.25 * u, -0.35 * u, 0, 0, 0, 1.2 * u);
                g.addColorStop(0, '#fffefb'); g.addColorStop(0.6, '#f1ece4'); g.addColorStop(1, '#e0d8cc');
                ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 1.16 * u, 0, Math.PI * 2); ctx.fill();
                ticks(ctx, u, 1.05, 1.1, 5, 0.005, 0.011, '#2a2523', '#2a2523');
                emblemAt(ctx, 0, -0.5 * u, 0.12 * u, '#a5653f');
                text(ctx, 'OKIDOKEI', 0, -0.35 * u, '600 ' + 0.08 * u + 'px Cinzel', '#1c1917', 0.02 * u);
                text(ctx, 'FASE LUNAR', 0, 0.17 * u, '500 ' + 0.036 * u + 'px Jost', '#8f512e', 0.02 * u);
                var yb = 0.58 * u, ra = 0.3 * u;
                ctx.save(); ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath(); ctx.arc(0, yb, ra, Math.PI, Math.PI * 2); ctx.closePath(); ctx.fill(); ctx.restore();
                ctx.fillStyle = g;
                ctx.beginPath(); ctx.arc(-ra / 2, yb, ra / 2, Math.PI, Math.PI * 2); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.arc(ra / 2, yb, ra / 2, Math.PI, Math.PI * 2); ctx.closePath(); ctx.fill();
                ctx.strokeStyle = '#b7774f'; ctx.lineWidth = 0.008 * u;
                ctx.beginPath(); ctx.arc(0, yb, ra, Math.PI, Math.PI * 2); ctx.stroke();
                ctx.beginPath(); ctx.arc(-ra / 2, yb, ra / 2, Math.PI, Math.PI * 2); ctx.stroke();
                ctx.beginPath(); ctx.arc(ra / 2, yb, ra / 2, Math.PI, Math.PI * 2); ctx.stroke();
            });
        },
        origine: function () {
            return dialTex('origine', function (ctx, u) {
                ctx.fillStyle = '#0a0a0a'; ctx.beginPath(); ctx.arc(0, 0, 1.16 * u, 0, Math.PI * 2); ctx.fill();
                for (var r = 0.04; r < 1.04; r += 0.013) { ctx.beginPath(); ctx.arc(0, 0, r * u, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(255,255,255,.05)'; ctx.lineWidth = 0.004 * u; ctx.stroke(); }
                ticks(ctx, u, 1.05, 1.1, 5, 0.005, 0.011, '#b97b52', '#e2a97f');
                roman(ctx, u, ['XII', '', '', 'III', '', '', '', '', '', 'IX', '', ''], 0.86, '600 ' + 0.15 * u + 'px Cinzel', cuGrad(ctx, u), false, 0.34);
                emblemAt(ctx, 0, -0.6 * u, 0.1 * u, cuGrad(ctx, u));
                text(ctx, 'OKIDOKEI', 0, -0.46 * u, '600 ' + 0.07 * u + 'px Cinzel', cuGrad(ctx, u), 0.02 * u);
                text(ctx, 'TOURBILLON', 0, -0.36 * u, '500 ' + 0.034 * u + 'px Jost', '#a69f97', 0.02 * u);
                ctx.save(); ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath(); ctx.arc(0, 0.48 * u, 0.33 * u, 0, Math.PI * 2); ctx.fill(); ctx.restore();
                ctx.beginPath(); ctx.arc(0, 0.48 * u, 0.345 * u, 0, Math.PI * 2); ctx.strokeStyle = cuGrad(ctx, u); ctx.lineWidth = 0.03 * u; ctx.stroke();
                text(ctx, 'EDICIÓN LIMITADA · 100', 0, 0.93 * u, '500 ' + 0.03 * u + 'px Jost', '#a69f97', 0.012 * u);
            });
        }
    };

    function perlageTex() {
        return canvasTex('perlage', 512, function (ctx, S) {
            ctx.fillStyle = '#9a9a9c'; ctx.fillRect(0, 0, S, S);
            var s = 26;
            for (var y = -s, row = 0; y < S + s; y += s * 0.78, row++) for (var x = -s + (row % 2) * s * 0.5; x < S + s; x += s * 0.9) {
                var g = ctx.createRadialGradient(x - 4, y - 5, 0, x, y, s * 0.62);
                g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(0.55, 'rgba(255,255,255,.08)'); g.addColorStop(1, 'rgba(0,0,0,.35)');
                ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, s * 0.62, 0, Math.PI * 2); ctx.fill();
            }
        });
    }
    function barrelTex() {
        return canvasTex('barrel', 512, function (ctx, S) {
            ctx.translate(S / 2, S / 2);
            if (ctx.createConicGradient) { var g = ctx.createConicGradient(0.4, 0, 0); ['#5a5a5c', '#2c2c2e', '#6a6a6c', '#2a2a2c', '#5a5a5c'].forEach(function (c, i) { g.addColorStop(i / 4, c); }); ctx.fillStyle = g; } else ctx.fillStyle = '#444';
            ctx.beginPath(); ctx.arc(0, 0, S / 2, 0, Math.PI * 2); ctx.fill();
            for (var r = 10; r < S / 2; r += 3) { ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(255,255,255,' + Math.random() * 0.05 + ')'; ctx.stroke(); }
            var g2 = ctx.createLinearGradient(-S * 0.3, -S * 0.3, S * 0.3, S * 0.3);
            g2.addColorStop(0, '#ffdcc0'); g2.addColorStop(0.45, '#d08d60'); g2.addColorStop(1, '#a8673f');
            emblemAt(ctx, 0, 0, S * 0.78, g2);
            ctx.beginPath(); ctx.arc(0, 0, S / 2 - 6, 0, Math.PI * 2); ctx.strokeStyle = '#c98a5f'; ctx.lineWidth = 6; ctx.stroke();
        });
    }
    function moonTex() {
        return canvasTex('moon', 512, function (ctx, S) {
            ctx.translate(S / 2, S / 2);
            ctx.fillStyle = '#0b0b0e'; ctx.beginPath(); ctx.arc(0, 0, S / 2, 0, Math.PI * 2); ctx.fill();
            var seed = 7; var rnd = function () { return (seed = (seed * 16807) % 2147483647) / 2147483647; };
            for (var i = 0; i < 160; i++) { var a = rnd() * Math.PI * 2, r = rnd() * S * 0.48; ctx.fillStyle = 'rgba(255,248,236,' + (0.3 + rnd() * 0.6) + ')'; ctx.beginPath(); ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 0.6 + rnd() * 1.6, 0, Math.PI * 2); ctx.fill(); }
            var rho = 0.17 / 0.36 * S / 2, mr = 0.1 / 0.36 * S / 2;
            [-1, 1].forEach(function (sg) {
                var y = sg * rho, g = ctx.createRadialGradient(-mr * 0.3, y - mr * 0.3, 0, 0, y, mr);
                g.addColorStop(0, '#ffe2c8'); g.addColorStop(0.6, '#d9996c'); g.addColorStop(1, '#9a5a33');
                ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, y, mr, 0, Math.PI * 2); ctx.fill();
                [[0.3, -0.2, 0.18], [-0.35, 0.25, 0.14], [0.05, 0.4, 0.1]].forEach(function (c) { ctx.fillStyle = 'rgba(120,60,30,.22)'; ctx.beginPath(); ctx.arc(c[0] * mr, y + c[1] * mr, c[2] * mr, 0, Math.PI * 2); ctx.fill(); });
            });
        });
    }
    function leatherTex(color, stitch) {
        return canvasTex('leather' + color + stitch, 512, function (ctx, S) {
            ctx.fillStyle = color; ctx.fillRect(0, 0, S, S);
            var seed = 3; var rnd = function () { return (seed = (seed * 16807) % 2147483647) / 2147483647; };
            for (var i = 0; i < 9000; i++) { ctx.fillStyle = rnd() > 0.5 ? 'rgba(0,0,0,.14)' : 'rgba(255,255,255,.045)'; ctx.beginPath(); ctx.ellipse(rnd() * S, rnd() * S, 0.6 + rnd() * 1.8, 0.6 + rnd() * 1.4, rnd() * 3, 0, Math.PI * 2); ctx.fill(); }
            var e = ctx.createLinearGradient(0, 0, S, 0);
            e.addColorStop(0, 'rgba(0,0,0,.45)'); e.addColorStop(0.06, 'rgba(0,0,0,0)'); e.addColorStop(0.94, 'rgba(0,0,0,0)'); e.addColorStop(1, 'rgba(0,0,0,.45)');
            ctx.fillStyle = e; ctx.fillRect(0, 0, S, S);
            ctx.lineCap = 'round';
            [0.1, 0.9].forEach(function (fx) {
                for (var y = 8; y < S; y += 52) {
                    ctx.strokeStyle = 'rgba(0,0,0,.45)'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(fx * S, y + 2); ctx.lineTo(fx * S, y + 32); ctx.stroke();
                    ctx.strokeStyle = stitch; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(fx * S, y); ctx.lineTo(fx * S, y + 30); ctx.stroke();
                }
            });
        }, { repeatV: true });
    }
    function rubberTex() {
        return canvasTex('rubber', 512, function (ctx, S) {
            ctx.fillStyle = '#121212'; ctx.fillRect(0, 0, S, S);
            for (var y = 0; y < S; y += 64) { ctx.fillStyle = 'rgba(255,255,255,.05)'; ctx.fillRect(S * 0.18, y, S * 0.64, 20); ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(S * 0.18, y + 20, S * 0.64, 4); }
            var e = ctx.createLinearGradient(0, 0, S, 0);
            e.addColorStop(0, 'rgba(0,0,0,.5)'); e.addColorStop(0.08, 'rgba(0,0,0,0)'); e.addColorStop(0.92, 'rgba(0,0,0,0)'); e.addColorStop(1, 'rgba(0,0,0,.5)');
            ctx.fillStyle = e; ctx.fillRect(0, 0, S, S);
        }, { repeatV: true });
    }

    function materiales() {
        var P = function (o) { return new THREE.MeshPhysicalMaterial(o); };
        var m = {
            copper: P({ color: '#eaa77f', metalness: 1, roughness: 0.2 }),
            copperBrushed: P({ color: '#df9e75', metalness: 1, roughness: 0.36 }),
            steel: P({ color: '#e8eaec', metalness: 1, roughness: 0.18 }),
            steelBrushed: P({ color: '#d3d6d9', metalness: 1, roughness: 0.34 }),
            black: P({ color: '#38383b', metalness: 1, roughness: 0.3 }),
            blackPolish: P({ color: '#1b1b1d', metalness: 1, roughness: 0.12 }),
            ruthenium: P({ color: '#5a5a5d', metalness: 1, roughness: 0.3 }),
            inner: new THREE.MeshStandardMaterial({ color: '#0b0b0b', metalness: 0.6, roughness: 0.6 }),
            jewel: P({ color: '#a3102c', metalness: 0, roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.05, emissive: '#2a0006' }),
            glass: P({ color: '#ffffff', metalness: 0, roughness: 0.02, transparent: true, opacity: 0.1, depthWrite: false, clearcoat: 1, envMapIntensity: 2.2 }),
            lume: new THREE.MeshStandardMaterial({ color: '#f1eee4', roughness: 0.6, emissive: '#22211c' }),
            slot: new THREE.MeshStandardMaterial({ color: '#141414', roughness: 0.6 })
        };
        m.copperKnurl = m.copperBrushed.clone(); m.copperKnurl.flatShading = true;
        m.steelKnurl = m.steelBrushed.clone(); m.steelKnurl.flatShading = true;
        m.blackKnurl = m.black.clone(); m.blackKnurl.flatShading = true;
        var pt = perlageTex(); pt.repeat.set(1 / 1.8, 1 / 1.8); pt.offset.set(0.5, 0.5);
        m.plate = P({ color: '#77777a', metalness: 1, roughness: 0.42, map: pt });
        return m;
    }
    function entorno(renderer) {
        var s = new THREE.Scene();
        s.add(new THREE.Mesh(new THREE.BoxGeometry(40, 40, 40), new THREE.MeshBasicMaterial({ color: 0x060606, side: THREE.BackSide })));
        var add = function (w, h, pos, k, col) {
            var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(k), side: THREE.DoubleSide }));
            m.position.set(pos[0], pos[1], pos[2]); m.lookAt(0, 0, 0); s.add(m);
        };
        add(14, 4, [0, 11, 5], 5.5, '#ffffff');
        add(4, 16, [-12, 2, 4], 3.4, '#fff0e2');
        add(4, 16, [12, 1, 2], 2.4, '#ffffff');
        add(12, 3, [0, -8, 9], 0.9, '#ffffff');
        add(12, 12, [0, 3, -14], 0.9, '#ffcaa0');
        add(30, 3, [0, -10, 0], 0.5, '#b0754f');
        var pm = new THREE.PMREMGenerator(renderer);
        var tex = pm.fromScene(s, 0.035).texture; pm.dispose();
        return tex;
    }
    function luces(scene) {
        var key = new THREE.DirectionalLight(0xffffff, 1.5); key.position.set(-4, 6, 8); scene.add(key);
        var warm = new THREE.DirectionalLight(0xffc49a, 1.4); warm.position.set(7, 2, -2); scene.add(warm);
        var fill = new THREE.DirectionalLight(0xffffff, 0.3); fill.position.set(2, -5, 6); scene.add(fill);
    }

    var GEO = new Map();
    function cached(k, fn) { if (!GEO.has(k)) GEO.set(k, fn()); return GEO.get(k); }
    function mesh(g, m) { return new THREE.Mesh(g, m); }
    var PROFILES = {
        case: [[0, -0.42], [1.0, -0.42], [1.24, -0.39], [1.39, -0.32], [1.48, -0.21], [1.5, -0.08], [1.5, 0.08], [1.47, 0.145]],
        domed: [[1.47, 0.14], [1.51, 0.2], [1.5, 0.27], [1.44, 0.335], [1.32, 0.365], [1.21, 0.355], [1.15, 0.31], [1.11, 0.22], [1.08, 0.13]],
        thin: [[1.47, 0.14], [1.5, 0.19], [1.48, 0.25], [1.42, 0.28], [1.3, 0.288], [1.23, 0.275], [1.19, 0.21], [1.15, 0.13]],
        diver: [[1.47, 0.14], [1.53, 0.16], [1.535, 0.3], [1.5, 0.335], [1.25, 0.335], [1.22, 0.31], [1.19, 0.21], [1.15, 0.13]],
        stepped: [[1.47, 0.14], [1.51, 0.19], [1.51, 0.25], [1.43, 0.265], [1.41, 0.33], [1.29, 0.345], [1.22, 0.33], [1.18, 0.24], [1.14, 0.13]]
    };
    function lathe(name) {
        return cached('lathe-' + name, function () {
            var g = new THREE.LatheGeometry(PROFILES[name].map(function (p) { return new THREE.Vector2(p[0], p[1]); }), 128);
            g.rotateX(Math.PI / 2); return g;
        });
    }
    function lugGeo() {
        return cached('lug', function () {
            var s = new THREE.Shape();
            s.moveTo(1.05, -0.28);
            s.bezierCurveTo(1.45, -0.3, 1.75, -0.28, 1.97, -0.22);
            s.quadraticCurveTo(2.08, -0.19, 2.06, -0.08);
            s.bezierCurveTo(2.0, 0.06, 1.8, 0.14, 1.5, 0.16);
            s.lineTo(1.1, 0.16); s.closePath();
            var g = new THREE.ExtrudeGeometry(s, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3, curveSegments: 16 });
            g.translate(0, 0, -0.1);
            g.applyMatrix4(new THREE.Matrix4().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
            return g;
        });
    }
    function gearGeo(N, rp, m, spokes, depth) {
        return cached(['gear', N, rp, m, spokes, depth].join('-'), function () {
            var ra = rp + m * 0.95, rf = rp - m * 1.15, p = Math.PI * 2 / N;
            var s = new THREE.Shape();
            for (var k = 0; k < N; k++) {
                var a = k * p;
                [[rf, a - 0.31 * p], [ra, a - 0.15 * p], [ra, a + 0.15 * p], [rf, a + 0.31 * p]].forEach(function (pt, j) {
                    var x = Math.cos(pt[1]) * pt[0], y = Math.sin(pt[1]) * pt[0];
                    if (k === 0 && j === 0) s.moveTo(x, y); else s.lineTo(x, y);
                });
            }
            s.closePath();
            if (spokes) {
                var rIn = rf - Math.max(m * 2.2, rp * 0.13), hub = rp * 0.24, sw = rp * 0.07;
                for (var i = 0; i < spokes; i++) {
                    var a0 = i * 2 * Math.PI / spokes, a1 = (i + 1) * 2 * Math.PI / spokes;
                    var h = new THREE.Path();
                    h.absarc(0, 0, rIn, a0 + sw / rIn, a1 - sw / rIn, false);
                    h.absarc(0, 0, hub, a1 - sw / hub, a0 + sw / hub, true);
                    h.closePath(); s.holes.push(h);
                }
            }
            return new THREE.ExtrudeGeometry(s, { depth: depth, bevelEnabled: false, curveSegments: 10 });
        });
    }
    function capsuleShape(ax, ay, bx, by, r) {
        var a = Math.atan2(by - ay, bx - ax), s = new THREE.Shape();
        s.absarc(bx, by, r, a - Math.PI / 2, a + Math.PI / 2, false);
        s.absarc(ax, ay, r, a + Math.PI / 2, a + Math.PI * 1.5, false);
        s.closePath(); return s;
    }
    function bridgeGeo(key, segs, r, depth) {
        return cached('bridge-' + key, function () {
            return segs.map(function (sg, i) {
                var g = new THREE.ExtrudeGeometry(capsuleShape(sg[0][0], sg[0][1], sg[1][0], sg[1][1], r), { depth: depth, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2, curveSegments: 12 });
                g.translate(0, 0, i * 0.002); return g;
            });
        });
    }
    class Spiral extends THREE.Curve {
        constructor(r0, r1, turns) { super(); this.r0 = r0; this.r1 = r1; this.turns = turns; }
        getPoint(t, target) { target = target || new THREE.Vector3(); var r = this.r0 + (this.r1 - this.r0) * t, a = t * this.turns * Math.PI * 2; return target.set(Math.cos(a) * r, Math.sin(a) * r, 0); }
    }
    function jewelGeo() { return cached('jewel', function () { var g = new THREE.CylinderGeometry(0.028, 0.028, 0.014, 18); g.rotateX(Math.PI / 2); return g; }); }
    function makeBalance(r, M) {
        var group = new THREE.Group(), wheel = new THREE.Group();
        wheel.add(mesh(cached('bal-rim' + r, function () { return new THREE.TorusGeometry(r, r * 0.075, 12, 72); }), M.copper));
        var arm = mesh(cached('bal-arm' + r, function () { return new THREE.BoxGeometry(r * 2, r * 0.09, 0.02); }), M.copper);
        wheel.add(arm); var arm2 = arm.clone(); arm2.rotation.z = Math.PI / 2; wheel.add(arm2);
        var screwG = cached('bal-screw' + r, function () { return new THREE.SphereGeometry(r * 0.06, 10, 8); });
        for (var i = 0; i < 10; i++) { var a = i / 10 * Math.PI * 2, sc = mesh(screwG, M.copperBrushed); sc.position.set(Math.cos(a) * r * 1.07, Math.sin(a) * r * 1.07, 0); wheel.add(sc); }
        var spring = mesh(cached('bal-spring' + r, function () { return new THREE.TubeGeometry(new Spiral(r * 0.12, r * 0.62, 7), 360, 0.0035, 4, false); }), M.steel);
        spring.position.z = 0.02;
        var j = mesh(jewelGeo(), M.jewel); j.position.z = 0.03;
        group.add(wheel, spring, j);
        return { group: group, wheel: wheel, spring: spring };
    }
    function jewel(M, x, y, z) {
        var g = new THREE.Group();
        g.add(mesh(jewelGeo(), M.jewel), mesh(cached('chaton', function () { return new THREE.TorusGeometry(0.04, 0.009, 8, 24); }), M.copper));
        g.position.set(x, y, z); return g;
    }

    function dauphineGeo(len, w, tail, h) {
        return cached('dau-' + len + '-' + w, function () {
            var L = [-w, len * 0.06, 0], R = [w, len * 0.06, 0], T = [0, len, h * 0.35], B = [0, -tail, h];
            var g = new THREE.BufferGeometry();
            g.setAttribute('position', new THREE.Float32BufferAttribute([].concat(L, B, T, R, T, B), 3));
            g.computeVertexNormals(); return g;
        });
    }
    function leafGeo(len, w, tail) {
        return cached('leaf-' + len + '-' + w, function () {
            var s = new THREE.Shape(); s.moveTo(0, -tail); s.quadraticCurveTo(w * 1.7, len * 0.32, 0, len); s.quadraticCurveTo(-w * 1.7, len * 0.32, 0, -tail);
            return new THREE.ExtrudeGeometry(s, { depth: 0.01, bevelEnabled: false, curveSegments: 16 });
        });
    }
    function batonGeo(len, w, tail) {
        return cached('baton-' + len + '-' + w, function () {
            var s = new THREE.Shape(); s.moveTo(-w, -tail); s.lineTo(w, -tail); s.lineTo(w, len - w * 1.6); s.lineTo(0, len); s.lineTo(-w, len - w * 1.6); s.closePath();
            return new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: false });
        });
    }
    function makeHand(style, kind, mat, M) {
        var g = new THREE.Group();
        var len = kind === 'h' ? 0.6 : 0.97, w = kind === 'h' ? 0.065 : 0.05, tail = kind === 'h' ? 0.13 : 0.17;
        if (style === 'dauphine') g.add(mesh(dauphineGeo(len, w, tail, 0.014), mat));
        else if (style === 'leaf') g.add(mesh(leafGeo(len, w * 0.95, tail), mat));
        else {
            g.add(mesh(batonGeo(len, w * 0.85, tail), mat));
            var l = mesh(cached('lume-' + kind, function () { return new THREE.PlaneGeometry(w * 0.9, len * 0.62); }), M.lume);
            l.position.set(0, len * 0.5, 0.0125); g.add(l);
        }
        return g;
    }
    function makeSeconds(mat) {
        var g = new THREE.Group();
        g.add(mesh(cached('sec-shaft', function () { var s = new THREE.Shape(); s.moveTo(-0.007, -0.26); s.lineTo(0.007, -0.26); s.lineTo(0.004, 1.04); s.lineTo(-0.004, 1.04); s.closePath(); return new THREE.ExtrudeGeometry(s, { depth: 0.006, bevelEnabled: false }); }), mat));
        var cw = mesh(cached('sec-cw', function () { return new THREE.CylinderGeometry(0.04, 0.04, 0.008, 24).rotateX(Math.PI / 2); }), mat); cw.position.set(0, -0.18, 0.003); g.add(cw);
        return g;
    }

    var STRAP_PATH = [[1.52, -0.1], [2.12, -0.13], [2.75, -0.34], [3.28, -0.78], [3.65, -1.42], [3.86, -2.2], [3.92, -3.0]];
    function strapCurve() { return cached('strap-curve', function () { return new THREE.CatmullRomCurve3(STRAP_PATH.map(function (p) { return new THREE.Vector3(0, p[0], p[1]); })); }); }
    function strapGeo(w0, w1, th) {
        return cached('strap-' + w0 + '-' + w1 + '-' + th, function () {
            var curve = strapCurve(), L = curve.getLength(), segs = 64, K = 28, pos = [], uv = [], idx = [];
            for (var i = 0; i <= segs; i++) {
                var t = i / segs, P = curve.getPointAt(t), T = curve.getTangentAt(t), Nn = new THREE.Vector3(0, -T.z, T.y).normalize();
                var hw = (w0 + (w1 - w0) * t) / 2, ht = th / 2 * (1 - 0.15 * t);
                for (var k = 0; k <= K; k++) {
                    var a = k / K * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
                    var x = hw * Math.sign(c) * Math.pow(Math.abs(c), 0.25), y = ht * Math.sign(s) * Math.pow(Math.abs(s), 0.25);
                    pos.push(P.x + x, P.y + Nn.y * y, P.z + Nn.z * y);
                    uv.push(x / (2 * hw) + 0.5, t * L / w0);
                }
            }
            for (var i2 = 0; i2 < segs; i2++) for (var k2 = 0; k2 < K; k2++) { var a2 = i2 * (K + 1) + k2, b2 = a2 + K + 1; idx.push(a2, b2, a2 + 1, b2, b2 + 1, a2 + 1); }
            var g = new THREE.BufferGeometry();
            g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
            g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
            g.setIndex(idx); g.computeVertexNormals(); return g;
        });
    }
    function roundedBoxGeo(w, l, t, r) {
        return cached('rbox-' + w + '-' + l + '-' + t, function () {
            var s = new THREE.Shape(), x = -w / 2, y = -l / 2;
            s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + l - r); s.quadraticCurveTo(x + w, y + l, x + w - r, y + l);
            s.lineTo(x + r, y + l); s.quadraticCurveTo(x, y + l, x, y + l - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
            var g = new THREE.ExtrudeGeometry(s, { depth: t - 0.04, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2, curveSegments: 4 });
            g.translate(0, 0, -(t - 0.04) / 2); return g;
        });
    }
    function addStrap(body, cfg) {
        var rubber = cfg.strap === 'rubber';
        var mat = new THREE.MeshPhysicalMaterial({ map: rubber ? rubberTex() : leatherTex(cfg.strapColor, cfg.stitch), roughness: rubber ? 0.78 : 0.55, metalness: 0, clearcoat: rubber ? 0 : 0.2, clearcoatRoughness: 0.5 });
        var geo = strapGeo(1.5, 1.3, 0.17);
        var top = mesh(geo, mat), bot = mesh(geo, mat); bot.rotation.z = Math.PI;
        body.add(top, bot);
    }
    function addBracelet(body, M) {
        var curve = strapCurve(), L = curve.getLength(), step = 0.25, n = Math.floor((L - 0.05) / step);
        var center = new THREE.InstancedMesh(roundedBoxGeo(0.46, 0.21, 0.15, 0.04), M.steel, n * 2);
        var outer = new THREE.InstancedMesh(roundedBoxGeo(0.48, 0.23, 0.14, 0.04), M.steelBrushed, n * 4);
        var X = new THREE.Vector3(1, 0, 0), m4 = new THREE.Matrix4(), rotZ = new THREE.Matrix4().makeRotationZ(Math.PI), off = new THREE.Matrix4();
        var ci = 0, oi = 0;
        for (var i = 0; i < n; i++) {
            var t = (0.05 + (i + 0.5) * step) / L, P = curve.getPointAt(t), T = curve.getTangentAt(t), Nn = new THREE.Vector3().crossVectors(X, T).normalize();
            m4.makeBasis(X, T, Nn).setPosition(P);
            [false, true].forEach(function (flip) {
                var base = flip ? rotZ.clone().multiply(m4) : m4.clone();
                center.setMatrixAt(ci++, base);
                [-0.49, 0.49].forEach(function (sx) { off.makeTranslation(sx, 0, -0.01); outer.setMatrixAt(oi++, base.clone().multiply(off)); });
            });
        }
        body.add(center, outer);
    }

    function addSkeleton(body, M, anim) {
        var pg = cached('plate', function () {
            var sh = new THREE.Shape(); sh.absarc(0, 0, 0.9, 0, Math.PI * 2, false);
            [[0.2, 0.55, 0.19], [-0.45, -0.32, 0.25], [0.66, 0.12, 0.14], [-0.08, 0.05, 0.13]].forEach(function (h) { var p = new THREE.Path(); p.absarc(h[0], h[1], h[2], 0, Math.PI * 2, true); sh.holes.push(p); });
            return new THREE.ShapeGeometry(sh, 48);
        });
        var plate = mesh(pg, M.plate); plate.position.z = -0.22; body.add(plate);

        var barrel = new THREE.Group(); barrel.position.set(-0.36, 0.34, -0.17);
        barrel.add(mesh(gearGeo(80, 0.4, 0.02, 0, 0.06), M.copperBrushed));
        var cover = mesh(cached('barrel-cover', function () { return new THREE.CircleGeometry(0.33, 64); }), new THREE.MeshPhysicalMaterial({ map: barrelTex(), metalness: 1, roughness: 0.32 }));
        cover.position.z = 0.062; barrel.add(cover); body.add(barrel);
        anim.push(function (t) { barrel.rotation.z = -t * 0.03; });

        function gear(N, rp, m, sp, depth, mat, x, y, z, fn) {
            var g = mesh(gearGeo(N, rp, m, sp, depth), mat); g.position.set(x, y, z); body.add(g);
            anim.push(function (t) { g.rotation.z = fn(t); });
        }
        gear(72, 0.33, 0.014, 5, 0.025, M.steelBrushed, 0, 0, -0.12, function (t) { return t * 0.004; });
        gear(60, 0.25, 0.013, 5, 0.025, M.copper, 0.314, 0.264, -0.09, function (t) { return -t * 0.06; });
        gear(64, 0.24, 0.012, 4, 0.025, M.steel, 0.48, -0.03, -0.07, function (t) { return t * Math.PI * 2 / 60; });
        gear(15, 0.11, 0.022, 3, 0.02, M.steel, 0.35, -0.31, -0.05, function (t) { var f = t * 5, s = Math.min(1, (f % 1) * 6); return -(Math.floor(f) + s) * Math.PI / 15; });

        var fork = new THREE.Group(); fork.position.set(0.2, -0.42, -0.035);
        fork.add(mesh(cached('fork', function () { return new THREE.ExtrudeGeometry(capsuleShape(-0.13, -0.06, 0.13, 0.08, 0.018), { depth: 0.015, bevelEnabled: false }); }), M.steelBrushed));
        body.add(fork);
        anim.push(function (t) { fork.rotation.z = Math.tanh(Math.sin(t * Math.PI * 2 * 2.5) * 4) * 0.12; });

        var bal = makeBalance(0.24, M); bal.group.position.set(0.02, -0.52, -0.02); body.add(bal.group);
        anim.push(function (t) { var a = Math.sin(t * Math.PI * 2 * 2.5); bal.wheel.rotation.z = a * 2.3; bal.spring.rotation.z = a * 0.5; var sc = 1 + a * 0.05; bal.spring.scale.set(sc, sc, 1); });

        bridgeGeo('skel', [
            [[-0.66, -0.42], [0.02, -0.52]],
            [[0.7, 0.4], [0.314, 0.264]], [[0.314, 0.264], [0.48, -0.03]], [[0.48, -0.03], [0.35, -0.31]], [[0.35, -0.31], [0.74, -0.38]]
        ], 0.05, 0.03).forEach(function (g, i) { var b = mesh(g, M.ruthenium); b.position.z = i === 0 ? 0.02 : -0.005; body.add(b); });
        var pad = mesh(cached('cock-pad', function () { return new THREE.CylinderGeometry(0.085, 0.085, 0.03, 32).rotateX(Math.PI / 2); }), M.ruthenium); pad.position.set(0.02, -0.52, 0.035); body.add(pad);
        [[0.02, -0.52, 0.055], [0.314, 0.264, 0.03], [0.48, -0.03, 0.03], [0.35, -0.31, 0.03]].forEach(function (p) { body.add(jewel(M, p[0], p[1], p[2])); });
        var sg = cached('bscrew', function () { return new THREE.CylinderGeometry(0.03, 0.03, 0.02, 16).rotateX(Math.PI / 2); });
        [[-0.6, -0.43], [0.66, 0.38], [0.7, -0.37]].forEach(function (p) { var s = mesh(sg, M.steel); s.position.set(p[0], p[1], 0.045); body.add(s); });
    }
    function addTourbillon(body, M, anim) {
        var back = mesh(cached('tb-back', function () { return new THREE.CircleGeometry(0.38, 48); }), M.plate); back.position.set(0, -0.48, -0.1); body.add(back);
        var cage = new THREE.Group(); cage.position.set(0, -0.48, 0.0); body.add(cage);
        var ring = mesh(cached('tb-ring', function () { return new THREE.TorusGeometry(0.27, 0.014, 10, 64); }), M.copper); ring.position.z = 0.07; cage.add(ring);
        var armGeo = cached('tb-arm', function () { return new THREE.ExtrudeGeometry(capsuleShape(0, 0, 0, 0.27, 0.022), { depth: 0.015, bevelEnabled: false }); });
        for (var i = 0; i < 3; i++) { var a = mesh(armGeo, M.copper); a.rotation.z = i * Math.PI * 2 / 3; a.position.z = 0.062; cage.add(a); }
        var bal = makeBalance(0.17, M); bal.group.position.z = 0.02; cage.add(bal.group);
        var esc = mesh(gearGeo(15, 0.06, 0.014, 0, 0.015), M.steel); esc.position.set(0.14, -0.12, -0.02); cage.add(esc);
        var fixed = mesh(gearGeo(54, 0.36, 0.012, 0, 0.02), M.steelBrushed); fixed.position.set(0, -0.48, -0.06); body.add(fixed);
        cage.add(jewel(M, 0, 0, 0.085));
        anim.push(function (t) { cage.rotation.z = -t * Math.PI * 2 / 12; var s = Math.sin(t * Math.PI * 2 * 2.5); bal.wheel.rotation.z = s * 2.2; bal.spring.rotation.z = s * 0.4; esc.rotation.z = -t * 3; });
    }
    function addMoon(body, anim) {
        var disc = mesh(cached('moon-disc', function () { return new THREE.CircleGeometry(0.36, 64); }), new THREE.MeshPhysicalMaterial({ map: moonTex(), roughness: 0.4, metalness: 0.2 }));
        disc.position.set(0, -0.58, 0.12); body.add(disc);
        anim.push(function (t) { disc.rotation.z = 0.35 + t * 0.03; });
    }
    function addApplied(body, mat, skip) {
        var g = cached('applied', function () { return new THREE.BoxGeometry(0.048, 0.165, 0.03); });
        for (var i = 0; i < 12; i++) {
            if (skip.indexOf(i) > -1) continue;
            var a = i * Math.PI / 6, offs = i === 0 ? [-0.042, 0.042] : [0];
            offs.forEach(function (o) { var b = mesh(g, mat), r = 0.86; b.position.set(Math.sin(a) * r + Math.cos(a) * o, Math.cos(a) * r - Math.sin(a) * o, 0.145); b.rotation.z = -a; body.add(b); });
        }
    }
    function addScrews(body, M, r, z) {
        var g = cached('bez-screw', function () { return new THREE.CylinderGeometry(0.045, 0.045, 0.03, 20).rotateX(Math.PI / 2); });
        var sl = cached('bez-slot', function () { return new THREE.BoxGeometry(0.075, 0.012, 0.012); });
        for (var i = 0; i < 6; i++) {
            var a = (i + 0.5) * Math.PI / 3, s = mesh(g, M.steel); s.position.set(Math.cos(a) * r, Math.sin(a) * r, z); body.add(s);
            var k = mesh(sl, M.slot); k.position.set(Math.cos(a) * r, Math.sin(a) * r, z + 0.012); k.rotation.z = a + 0.6; body.add(k);
        }
    }

    function construir(cfg, M) {
        var root = new THREE.Group(), body = new THREE.Group(); root.add(body);
        var anim = [];
        var polished = M[cfg.caseMat];
        var brushed = cfg.caseMat === 'copper' ? M.copperBrushed : cfg.caseMat === 'steel' ? M.steelBrushed : M.black;
        var knurl = cfg.caseMat === 'copper' ? M.copperKnurl : cfg.caseMat === 'steel' ? M.steelKnurl : M.blackKnurl;
        body.add(mesh(lathe('case'), brushed));
        body.add(mesh(lathe(cfg.bezel), polished));
        var inner = mesh(cached('inner', function () { return new THREE.CircleGeometry(1.16, 64); }), M.inner); inner.position.z = -0.3; body.add(inner);
        [1, -1].forEach(function (sx) { [1, -1].forEach(function (sy) { var l = mesh(lugGeo(), polished); l.position.x = 0.9 * sx; if (sy < 0) l.rotation.z = Math.PI; body.add(l); }); });
        var crown = mesh(cached('crown', function () { return new THREE.CylinderGeometry(0.2, 0.2, 0.22, 26, 1).rotateZ(Math.PI / 2); }), knurl); crown.position.set(1.66, 0, -0.06); body.add(crown);
        var stem = mesh(cached('stem', function () { return new THREE.CylinderGeometry(0.08, 0.08, 0.2, 16).rotateZ(Math.PI / 2); }), brushed); stem.position.set(1.5, 0, -0.06); body.add(stem);

        var dialOpts = { roughness: 0.34, metalness: 0.08, clearcoat: 0.7, clearcoatRoughness: 0.1 };
        if (cfg.dial === 'skeleton') {
            var ring = mesh(cached('chapter', function () { return new THREE.RingGeometry(0.86, DIAL_R, 128); }), new THREE.MeshPhysicalMaterial(Object.assign({ map: DIALS.skeleton() }, dialOpts)));
            ring.position.z = 0.13; body.add(ring);
            addSkeleton(body, M, anim);
        } else {
            var dial = mesh(cached('dial', function () { return new THREE.CircleGeometry(DIAL_R, 128); }), new THREE.MeshPhysicalMaterial(Object.assign({ map: DIALS[cfg.dial](), alphaTest: 0.5 }, dialOpts)));
            dial.position.z = 0.13; body.add(dial);
        }
        if (cfg.bezel === 'diver') {
            var ins = mesh(cached('insert', function () { return new THREE.RingGeometry(1.25, 1.48, 128); }), new THREE.MeshPhysicalMaterial({ map: DIALS.marineBezel(), roughness: 0.25, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.05 }));
            ins.position.z = 0.337; body.add(ins);
        }
        if (cfg.applied) addApplied(body, M[cfg.applied], cfg.moon ? [6] : []);
        if (cfg.moon) addMoon(body, anim);
        if (cfg.tourbillon) addTourbillon(body, M, anim);
        if (cfg.screws) addScrews(body, M, cfg.bezel === 'domed' ? 1.335 : 1.35, cfg.bezel === 'domed' ? 0.37 : 0.35);

        var hHand = makeHand(cfg.hands, 'h', M[cfg.handMat], M); hHand.position.z = 0.155;
        var mHand = makeHand(cfg.hands, 'm', M[cfg.handMat], M); mHand.position.z = 0.175;
        body.add(hHand, mHand);
        var sHand = null;
        if (cfg.secMat) { sHand = makeSeconds(M[cfg.secMat]); sHand.position.z = 0.198; body.add(sHand); }
        var hub = mesh(cached('hub', function () { return new THREE.CylinderGeometry(0.05, 0.05, 0.03, 24).rotateX(Math.PI / 2); }), M[cfg.secMat || cfg.handMat]); hub.position.z = 0.21; body.add(hub);

        var Rs = 12.43;
        var glass = mesh(cached('glass', function () { return new THREE.SphereGeometry(Rs, 96, 6, 0, Math.PI * 2, 0, 0.0985).rotateX(Math.PI / 2); }), M.glass);
        glass.position.z = 0.395 - Rs; glass.renderOrder = 2; body.add(glass);

        if (cfg.strap === 'bracelet') addBracelet(body, M); else addStrap(body, cfg);

        function tick(t, time) {
            hHand.rotation.z = -((time.h % 12) + time.m / 60) / 12 * Math.PI * 2;
            mHand.rotation.z = -(time.m + time.s / 60) / 60 * Math.PI * 2;
            if (sHand) sHand.rotation.z = -time.s / 60 * Math.PI * 2;
            for (var i = 0; i < anim.length; i++) anim[i](t);
        }
        return { root: root, body: body, tick: tick, spin: 0 };
    }

    function horaActual() {
        var d = new Date();
        return { h: d.getHours(), m: d.getMinutes(), s: d.getSeconds() + Math.floor(d.getMilliseconds() / 125) / 8 };
    }

    // LIBERA LAS TEXTURAS Y GEOMETRÍAS CACHEADAS (SE COMPARTEN ENTRE LOS SEIS RELOJES).
    function liberar() {
        Object.keys(TEX).forEach(function (clave) { TEX[clave].dispose(); delete TEX[clave]; });
        // LA CACHÉ TAMBIÉN GUARDA CURVAS (strap-curve), QUE NO OCUPAN GPU NI TIENEN dispose().
        GEO.forEach(function (valor) { if (typeof valor.dispose === 'function') valor.dispose(); });
        GEO.clear();
    }

    return {
        soportado: soportado,
        fuentes: fuentes,
        config: config,
        construir: construir,
        materiales: materiales,
        entorno: entorno,
        luces: luces,
        horaActual: horaActual,
        liberar: liberar
    };
}
