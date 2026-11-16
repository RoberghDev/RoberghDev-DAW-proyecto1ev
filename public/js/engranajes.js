(function () {
    'use strict';
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    Array.prototype.forEach.call(document.querySelectorAll('canvas[data-engranajes]'), iniciar);

    function iniciar(cv) {
        var ctx = cv.getContext('2d'), W = 0, H = 0, dpr = 1, fondo = null, sprites = [], visible = false, raf = 0, t0 = performance.now();
        var MOD = 0.0105;
        var defs = [
            { id: 'g1', N: 64, x: 0.30, y: 0.58, spokes: 5, metal: 'cu' },
            { id: 'g2p', N: 16, arbor: 'g2', metal: 'cu-dark', mesh: { con: 'g1', ang: -28 } },
            { id: 'g2', N: 44, arbor: 'g2', spokes: 4, metal: 'steel', igual: 'g2p' },
            { id: 'g3p', N: 14, arbor: 'g3', metal: 'cu-dark', mesh: { con: 'g2', ang: 80 } },
            { id: 'g3', N: 30, arbor: 'g3', spokes: 3, metal: 'cu', igual: 'g3p' }
        ];
        var por = {};
        defs.forEach(function (d) {
            d.rp = d.N * MOD / 2;
            if (d.mesh) { var o = por[d.mesh.con], a = d.mesh.ang * Math.PI / 180, dist = o.rp + d.rp; d.x = o.x + Math.cos(a) * dist; d.y = o.y + Math.sin(a) * dist; d.phi = a; }
            if (d.igual) { d.x = por[d.igual].x; d.y = por[d.igual].y; }
            por[d.id] = d;
        });

        function angulos(t) {
            var A = {};
            A.g1 = 0.16 * t;
            var p = por.g2p; A.g2 = -(por.g1.N / p.N) * (A.g1 - p.phi) + p.phi + Math.PI + Math.PI / p.N;
            var q = por.g3p; A.g3 = -(por.g2.N / q.N) * (A.g2 - q.phi) + q.phi + Math.PI + Math.PI / q.N;
            return A;
        }
        function metal(c, r, tipo) {
            var g = c.createConicGradient ? c.createConicGradient(0.6, 0, 0) : c.createLinearGradient(-r, -r, r, r);
            var stops = tipo === 'steel' ? ['#f4f4f4', '#8f9093', '#e9eaeb', '#6e6f72', '#f4f4f4'] : tipo === 'cu-dark' ? ['#b97a52', '#5d331c', '#a9693f', '#4e2a16', '#b97a52'] : ['#f7cfae', '#b06c42', '#efbb93', '#8a4b28', '#f7cfae'];
            stops.forEach(function (s, i) { g.addColorStop(i / (stops.length - 1), s); });
            return g;
        }
        function rueda(c, d) {
            var N = d.N, rp = d.rp * H, m = MOD * H, ra = rp + m * 0.95, rf = rp - m * 1.15, p = Math.PI * 2 / N;
            c.beginPath();
            for (var k = 0; k < N; k++) {
                var a = k * p;
                [[rf, a - 0.31 * p], [ra, a - 0.15 * p], [ra, a + 0.15 * p], [rf, a + 0.31 * p]].forEach(function (pt, j) {
                    var x = Math.cos(pt[1]) * pt[0], y = Math.sin(pt[1]) * pt[0];
                    if (k === 0 && j === 0) c.moveTo(x, y); else c.lineTo(x, y);
                });
            }
            c.closePath();
            if (d.spokes) {
                var rIn = rf - Math.max(m * 2.2, rp * 0.13), hub = rp * 0.24, sw = rp * 0.07;
                for (var s = 0; s < d.spokes; s++) {
                    var a0 = s * 2 * Math.PI / d.spokes, a1 = (s + 1) * 2 * Math.PI / d.spokes;
                    c.moveTo(Math.cos(a0 + sw / rIn) * rIn, Math.sin(a0 + sw / rIn) * rIn);
                    c.arc(0, 0, rIn, a0 + sw / rIn, a1 - sw / rIn);
                    c.arc(0, 0, hub, a1 - sw / hub, a0 + sw / hub, true);
                    c.closePath();
                }
            }
            return { ra: ra, rf: rf, rp: rp };
        }

        function prepararRuedas() {
            sprites = defs.map(function (d) {
                var rp = d.rp * H * dpr, size = Math.ceil((rp + MOD * H * dpr * 2) * 2 + 40 * dpr);
                var c = document.createElement('canvas'); c.width = c.height = size;
                var x = c.getContext('2d'); x.translate(size / 2, size / 2); x.scale(dpr, dpr);
                var g = rueda(x, d);
                x.shadowColor = 'rgba(0,0,0,.65)'; x.shadowBlur = 14; x.shadowOffsetY = 5;
                x.fillStyle = metal(x, g.ra, d.metal); x.fill('evenodd');
                x.shadowColor = 'transparent';
                x.lineWidth = 0.8; x.strokeStyle = 'rgba(0,0,0,.45)'; x.stroke();
                x.beginPath(); x.arc(0, 0, g.rf - MOD * H * 0.6, 0, Math.PI * 2); x.strokeStyle = 'rgba(255,255,255,.18)'; x.lineWidth = 1; x.stroke();
                x.beginPath(); x.arc(0, 0, Math.max(5, g.rp * 0.12), 0, Math.PI * 2); x.fillStyle = metal(x, 10, 'steel'); x.fill();
                return { d: d, c: c, size: size };
            });
        }

        function prepararFondo() {
            var c = document.createElement('canvas'); c.width = W * dpr; c.height = H * dpr;
            var x = c.getContext('2d');
            var g = x.createRadialGradient(c.width * 0.45, c.height * 0.5, 0, c.width * 0.5, c.height * 0.5, Math.max(c.width, c.height) * 0.75);
            g.addColorStop(0, '#3a3634'); g.addColorStop(0.55, '#1c1a19'); g.addColorStop(1, '#080707');
            x.fillStyle = g; x.fillRect(0, 0, c.width, c.height);
            var s = 22 * dpr;
            for (var yy = -s, fila = 0; yy < c.height + s; yy += s * 0.78, fila++) {
                for (var xx = -s + (fila % 2) * s * 0.5; xx < c.width + s; xx += s * 0.9) {
                    var rg = x.createRadialGradient(xx - s * 0.15, yy - s * 0.2, 0, xx, yy, s * 0.62);
                    rg.addColorStop(0, 'rgba(255,255,255,.09)'); rg.addColorStop(0.6, 'rgba(255,255,255,.02)'); rg.addColorStop(1, 'rgba(0,0,0,.14)');
                    x.fillStyle = rg; x.beginPath(); x.arc(xx, yy, s * 0.62, 0, Math.PI * 2); x.fill();
                }
            }
            var v = x.createRadialGradient(c.width / 2, c.height / 2, c.height * 0.3, c.width / 2, c.height / 2, c.height * 0.85);
            v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.7)');
            x.fillStyle = v; x.fillRect(0, 0, c.width, c.height);
            fondo = c;
        }
        function rubi(x, y, r) {
            ctx.beginPath(); ctx.arc(x, y, r * 1.7, 0, Math.PI * 2); ctx.fillStyle = metal(ctx, r * 2, 'cu'); ctx.fill();
            var g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, 0, x, y, r);
            g.addColorStop(0, '#ff8aa0'); g.addColorStop(0.35, '#c0123a'); g.addColorStop(1, '#4a0010');
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
        }
        function puente(pts, w) {
            ctx.save();
            ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            ctx.beginPath(); pts.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); });
            ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6;
            ctx.lineWidth = w; ctx.strokeStyle = '#2a2827'; ctx.stroke();
            ctx.shadowColor = 'transparent';
            var g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#5c5957'); g.addColorStop(0.5, '#3a3837'); g.addColorStop(1, '#4d4a48');
            ctx.lineWidth = w - 3; ctx.strokeStyle = g; ctx.stroke();
            ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(236,190,150,.55)'; ctx.stroke();
            ctx.restore();
        }
        function dibujar(t) {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, W, H);
            ctx.drawImage(fondo, 0, 0, W, H);
            var A = angulos(t), ox = (W - H) / 2;
            sprites.forEach(function (s) {
                var d = s.d;
                ctx.save(); ctx.translate(ox + d.x * H, d.y * H); ctx.rotate(A[d.arbor || d.id]);
                ctx.drawImage(s.c, -s.size / dpr / 2, -s.size / dpr / 2, s.size / dpr, s.size / dpr); ctx.restore();
            });

            var bx = ox + 0.9 * H, by = 0.9 * H, br = 0.15 * H, osc = Math.sin(t * Math.PI * 2 * 1.4) * 2.2;
            ctx.save(); ctx.translate(bx, by);
            ctx.save(); ctx.rotate(osc * 0.35);
            ctx.strokeStyle = 'rgba(210,214,220,.55)'; ctx.lineWidth = 0.8; ctx.beginPath();
            for (var i = 0; i <= 220; i++) { var a = i / 220 * Math.PI * 2 * 7, r = br * 0.12 + br * 0.55 * i / 220; if (i) ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); else ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
            ctx.stroke(); ctx.restore();
            ctx.rotate(osc);
            ctx.lineWidth = br * 0.12; ctx.strokeStyle = metal(ctx, br, 'cu'); ctx.beginPath(); ctx.arc(0, 0, br, 0, Math.PI * 2); ctx.stroke();
            ctx.lineWidth = br * 0.07; ctx.beginPath(); ctx.moveTo(-br, 0); ctx.lineTo(br, 0); ctx.moveTo(0, -br); ctx.lineTo(0, br); ctx.stroke();
            for (var k = 0; k < 10; k++) { var aa = k / 10 * Math.PI * 2; ctx.beginPath(); ctx.arc(Math.cos(aa) * br * 1.08, Math.sin(aa) * br * 1.08, br * 0.05, 0, Math.PI * 2); ctx.fillStyle = '#e9c3a2'; ctx.fill(); }
            ctx.restore();

            var g1 = por.g1, g2 = por.g2, g3 = por.g3;
            puente([[ox + g1.x * H, g1.y * H], [ox + g2.x * H, g2.y * H], [ox + 1.12 * H, 0.16 * H]], 0.075 * H);
            puente([[ox + g3.x * H, g3.y * H], [ox + 1.15 * H, 0.66 * H]], 0.06 * H);
            puente([[ox - 0.2 * H, 0.98 * H], [bx, by]], 0.06 * H);
            rubi(ox + g1.x * H, g1.y * H, 0.016 * H);
            rubi(ox + g2.x * H, g2.y * H, 0.014 * H);
            rubi(ox + g3.x * H, g3.y * H, 0.013 * H);
            rubi(bx, by, 0.012 * H);
            [[ox + 0.98 * H, 0.26 * H], [ox + 0.05 * H, 0.94 * H]].forEach(function (p) {
                ctx.beginPath(); ctx.arc(p[0], p[1], 0.022 * H, 0, Math.PI * 2); ctx.fillStyle = metal(ctx, 10, 'steel'); ctx.fill();
                ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(0.7); ctx.fillStyle = '#2a2a2a'; ctx.fillRect(-0.02 * H, -0.003 * H, 0.04 * H, 0.006 * H); ctx.restore();
            });
        }
        function tamano() {
            var r = cv.getBoundingClientRect(); if (!r.width || !r.height) return;
            dpr = Math.min(window.devicePixelRatio || 1, 2); W = r.width; H = r.height;
            cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
            prepararFondo(); prepararRuedas(); dibujar((performance.now() - t0) / 1000);
        }
        function bucle() { if (!visible) { raf = 0; return; } dibujar((performance.now() - t0) / 1000); raf = requestAnimationFrame(bucle); }
        new ResizeObserver(tamano).observe(cv);
        if (!reduce && 'IntersectionObserver' in window) {
            new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible && !raf) raf = requestAnimationFrame(bucle); }).observe(cv);
        }
    }
})();
