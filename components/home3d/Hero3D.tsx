'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { GraduationCap, BarChart3, Target, Trophy, Users, Star } from 'lucide-react';
import HeroVideo from './HeroVideo';

type Props = {
  /** Top of the copy column: eyebrow, heading, sub-title. */
  children: ReactNode;
  /** Bottom of the copy column: feature icons, CTAs, social proof.
   *  On phones the video sits BETWEEN `children` and `after`, so it is seen without scrolling far. */
  after?: ReactNode;
  learnersLabel?: string;
};

/** Per-layer depth: --z = real Z (px), --k = pointer parallax strength (px). */
const depth = (z: number, k: number) => ({ '--z': `${z}px`, '--k': k }) as CSSProperties;

/**
 * Hero = text column + a real 3D stage.
 *
 * The intro video now lives INSIDE a floating 3D "slab" on the right, instead of being a
 * full-bleed background that sat behind the heading. Text and video never overlap.
 *
 * Perf notes: pointer + scroll feed three CSS variables (--px, --py, --sy) through
 * requestAnimationFrame - no React re-renders while moving. Only transform / opacity animate.
 * Touch devices and prefers-reduced-motion get a calm static (or gently swaying) scene.
 */
export default function Hero3D({ children, after, learnersLabel = '10,000+ Learners' }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  /* ---------- pointer + scroll parallax ---------- */
  useEffect(() => {
    const root = rootRef.current;
    const scene = sceneRef.current;
    if (!root || !scene) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, sraf = 0;

    const tick = () => {
      cx += (tx - cx) * 0.085;
      cy += (ty - cy) * 0.085;
      scene.style.setProperty('--px', cx.toFixed(3));
      scene.style.setProperty('--py', cy.toFixed(3));
      raf = Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002 ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const r = root.getBoundingClientRect();
      // While the cursor is ON the video, the slab settles almost flat so the Play / Sound
      // buttons are a stable click target (and the picture stays readable).
      const k = (e.target as Element | null)?.closest?.('.h3d-frame') ? 0.15 : 1;
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2 * k;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2 * k;
      kick();
    };
    const onLeave = () => { tx = 0; ty = 0; kick(); };

    const onScroll = () => {
      if (sraf) return;
      sraf = requestAnimationFrame(() => {
        sraf = 0;
        const p = Math.min(1, Math.max(0, window.scrollY / (root.offsetHeight || 1)));
        root.style.setProperty('--sy', p.toFixed(3));
      });
    };

    if (fine) {
      root.addEventListener('pointermove', onMove);
      root.addEventListener('pointerleave', onLeave);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(sraf);
    };
  }, []);

  return (
    <section id="home" ref={rootRef} className="h3d-hero">
      <div className="h3d-bg" aria-hidden="true">
        <span className="h3d-wash h3d-wash-a" />
        <span className="h3d-wash h3d-wash-b" />
      </div>

      <div className="h3d-hero-inner">
        <div className="h3d-copy h3d-copy-top">{children}</div>

        <div className="h3d-stage">
          {/* flat backdrop: red blob behind the video + thin orbit line with glowing dots */}
          <svg className="h3d-orbit" viewBox="0 0 1000 660" aria-hidden="true">
            <defs>
              <linearGradient id="h3dRed" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ff6377" /><stop offset="1" stopColor="#ee1230" />
              </linearGradient>
              <radialGradient id="h3dGlow"><stop offset="0" stopColor="#fff" stopOpacity=".75" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
            </defs>
            <ellipse cx="380" cy="300" rx="500" ry="350" fill="url(#h3dGlow)" />
            <path d="M135 58 L640 230 L560 470 L330 527 L40 507 Z" fill="url(#h3dRed)" stroke="url(#h3dRed)" strokeWidth="30" strokeLinejoin="round" />
            <path d="M520 62 C600 10 720 -10 754 47 C790 110 800 180 797 240 C794 320 790 380 772 437 C760 480 730 505 690 520" fill="none" stroke="#ee1230" strokeWidth="2.4" strokeLinecap="round" />
            {[[754, 47], [797, 240], [772, 437]].map(([x, y]) => (
              <g key={x}><circle cx={x} cy={y} r="17" fill="#ee1230" opacity=".16" /><circle cx={x} cy={y} r="7.5" fill="#fff" stroke="#ee1230" strokeWidth="3" /></g>
            ))}
          </svg>

          <div className="h3d-persp">
            <div className="h3d-sway">
              <div className="h3d-scene" ref={sceneRef}>
                <div className="h3d-layer h3d-layer-device" style={depth(0, 0)}>
                  <div className="h3d-device">
                    <div className="h3d-frame">
                      <HeroVideo />
                    </div>
                  </div>
                </div>

              <div className="h3d-layer h3d-chip-a" style={depth(95, 22)}>
                <div className="h3d-float" style={{ '--dur': '6.4s', '--del': '-1s' } as CSSProperties}>
                  <div className="h3d-chip h3d-t-pink"><span className="h3d-chip-ico"><GraduationCap /></span><span><b>Expert</b><small>Guidance</small></span></div>
                </div>
              </div>
              <div className="h3d-layer h3d-chip-b" style={depth(125, 32)}>
                <div className="h3d-float" style={{ '--dur': '5.6s', '--del': '-2.4s' } as CSSProperties}>
                  <div className="h3d-chip h3d-t-blue"><span className="h3d-chip-ico"><BarChart3 /></span><span><b>Structured</b><small>Learning</small></span></div>
                </div>
              </div>
              <div className="h3d-layer h3d-chip-c" style={depth(75, 16)}>
                <div className="h3d-float" style={{ '--dur': '7s', '--del': '-3.2s' } as CSSProperties}>
                  <div className="h3d-chip h3d-t-gold"><span className="h3d-chip-ico"><Target /></span><span><b>Practice</b><small>&amp; Improve</small></span></div>
                </div>
              </div>
              <div className="h3d-layer h3d-chip-d" style={depth(110, 28)}>
                <div className="h3d-float" style={{ '--dur': '6.2s', '--del': '-0.8s' } as CSSProperties}>
                  <div className="h3d-chip h3d-t-violet"><span className="h3d-chip-ico"><Trophy /></span><span><b>Build</b><small>Confidence</small></span></div>
                </div>
              </div>

              {/* Stats inside scene so mobile 2-col grid places them under chips */}
              <div className="h3d-statcards">
                <div className="h3d-statcard">
                  <span className="h3d-statcard-ico"><Users /></span>
                  <span><b>{learnersLabel}</b><small>learning with us</small></span>
                </div>
                <i className="h3d-slash" aria-hidden="true" />
                <div className="h3d-statcard h3d-statcard-r">
                  <span className="h3d-statcard-ico h3d-gold"><Star fill="currentColor" /></span>
                  <span><b>4.8/5</b><small>Student Rating</small></span>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>

        {after && <div className="h3d-copy h3d-copy-bottom">{after}</div>}
      </div>
    </section>
  );
}
