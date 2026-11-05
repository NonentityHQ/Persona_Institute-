'use client';

import { m } from 'framer-motion';
import { Sparkles } from 'lucide-react';

/**
 * Rotating, floating 3D gift box built with pure CSS 3D (no WebGL, no extra deps).
 * The lid pops open every few seconds and sparkles fly out.
 * tone: 'gold' (yellow box + red ribbon, for light backgrounds) | 'red' (red box + gold ribbon, for dark ones)
 */
const TONES = {
  gold: { body: 'linear-gradient(160deg,#ffd447,#f59e0b)', lid: 'linear-gradient(160deg,#ffe066,#f7a600)', ribbon: 'linear-gradient(90deg,#c8102e,#ff4d6d 50%,#c8102e)', bow: '#e11d48', knot: 'linear-gradient(160deg,#ff5d7d,#c8102e)' },
  red: { body: 'linear-gradient(160deg,#ff4468,#cf0a2e)', lid: 'linear-gradient(160deg,#ff5875,#dc1038)', ribbon: 'linear-gradient(90deg,#f2ae1c,#ffe9a6 50%,#f2ae1c)', bow: '#ffd45c', knot: 'linear-gradient(160deg,#ffe58f,#f0a500)' },
} as const;
const GLOW = 'radial-gradient(circle,#fff6c4,#ffb703 70%)';
const SHADE = ['rgba(0,0,0,0)', 'rgba(0,0,0,.3)', 'rgba(0,0,0,.14)', 'rgba(0,0,0,.26)', 'rgba(255,255,255,.18)', 'rgba(0,0,0,.5)'];

function Cuboid({ w, h, d, oy = 0, base, topBg, ribbon }: { w: number; h: number; d: number; oy?: number; base: string; topBg?: string; ribbon?: string }) {
  const faces: Array<[number, number, string]> = [
    [w, h, `translateZ(${d / 2}px)`], [w, h, `rotateY(180deg) translateZ(${d / 2}px)`],
    [d, h, `rotateY(90deg) translateZ(${w / 2}px)`], [d, h, `rotateY(-90deg) translateZ(${w / 2}px)`],
    [w, d, `rotateX(90deg) translateZ(${h / 2}px)`], [w, d, `rotateX(-90deg) translateZ(${h / 2}px)`],
  ];
  return (
    <div style={{ position: 'absolute', width: w, height: h, left: -w / 2, top: -h / 2 + oy, transformStyle: 'preserve-3d' }}>
      {faces.map(([fw, fh, t], i) => (
        <div key={i} style={{ position: 'absolute', width: fw, height: fh, left: (w - fw) / 2, top: (h - fh) / 2, transform: t, overflow: 'hidden', backfaceVisibility: 'hidden',
          background: `linear-gradient(135deg,rgba(255,255,255,.28),transparent 55%),linear-gradient(${SHADE[i]},${SHADE[i]}),${i === 4 && topBg ? topBg : base}` }}>
          {ribbon && i < 5 && <span style={{ position: 'absolute', top: 0, bottom: 0, left: '38%', width: '24%', background: ribbon }} />}
          {ribbon && i === 4 && <span style={{ position: 'absolute', left: 0, right: 0, top: '38%', height: '24%', background: ribbon }} />}
        </div>
      ))}
    </div>
  );
}

function Bow({ y, color, knot }: { y: number; color: string; knot: string }) {
  const loop = (s: number): React.CSSProperties => ({ position: 'absolute', width: 40, height: 30, left: -20 + s * 17, top: -28, border: `7px solid ${color}`, borderRadius: '50%', boxShadow: 'inset 0 0 7px rgba(90,0,20,.4),0 3px 5px rgba(0,0,0,.22)', transform: `rotateZ(${s * 30}deg)` });
  return (
    <div style={{ position: 'absolute', left: 0, top: y, transformStyle: 'preserve-3d' }}>
      {[0, 90].map((a) => (
        <div key={a} style={{ position: 'absolute', left: 0, top: 0, transformStyle: 'preserve-3d', transform: `rotateY(${a}deg)` }}>
          <span style={loop(-1)} /><span style={loop(1)} />
        </div>
      ))}
      <Cuboid w={20} h={14} d={20} oy={-4} base={knot} />
    </div>
  );
}

export default function GiftBox3D({ tone = 'gold', className = '' }: { tone?: keyof typeof TONES; className?: string }) {
  const c = TONES[tone];
  const W = 92, H = 70, LH = 26, LW = W + 10;
  const cycle = { duration: 5.5, times: [0, .45, .58, .82, 1], repeat: Infinity, ease: 'easeInOut' as const };
  return (
    <div aria-hidden className={`relative mx-auto h-[190px] w-[170px] ${className}`}>
      <m.span className="absolute bottom-2 left-[calc(50%-48px)] h-4 w-24 rounded-[50%] bg-black/30 blur-md" animate={{ scale: [1, .78, 1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
      <m.div className="absolute inset-0" animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
        <div className="absolute left-1/2 top-[64%]" style={{ perspective: 800 }}>
          <div style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-22deg)' }}>
            <m.div style={{ transformStyle: 'preserve-3d' }} animate={{ rotateY: 360 }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}>
              <Cuboid w={W} h={H} d={W} base={c.body} topBg={GLOW} ribbon={c.ribbon} />
              <m.div style={{ position: 'absolute', left: 0, top: 0, transformStyle: 'preserve-3d' }} animate={{ y: [0, 0, -40, -40, 0], rotateZ: [0, 0, -9, -9, 0] }} transition={cycle}>
                <Cuboid w={LW} h={LH} d={LW} oy={-(H / 2 + LH / 2) + 2} base={c.lid} ribbon={c.ribbon} />
                <Bow y={-(H / 2 + LH) + 2} color={c.bow} knot={c.knot} />
              </m.div>
            </m.div>
          </div>
        </div>
      </m.div>
      {[-26, -6, 14, 30, 0].map((x, i) => (
        <m.span key={i} className="absolute left-1/2 top-[30%] text-amber-400" style={{ marginLeft: x }} animate={{ y: [0, 0, -30, -56, -56], opacity: [0, 0, 1, 0, 0], scale: [.3, .3, 1.1, .5, .3] }} transition={{ ...cycle, delay: i * .05 }}>
          <Sparkles className="h-4 w-4" />
        </m.span>
      ))}
    </div>
  );
}
