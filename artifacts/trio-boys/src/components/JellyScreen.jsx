import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useJelly } from '@/lib/JellyContext';

export default function JellyScreen() {
  const { jellyScreen, deactivateScreen } = useJelly();
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const turbRef   = useRef(null);
  const dispRef   = useRef(null);

  const mouse    = useRef({ x: -999, y: -999 });
  const pressing = useRef(false);
  const touches  = useRef([]);
  const ripples  = useRef([]);

  // Spring state for touch-driven jello tilt
  const spring = useRef({ rx: 0, ry: 0, vx: 0, vy: 0 });
  // Displacement scale spring
  const dsp = useRef({ val: 14, vel: 0 });

  /* ── Apply filter + lock scroll ── */
  useEffect(() => {
    const root = document.getElementById('root');
    if (jellyScreen) {
      if (root) {
        root.style.filter    = 'url(#jelly-scr-filter)';
        root.style.transformOrigin = '50% 50%';
        root.style.willChange = 'transform, filter';
      }
      document.body.style.overflow = 'hidden';
    } else {
      if (root) {
        root.style.filter    = '';
        root.style.transform = '';
        root.style.willChange = '';
      }
      document.body.style.overflow = '';
    }
    return () => {
      if (root) { root.style.filter = ''; root.style.transform = ''; root.style.willChange = ''; }
      document.body.style.overflow = '';
    };
  }, [jellyScreen]);

  /* ── Main loop ── */
  useEffect(() => {
    if (!jellyScreen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    /* — interaction overlay — */
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9991;touch-action:none;cursor:none;';
    document.body.appendChild(overlay);

    const getPts = (e) =>
      e.touches
        ? Array.from(e.touches).map(t => ({ x: t.clientX, y: t.clientY }))
        : [{ x: e.clientX, y: e.clientY }];

    const onDown = (e) => {
      e.preventDefault();
      pressing.current = true;
      const pts = getPts(e);
      touches.current = pts;
      mouse.current = pts[0];
      pts.forEach(p => ripples.current.push({ x: p.x, y: p.y, t: 0, max: 45 }));
    };
    const onMove = (e) => {
      e.preventDefault();
      const pts = getPts(e);
      touches.current = pts;
      mouse.current = pts[0];
      if (pressing.current && Math.random() < 0.12) {
        pts.forEach(p => ripples.current.push({ x: p.x, y: p.y, t: 0, max: 28 }));
      }
    };
    const onUp = () => {
      pressing.current = false;
      touches.current.forEach(p => ripples.current.push({ x: p.x, y: p.y, t: 0, max: 75 }));
      touches.current = [];
    };

    overlay.addEventListener('mousedown',  onDown, { passive: false });
    overlay.addEventListener('mousemove',  onMove, { passive: false });
    overlay.addEventListener('mouseup',    onUp);
    overlay.addEventListener('touchstart', onDown, { passive: false });
    overlay.addEventListener('touchmove',  onMove, { passive: false });
    overlay.addEventListener('touchend',   onUp,   { passive: false });

    let frame = 0;

    const draw = () => {
      frame++;
      // Use a slow time — real jello is lazy
      const t = frame * 0.009;
      const W = canvas.width, H = canvas.height;
      const root = document.getElementById('root');

      /* ── 1. SMOOTH JELLO TRANSFORM ON #ROOT ──
         Multiple sine waves at different frequencies create the organic,
         never-repeating wobble of real jello. No seed jumps, fully interpolated. */
      const baseRX = Math.sin(t * 0.71)  * 1.4
                   + Math.sin(t * 1.37 + 0.9) * 0.6
                   + Math.sin(t * 0.45 + 2.1) * 0.4;
      const baseRY = Math.cos(t * 0.83)  * 1.1
                   + Math.cos(t * 1.19 + 1.5) * 0.5
                   + Math.cos(t * 0.57 + 3.0) * 0.35;
      const sX = 1 + Math.sin(t * 0.94 + 0.4) * 0.009
                   + Math.sin(t * 1.61 + 1.8) * 0.004;
      const sY = 1 + Math.cos(t * 0.88)       * 0.009
                   + Math.cos(t * 1.43 + 2.5) * 0.004;
      const skX = Math.sin(t * 0.63 + 1.1) * 0.35;
      const skY = Math.cos(t * 0.77 + 0.6) * 0.22;

      // Touch-driven spring physics — pressing pulls the jello toward your finger
      const targetRX = pressing.current
        ? ((mouse.current.y - H / 2) / H) * -18
        : 0;
      const targetRY = pressing.current
        ? ((mouse.current.x - W / 2) / W) *  18
        : 0;

      const stiff = pressing.current ? 0.14 : 0.06;
      const damp  = pressing.current ? 0.65 : 0.78;

      spring.current.vx = spring.current.vx * damp + (targetRX - spring.current.rx) * stiff;
      spring.current.vy = spring.current.vy * damp + (targetRY - spring.current.ry) * stiff;
      spring.current.rx += spring.current.vx;
      spring.current.ry += spring.current.vy;

      const finalRX = baseRX + spring.current.rx;
      const finalRY = baseRY + spring.current.ry;

      if (root) {
        root.style.transform =
          `perspective(900px) ` +
          `rotateX(${finalRX}deg) ` +
          `rotateY(${finalRY}deg) ` +
          `scaleX(${sX}) scaleY(${sY}) ` +
          `skewX(${skX}deg) skewY(${skY}deg)`;
      }

      /* ── 2. SVG DISPLACEMENT — fixed seed, smooth freq only ──
         No seed changes = no flipping. Just a subtle warp that drifts slowly. */
      if (turbRef.current) {
        const fx = 0.004 + Math.sin(t * 0.22) * 0.002 + Math.cos(t * 0.31) * 0.001;
        const fy = 0.004 + Math.cos(t * 0.18) * 0.0018+ Math.sin(t * 0.27) * 0.001;
        turbRef.current.setAttribute('baseFrequency', `${fx.toFixed(5)} ${fy.toFixed(5)}`);
      }

      // Displacement scale: ramps up on press, springs back
      const dspTarget = pressing.current ? 55 : 14;
      const dspStiff  = pressing.current ? 0.20 : 0.08;
      const dspDamp   = 0.72;
      dsp.current.vel = dsp.current.vel * dspDamp + (dspTarget - dsp.current.val) * dspStiff;
      dsp.current.val += dsp.current.vel;
      if (dispRef.current) {
        dispRef.current.setAttribute('scale', dsp.current.val.toFixed(2));
      }

      /* ── 3. CANVAS JELLY SHEEN ── */
      ctx.clearRect(0, 0, W, H);

      // Background colour blobs
      const blobs = [
        { rx: 0.12, ry: 0.18, r: 0.5,  c: '0,245,255',  ph: 0   },
        { rx: 0.88, ry: 0.82, r: 0.45, c: '223,255,0',   ph: 2.1 },
        { rx: 0.5,  ry: 0.45, r: 0.38, c: '0,245,255',   ph: 4.2 },
        { rx: 0.2,  ry: 0.75, r: 0.32, c: '223,255,0',   ph: 1.3 },
        { rx: 0.8,  ry: 0.22, r: 0.3,  c: '160,80,255',  ph: 3.0 },
      ];
      blobs.forEach(b => {
        const x = W * b.rx + Math.sin(t * 0.45 + b.ph) * 55;
        const y = H * b.ry + Math.cos(t * 0.38 + b.ph) * 45;
        const r = W * b.r  * (1 + Math.sin(t * 0.6 + b.ph) * 0.07);
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0,    `rgba(${b.c},0.07)`);
        g.addColorStop(0.55, `rgba(${b.c},0.03)`);
        g.addColorStop(1,     'transparent');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      });

      // Specular gloss at pointer
      const mx = mouse.current.x, my = mouse.current.y;
      if (mx > -900) {
        const bright = pressing.current ? 0.30 : 0.20;
        const sg = ctx.createRadialGradient(mx - 45, my - 45, 0, mx - 10, my - 10, 190);
        sg.addColorStop(0,    `rgba(255,255,255,${bright})`);
        sg.addColorStop(0.25, `rgba(255,255,255,${bright * 0.4})`);
        sg.addColorStop(0.6,  'rgba(255,255,255,0.02)');
        sg.addColorStop(1,     'transparent');
        ctx.fillStyle = sg;
        ctx.beginPath(); ctx.ellipse(mx - 28, my - 28, 165, 118, -0.5, 0, Math.PI * 2); ctx.fill();

        const sg2 = ctx.createRadialGradient(mx + 55, my + 55, 0, mx + 55, my + 55, 110);
        sg2.addColorStop(0,  'rgba(255,255,255,0.06)');
        sg2.addColorStop(1,   'transparent');
        ctx.fillStyle = sg2;
        ctx.beginPath(); ctx.ellipse(mx + 55, my + 55, 105, 75, 0.8, 0, Math.PI * 2); ctx.fill();
      }

      // Press depression
      touches.current.forEach(tp => {
        const pp = Math.min((dsp.current.val - 14) / 41, 1);
        if (pp <= 0) return;
        const dg = ctx.createRadialGradient(tp.x, tp.y, 0, tp.x, tp.y, 85 * pp);
        dg.addColorStop(0,   `rgba(0,0,0,${0.22 * pp})`);
        dg.addColorStop(0.5, `rgba(0,0,0,${0.10 * pp})`);
        dg.addColorStop(1,    'transparent');
        ctx.fillStyle = dg; ctx.beginPath(); ctx.arc(tp.x, tp.y, 85 * pp, 0, Math.PI * 2); ctx.fill();

        const rg = ctx.createRadialGradient(tp.x, tp.y, 60 * pp, tp.x, tp.y, 135 * pp);
        rg.addColorStop(0,   `rgba(0,245,255,${0.16 * pp})`);
        rg.addColorStop(0.5, `rgba(0,245,255,${0.26 * pp})`);
        rg.addColorStop(1,    'transparent');
        ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(tp.x, tp.y, 135 * pp, 0, Math.PI * 2); ctx.fill();
      });

      // Ripples
      ripples.current = ripples.current.filter(r => r.t < r.max);
      ripples.current.forEach(r => {
        r.t++;
        const prog  = r.t / r.max;
        const rad   = prog * 230;
        const alpha = (1 - prog) * 0.32;
        const rg = ctx.createRadialGradient(r.x, r.y, rad * 0.55, r.x, r.y, rad);
        rg.addColorStop(0,   `rgba(0,245,255,${alpha * 0.35})`);
        rg.addColorStop(0.5, `rgba(0,245,255,${alpha})`);
        rg.addColorStop(1,    'transparent');
        ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(r.x, r.y, rad, 0, Math.PI * 2); ctx.fill();
      });

      // Rim glow
      const rim = ctx.createRadialGradient(W/2, H/2, Math.min(W,H)*0.22, W/2, H/2, Math.max(W,H)*0.8);
      rim.addColorStop(0,  'transparent');
      rim.addColorStop(1, `rgba(0,245,255,${0.09 + Math.sin(t * 0.7) * 0.03})`);
      ctx.fillStyle = rim; ctx.fillRect(0, 0, W, H);

      // Sparkle
      if (frame % 3 === 0) {
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.arc(Math.random()*W, Math.random()*H, 1+Math.random()*1.5, 0, Math.PI*2);
          ctx.fillStyle = `rgba(255,255,255,${0.04+Math.random()*0.08})`;
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
      spring.current = { rx: 0, ry: 0, vx: 0, vy: 0 };
      dsp.current = { val: 14, vel: 0 };
      const root = document.getElementById('root');
      if (root) root.style.transform = '';
    };
  }, [jellyScreen]);

  if (!jellyScreen) return null;

  return createPortal(
    <>
      <svg aria-hidden style={{ position:'fixed', width:0, height:0, top:0, left:0, overflow:'hidden' }}>
        <defs>
          <filter id="jelly-scr-filter" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.004 0.004"
              numOctaves="5"
              seed="7"
              stitchTiles="stitch"
              result="noise"
            />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="noise"
              scale="14"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <canvas
        ref={canvasRef}
        style={{ position:'fixed', inset:0, zIndex:9990, pointerEvents:'none', mixBlendMode:'screen' }}
      />

      <AnimatePresence>
        <motion.button
          onClick={deactivateScreen}
          style={{ position:'fixed', bottom:24, right:24, zIndex:9999 }}
          className="bg-background/90 border border-primary text-primary text-xs font-body tracking-widest px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors backdrop-blur-sm"
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.4 }}
        >
          EXIT JELLY
        </motion.button>
      </AnimatePresence>
    </>,
    document.body
  );
}
