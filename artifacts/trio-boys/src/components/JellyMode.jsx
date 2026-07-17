import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJelly } from '@/lib/JellyContext';

const COLORS = [
  { fill: '#00F5FF', label: 'cyan' },
  { fill: '#DFFF00', label: 'lime' },
  { fill: '#FF69B4', label: 'pink' },
  { fill: '#FF8C00', label: 'orange' },
  { fill: '#A855F7', label: 'purple' },
];

function makeBlob() {
  const col = COLORS[Math.floor(Math.random() * COLORS.length)];
  const size = 44 + Math.random() * 88;
  return {
    id: Math.random().toString(36).slice(2),
    x: Math.random() * (window.innerWidth - size),
    y: Math.random() * (window.innerHeight - size),
    size,
    color: col.fill,
    points: size > 100 ? 1 : size > 70 ? 2 : 3,
    // random drift offsets for keyframe animation
    dx: (Math.random() - 0.5) * 260,
    dy: (Math.random() - 0.5) * 220,
    dur: 5 + Math.random() * 5,
  };
}

export default function JellyMode() {
  const { jellyMode, deactivate, score, addScore } = useJelly();
  const [blobs, setBlobs] = useState([]);
  const [pops, setPops] = useState([]);
  const [showBanner, setShowBanner] = useState(false);

  // Body class + initial blobs
  useEffect(() => {
    if (jellyMode) {
      document.body.classList.add('jelly-active');
      setBlobs(Array.from({ length: 12 }, makeBlob));
      setShowBanner(true);
      const t = setTimeout(() => setShowBanner(false), 2500);
      return () => clearTimeout(t);
    } else {
      document.body.classList.remove('jelly-active');
      setBlobs([]);
      setPops([]);
    }
    return () => document.body.classList.remove('jelly-active');
  }, [jellyMode]);

  // Spawn new blobs periodically (keep it lively)
  useEffect(() => {
    if (!jellyMode) return;
    const id = setInterval(() => {
      setBlobs(prev => prev.length >= 20 ? prev : [...prev, makeBlob()]);
    }, 2500);
    return () => clearInterval(id);
  }, [jellyMode]);

  const popBlob = useCallback((blob) => {
    addScore(blob.points);
    setPops(prev => [...prev, {
      id: Math.random().toString(36),
      x: blob.x + blob.size / 2,
      y: blob.y,
      pts: blob.points,
    }]);
    setBlobs(prev => prev.filter(b => b.id !== blob.id));
  }, [addScore]);

  // Clean up old pops
  useEffect(() => {
    if (pops.length === 0) return;
    const t = setTimeout(() => setPops(prev => prev.slice(1)), 900);
    return () => clearTimeout(t);
  }, [pops]);

  if (!jellyMode) return null;

  return (
    <>
      {/* Blob layer — sits behind page content, pointer-events on blobs only */}
      <div className="fixed inset-0 z-30 pointer-events-none overflow-hidden">

        {/* Blobs */}
        {blobs.map(blob => (
          <motion.button
            key={blob.id}
            className="absolute rounded-full pointer-events-auto select-none focus:outline-none"
            style={{
              width: blob.size,
              height: blob.size,
              left: blob.x,
              top: blob.y,
              background: `radial-gradient(circle at 35% 35%, ${blob.color}cc, ${blob.color}44)`,
              border: `2px solid ${blob.color}`,
              boxShadow: `0 0 18px ${blob.color}66`,
              backdropFilter: 'blur(2px)',
            }}
            animate={{
              x: [0, blob.dx, blob.dx * -0.6, blob.dx * 0.4, 0],
              y: [0, blob.dy * 0.5, blob.dy, blob.dy * -0.4, 0],
              scaleX: [1, 1.12, 0.9, 1.06, 1],
              scaleY: [1, 0.9, 1.12, 0.96, 1],
              rotate: [0, 12, -8, 5, 0],
            }}
            transition={{ duration: blob.dur, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.25, boxShadow: `0 0 32px ${blob.color}` }}
            whileTap={{ scale: 0.1, opacity: 0, transition: { duration: 0.15 } }}
            onClick={() => popBlob(blob)}
            aria-label={`Jelly blob — ${blob.points} point${blob.pts !== 1 ? 's' : ''}`}
          >
            {/* point label inside blob */}
            <span
              className="absolute inset-0 flex items-center justify-center font-display font-black text-white/70 select-none"
              style={{ fontSize: blob.size * 0.28 }}
            >
              {blob.points}
            </span>
          </motion.button>
        ))}

        {/* Score pops */}
        <AnimatePresence>
          {pops.map(pop => (
            <motion.div
              key={pop.id}
              className="absolute font-display font-black text-accent pointer-events-none drop-shadow-lg"
              style={{ left: pop.x, top: pop.y, fontSize: '2rem' }}
              initial={{ opacity: 1, y: 0, scale: 0.8 }}
              animate={{ opacity: 0, y: -70, scale: 1.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
            >
              +{pop.pts}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* HUD — always on top */}
      <div className="fixed top-20 right-4 z-50 flex flex-col items-end gap-2 pointer-events-auto">
        <motion.div
          className="bg-background/90 border border-primary backdrop-blur-md rounded-xl px-4 py-3 text-center min-w-[90px]"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        >
          <p className="text-primary text-[0.6rem] tracking-[0.25em] font-body uppercase">Jelly Score</p>
          <motion.p
            key={score}
            className="text-foreground font-display text-3xl font-black leading-none mt-0.5"
            initial={{ scale: 1.5, color: '#DFFF00' }}
            animate={{ scale: 1, color: '#ffffff' }}
            transition={{ duration: 0.3 }}
          >
            {score}
          </motion.p>
        </motion.div>
        <button
          onClick={deactivate}
          className="text-[0.65rem] text-muted-foreground hover:text-destructive transition-colors tracking-widest uppercase font-body"
        >
          ✕ Exit Jelly
        </button>
      </div>

      {/* Activation banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
            initial={{ y: -60, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -60, opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          >
            <div className="bg-primary text-primary-foreground px-8 py-3 font-display font-black tracking-widest text-sm text-center shadow-2xl">
              🍮 JELLY MODE ACTIVATED — POP THE BLOBS!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
