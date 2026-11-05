'use client';

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { Pause, Play, Volume2, VolumeX, GraduationCap, BarChart3, Target, Trophy, Video, Maximize, Users, Star } from 'lucide-react';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [rate, setRate] = useState(1);
  const frameRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);

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

  /* ---------- video: start, pause off-screen, respect reduced motion ---------- */
  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    video.muted = true; // React doesn't reflect `muted` into SSR HTML; autoplay needs it
    if (reduced) {
      userPaused.current = true;
      video.pause();
      setPlaying(false);
    } else {
      video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }

    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          if (!userPaused.current) video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  const togglePlay = async () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      try { await v.play(); } catch { /* blocked: stay paused */ }
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    const willMute = !v.muted;
    v.muted = willMute;
    setMuted(willMute);
    if (!willMute && v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    }
  };

  const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
  const onTime = () => {
    const v = videoRef.current;
    if (!v) return;
    const d = v.duration || 0;
    fillRef.current?.style.setProperty('--p', String(d ? v.currentTime / d : 0));
    if (timeRef.current) timeRef.current.textContent = `${fmt(v.currentTime)} / ${fmt(d)}`;
  };
  const seek = (e: MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    v.currentTime = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * v.duration;
  };
  const cycleRate = () => {
    const v = videoRef.current;
    const rates = [1, 1.25, 1.5, 2, 0.75];
    const next = rates[(rates.indexOf(rate) + 1) % rates.length];
    if (v) v.playbackRate = next;
    setRate(next);
  };
  const fullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else frameRef.current?.requestFullscreen?.();
  };

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
                    <div className="h3d-frame" ref={frameRef}>
                      <video
                        ref={videoRef}
                        className="h3d-video"
                        src="/videos/persona-intro.mp4"
                        poster="/images/hero-video-poster.jpg"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        aria-label="Persona Institute intro with Ajay Sir"
                        onPlay={() => setPlaying(true)}
                        onPause={() => setPlaying(false)}
                        onTimeUpdate={onTime}
                        onLoadedMetadata={onTime}
                        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
                      />
                      <span className="h3d-glare" aria-hidden="true" />
                      <span className="h3d-scrim" aria-hidden="true" />

                      <span className="h3d-live" aria-hidden="true">
                        <i><Video /></i>
                        <span><b>Live &amp; Recorded</b><small>Classes</small></span>
                      </span>
                      <button type="button" className="h3d-hd" onClick={fullscreen} aria-label="Fullscreen">
                        HD <Maximize />
                      </button>

                      {!playing && (
                        <button type="button" className="h3d-bigplay" onClick={togglePlay} aria-label="Play intro video">
                          <Play fill="currentColor" />
                        </button>
                      )}

                      <div className="h3d-controls" role="group" aria-label="Video controls">
                        <button type="button" onClick={togglePlay} aria-label={playing ? 'Pause video' : 'Play video'}>
                          {playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
                        </button>
                        <span className="h3d-time" ref={timeRef}>0:00 / 0:10</span>
                        <div className="h3d-bar" onClick={seek} role="slider" aria-label="Seek" aria-valuemin={0} aria-valuemax={100}>
                          <span className="h3d-bar-fill" ref={fillRef} />
                        </div>
                        <button type="button" onClick={toggleSound} aria-label={muted ? 'Turn sound on' : 'Mute video'}>
                          {muted ? <VolumeX /> : <Volume2 />}
                        </button>
                        <button type="button" className="h3d-rate" onClick={cycleRate} aria-label="Playback speed">{rate}x</button>
                        <button type="button" onClick={fullscreen} aria-label="Fullscreen"><Maximize /></button>
                      </div>
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
