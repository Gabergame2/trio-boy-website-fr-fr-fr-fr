import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useJelly } from '@/lib/JellyContext';

export default function JellyScreen() {
  const { jellyScreen, deactivateScreen } = useJelly();
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const turbRef   = useRef(null);
  const mouse     = useRef({ x: -999, y: -999 });
  const clicks    = useRef([]); // { x, y, t } ripple origins

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

  /* ── Canvas animation loop ── */
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

    const onMove = (e) => {
      const src = e.touches?.[0] ?? e;
      mouse.current = { x: src.clientX, y: src.clientY };
    };
    const onClick = (e) => {
      clicks.current.push({ x: e.clientX, y: e.clientY, t: 0 });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove',  onMove, { passive: true });
    window.addEventListener('click', onClick);

    let frame = 0;

    const draw = () => {
      frame++;
      const t = frame * 0.014;

      /* — animate turbulence — */
      if (turbRef.current) {
        const base = 0.006 + Math.sin(t * 0.35) * 0.0035 + Math.cos(t * 0.2) * 0.002;
        turbRef.current.setAttribute(
          'baseFrequency',
          `${base.toFixed(5)} ${(base * 0.8).toFixed(5)}`
        );
        // subtle seed drift for organic feel
        if (frame % 4 === 0) {
          turbRef.current.setAttribute(
            'seed',
            String(2 + Math.floor(Math.abs(Math.sin(t * 0.08)) * 8))
          );
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width, H = canvas.height;

      /* — large jelly colour blobs — */
      const blobs = [
        { rx: 0.12, ry: 0.18, r: 0.5,  c: [0, 245, 255],  ph: 0   },
        { rx: 0.88, ry: 0.82, r: 0.45, c: [223, 255,  0],  ph: 2.1 },
        { rx: 0.5,  ry: 0.45, r: 0.38, c: [0,  245, 255],  ph: 4.2 },
        { rx: 0.2,  ry: 0.75, r: 0.32, c: [223, 255,  0],  ph: 1.3 },
        { rx: 0.8,  ry: 0.22, r: 0.3,  c: [160,  80, 255], ph: 3.0 },
      ];
      blobs.forEach(b => {
        const x  = W * b.rx + Math.sin(t * 0.45 + b.ph) * 60;
        const y  = H * b.ry + Math.cos(t * 0.38 + b.ph) * 50;
        const r  = W * b.r  * (1 + Math.sin(t * 0.6 + b.ph) * 0.07);
        const g  = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0,   `rgba(${b.c},0.07)`);
        g.addColorStop(0.55,`rgba(${b.c},0.035)`);
        g.addColorStop(1,    'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      /* — specular highlight that follows mouse — */
      const mx = mouse.current.x, my = mouse.current.y;
      if (mx > -900) {
        // primary specular lobe
        const sg = ctx.createRadialGradient(mx - 45, my - 45, 0, mx - 10, my - 10, 200);
        sg.addColorStop(0,   'rgba(255,255,255,0.22)');
        sg.addColorStop(0.25,'rgba(255,255,255,0.10)');
        sg.addColorStop(0.6, 'rgba(255,255,255,0.03)');
        sg.addColorStop(1,    'transparent');
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.ellipse(mx - 30, my - 30, 170, 120, -0.5, 0, Math.PI * 2);
        ctx.fill();

        // secondary soft lobe
        const sg2 = ctx.createRadialGradient(mx + 60, my + 60, 0, mx + 60, my + 60, 120);
        sg2.addColorStop(0,  'rgba(255,255,255,0.06)');
        sg2.addColorStop(1,   'transparent');
        ctx.fillStyle = sg2;
        ctx.beginPath();
        ctx.ellipse(mx + 60, my + 60, 110, 80, 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      /* — click ripples — */
      clicks.current = clicks.current.filter(c => c.t < 60);
      clicks.current.forEach(c => {
        c.t++;
        const progress = c.t / 60;
        const r = progress * 200;
        const alpha = (1 - progress) * 0.3;
        const rg = ctx.createRadialGradient(c.x, c.y, r * 0.6, c.x, c.y, r);
        rg.addColorStop(0,  `rgba(0,245,255,${alpha * 0.5})`);
        rg.addColorStop(0.5,`rgba(0,245,255,${alpha})`);
        rg.addColorStop(1,   'transparent');
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      /* — edge rim glow — */
      const rim = ctx.createRadialGradient(
        W / 2, H / 2, Math.min(W, H) * 0.22,
        W / 2, H / 2, Math.max(W, H) * 0.8
      );
      rim.addColorStop(0,  'transparent');
      rim.addColorStop(1, `rgba(0,245,255,${0.09 + Math.sin(t * 0.7) * 0.03})`);
      ctx.fillStyle = rim;
      ctx.fillRect(0, 0, W, H);

      /* — subtle surface sparkle — */
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
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('click', onClick);
      clicks.current = [];
    };
  }, [jellyScreen]);

  if (!jellyScreen) return null;

  return createPortal(
    <>
      {/* SVG filter — applied to #root via JS, NOT to this portal */}
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
              in="SourceGraphic"
              in2="noise"
              scale="24"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Jelly sheen canvas */}
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

      {/* Exit */}
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
