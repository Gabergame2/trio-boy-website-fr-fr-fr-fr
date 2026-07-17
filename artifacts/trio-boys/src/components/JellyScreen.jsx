import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useJelly } from '@/lib/JellyContext';

export default function JellyScreen() {
  const { jellyScreen, deactivateScreen } = useJelly();
  const canvasRef  = useRef(null);
  const animRef    = useRef(null);
  const turbRef    = useRef(null);
  const dispRef    = useRef(null);   // feDisplacementMap element
  const mouse      = useRef({ x: -999, y: -999 });
  const pressing   = useRef(false);
  const touches    = useRef([]);     // active touch/press points { x, y }
  const ripples    = useRef([]);     // { x, y, t, max }
  const dispScale  = useRef(24);     // current animated displacement scale
  const dispVel    = useRef(0);      // velocity for spring physics

  /* ── Apply SVG filter to #root, lock scroll ── */
  useEffect(() => {
    const root = document.getElementById('root');
    if (jellyScreen) {
      if (root) root.style.filter = 'url(#jelly-scr-filter)';
      document.body.style.overflow = 'hidden';
    } else {
      if (root) root.style.filter = '';
      document.body.style.overflow = '';
    }
    return () => {
      if (root) root.style.filter = '';
      document.body.style.overflow = '';
    };
  }, [jellyScreen]);

  /* ── Canvas + interaction loop ── */
  useEffect(() => {
    if (!jellyScreen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    /* — pointer helpers — */
    const getPos = (e) => {
      if (e.touches) {
        return Array.from(e.touches).map(t => ({ x: t.clientX, y: t.clientY }));
      }
      return [{ x: e.clientX, y: e.clientY }];
    };

    const onDown = (e) => {
      e.preventDefault();
      pressing.current = true;
      const pts = getPos(e);
      touches.current = pts;
      mouse.current = pts[0];
      // burst ripple on press
      pts.forEach(p => ripples.current.push({ x: p.x, y: p.y, t: 0, max: 40 }));
    };

    const onMove = (e) => {
      e.preventDefault();
      const pts = getPos(e);
      touches.current = pts;
      mouse.current = pts[0];
      // drip ripples while dragging (throttle)
      if (pressing.current && Math.random() < 0.15) {
        pts.forEach(p => ripples.current.push({ x: p.x, y: p.y, t: 0, max: 30 }));
      }
    };

    const onUp = (e) => {
      pressing.current = false;
      // release ripple burst
      const pts = touches.current;
      pts.forEach(p => ripples.current.push({ x: p.x, y: p.y, t: 0, max: 70 }));
      touches.current = [];
    };

    // use the canvas as the interaction surface (pointer-events: auto for events, none for visual)
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9991;touch-action:none;';
    document.body.appendChild(overlay);

    overlay.addEventListener('mousedown',  onDown, { passive: false });
    overlay.addEventListener('mousemove',  onMove, { passive: false });
    overlay.addEventListener('mouseup',    onUp);
    overlay.addEventListener('touchstart', onDown, { passive: false });
    overlay.addEventListener('touchmove',  onMove, { passive: false });
    overlay.addEventListener('touchend',   onUp,   { passive: false });

    let frame = 0;

    const draw = () => {
      frame++;
      const t = frame * 0.014;

      /* — spring-physics displacement scale — */
      const targetScale = pressing.current ? 70 : 24;
      const stiffness = pressing.current ? 0.18 : 0.10;
      const damping   = 0.72;
      dispVel.current = dispVel.current * damping + (targetScale - dispScale.current) * stiffness;
      dispScale.current += dispVel.current;

      if (turbRef.current) {
        // base wobble frequency, boosted while pressing
        const pressBoost = pressing.current ? 0.006 : 0;
        const base = 0.006 + Math.sin(t * 0.35) * 0.0035 + Math.cos(t * 0.2) * 0.002 + pressBoost;
        turbRef.current.setAttribute('baseFrequency', `${base.toFixed(5)} ${(base * 0.8).toFixed(5)}`);
        if (frame % 4 === 0) {
          turbRef.current.setAttribute('seed', String(2 + Math.floor(Math.abs(Math.sin(t * 0.08)) * 8)));
        }
      }
      if (dispRef.current) {
        dispRef.current.setAttribute('scale', dispScale.current.toFixed(2));
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width, H = canvas.height;

      /* — background jelly blobs — */
      const blobs = [
        { rx: 0.12, ry: 0.18, r: 0.5,  c: '0,245,255',   ph: 0   },
        { rx: 0.88, ry: 0.82, r: 0.45, c: '223,255,0',    ph: 2.1 },
        { rx: 0.5,  ry: 0.45, r: 0.38, c: '0,245,255',    ph: 4.2 },
        { rx: 0.2,  ry: 0.75, r: 0.32, c: '223,255,0',    ph: 1.3 },
        { rx: 0.8,  ry: 0.22, r: 0.3,  c: '160,80,255',   ph: 3.0 },
      ];
      blobs.forEach(b => {
        const x = W * b.rx + Math.sin(t * 0.45 + b.ph) * 60;
        const y = H * b.ry + Math.cos(t * 0.38 + b.ph) * 50;
        const r = W * b.r  * (1 + Math.sin(t * 0.6 + b.ph) * 0.07);
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0,    `rgba(${b.c},0.07)`);
        g.addColorStop(0.55, `rgba(${b.c},0.035)`);
        g.addColorStop(1,     'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      /* — specular gloss follows pointer — */
      const mx = mouse.current.x, my = mouse.current.y;
      if (mx > -900) {
        const intensity = pressing.current ? 0.32 : 0.22;
        const sg = ctx.createRadialGradient(mx - 45, my - 45, 0, mx - 10, my - 10, 200);
        sg.addColorStop(0,    `rgba(255,255,255,${intensity})`);
        sg.addColorStop(0.25, `rgba(255,255,255,${intensity * 0.45})`);
        sg.addColorStop(0.6,  `rgba(255,255,255,0.03)`);
        sg.addColorStop(1,     'transparent');
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.ellipse(mx - 30, my - 30, 170, 120, -0.5, 0, Math.PI * 2);
        ctx.fill();

        const sg2 = ctx.createRadialGradient(mx + 60, my + 60, 0, mx + 60, my + 60, 120);
        sg2.addColorStop(0,  'rgba(255,255,255,0.06)');
        sg2.addColorStop(1,   'transparent');
        ctx.fillStyle = sg2;
        ctx.beginPath();
        ctx.ellipse(mx + 60, my + 60, 110, 80, 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      /* — press depression at each active touch point — */
      touches.current.forEach(tp => {
        const pressProgress = Math.min((dispScale.current - 24) / 46, 1); // 0→1 as scale 24→70
        if (pressProgress <= 0) return;

        // dark compressed centre
        const dg = ctx.createRadialGradient(tp.x, tp.y, 0, tp.x, tp.y, 80 * pressProgress);
        dg.addColorStop(0,    `rgba(0,0,0,${0.25 * pressProgress})`);
        dg.addColorStop(0.5,  `rgba(0,0,0,${0.12 * pressProgress})`);
        dg.addColorStop(1,     'transparent');
        ctx.fillStyle = dg;
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, 80 * pressProgress, 0, Math.PI * 2);
        ctx.fill();

        // bright displaced-material ring around depression
        const rg = ctx.createRadialGradient(tp.x, tp.y, 60 * pressProgress, tp.x, tp.y, 130 * pressProgress);
        rg.addColorStop(0,    `rgba(0,245,255,${0.18 * pressProgress})`);
        rg.addColorStop(0.5,  `rgba(0,245,255,${0.28 * pressProgress})`);
        rg.addColorStop(1,     'transparent');
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, 130 * pressProgress, 0, Math.PI * 2);
        ctx.fill();

        // tight specular on the depression edge
        const eg = ctx.createRadialGradient(
          tp.x - 20 * pressProgress, tp.y - 20 * pressProgress, 0,
          tp.x, tp.y, 90 * pressProgress
        );
        eg.addColorStop(0,   `rgba(255,255,255,${0.35 * pressProgress})`);
        eg.addColorStop(0.4, `rgba(255,255,255,${0.08 * pressProgress})`);
        eg.addColorStop(1,    'transparent');
        ctx.fillStyle = eg;
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, 90 * pressProgress, 0, Math.PI * 2);
        ctx.fill();
      });

      /* — ripples — */
      ripples.current = ripples.current.filter(r => r.t < r.max);
      ripples.current.forEach(r => {
        r.t++;
        const progress = r.t / r.max;
        const rad   = progress * 220;
        const alpha = (1 - progress) * 0.35;
        const inner = ctx.createRadialGradient(r.x, r.y, rad * 0.55, r.x, r.y, rad);
        inner.addColorStop(0,   `rgba(0,245,255,${alpha * 0.4})`);
        inner.addColorStop(0.5, `rgba(0,245,255,${alpha})`);
        inner.addColorStop(1,    'transparent');
        ctx.fillStyle = inner;
        ctx.beginPath();
        ctx.arc(r.x, r.y, rad, 0, Math.PI * 2);
        ctx.fill();
      });

      /* — edge rim glow — */
      const rim = ctx.createRadialGradient(
        W / 2, H / 2, Math.min(W, H) * 0.22,
        W / 2, H / 2, Math.max(W, H) * 0.8
      );
      rim.addColorStop(0,   'transparent');
      rim.addColorStop(1,  `rgba(0,245,255,${0.09 + Math.sin(t * 0.7) * 0.03})`);
      ctx.fillStyle = rim;
      ctx.fillRect(0, 0, W, H);

      /* — surface sparkle — */
      if (frame % 3 === 0) {
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.arc(Math.random() * W, Math.random() * H, 1 + Math.random() * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${0.04 + Math.random() * 0.08})`;
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      overlay.removeEventListener('mousedown',  onDown);
      overlay.removeEventListener('mousemove',  onMove);
      overlay.removeEventListener('mouseup',    onUp);
      overlay.removeEventListener('touchstart', onDown);
      overlay.removeEventListener('touchmove',  onMove);
      overlay.removeEventListener('touchend',   onUp);
      overlay.remove();
      ripples.current = [];
      touches.current = [];
      pressing.current = false;
      dispScale.current = 24;
      dispVel.current = 0;
    };
  }, [jellyScreen]);

  if (!jellyScreen) return null;

  return createPortal(
    <>
      <svg
        aria-hidden
        style={{ position: 'fixed', width: 0, height: 0, top: 0, left: 0, overflow: 'hidden' }}
      >
        <defs>
          <filter
            id="jelly-scr-filter"
            x="-15%" y="-15%" width="130%" height="130%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              ref={turbRef}
              type="turbulence"
              baseFrequency="0.006 0.005"
              numOctaves="4"
              seed="2"
              stitchTiles="stitch"
              result="noise"
            />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="noise"
              scale="24"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9990,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
        }}
      />

      <AnimatePresence>
        <motion.button
          onClick={deactivateScreen}
          style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}
          className="bg-background/90 border border-primary text-primary text-xs font-body tracking-widest px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          EXIT JELLY
        </motion.button>
      </AnimatePresence>
    </>,
    document.body
  );
}
