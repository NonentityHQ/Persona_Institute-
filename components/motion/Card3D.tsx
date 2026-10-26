'use client';

import { useRef, type ReactNode, type PointerEvent } from 'react';
import { m, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { SOFT_SPRING } from '@/lib/motion';
import { useFinePointer } from './useFinePointer';

type Props = {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees (kept 3–7° so it never feels shaky). */
  maxTilt?: number;
  /** Hover lift in px. */
  lift?: number;
  /** Soft highlight that follows the pointer. */
  glare?: boolean;
  perspective?: number;
  as?: 'div' | 'article' | 'li';
  disabled?: boolean;
};

const tags = { div: m.div, article: m.article, li: m.li } as const;

/**
 * 3D tilt card.
 *  - Mouse/trackpad only (touch + reduced-motion get a static card).
 *  - Pointer position feeds MotionValues → no React re-render while moving.
 *  - Over-damped spring → returns to neutral without overshoot.
 *  - Depth: children can opt in with .c3d-z1 / .c3d-z2 (translateZ 14px / 26px).
 */
export default function Card3D({
  children, className = '', maxTilt = 5, lift = 6, glare = true, perspective = 900, as = 'div', disabled = false,
}: Props) {
  const Tag = tags[as];
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced && !disabled;

  const box = useRef<{ r: DOMRect; sy: number } | null>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const hover = useMotionValue(0);
  const sx = useSpring(px, SOFT_SPRING);
  const sy = useSpring(py, SOFT_SPRING);
  const sh = useSpring(hover, SOFT_SPRING);

  const rotateY = useTransform(sx, [0, 1], [-maxTilt, maxTilt]);
  const rotateX = useTransform(sy, [0, 1], [maxTilt, -maxTilt]);
  const y = useTransform(sh, [0, 1], [0, -lift]);
  const gx = useTransform(sx, [0, 1], ['0%', '100%']);
  const gy = useTransform(sy, [0, 1], ['0%', '100%']);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,.5), rgba(255,255,255,0) 58%)`;
  const glareOpacity = useTransform(sh, [0, 1], [0, 1]);

  const measure = (el: HTMLElement) => { box.current = { r: el.getBoundingClientRect(), sy: window.scrollY }; };

  const onEnter = (e: PointerEvent<HTMLElement>) => {
    if (!enabled || e.pointerType !== 'mouse') return;
    measure(e.currentTarget);
    hover.set(1);
  };
  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!enabled || e.pointerType !== 'mouse') return;
    if (!box.current || box.current.sy !== window.scrollY) measure(e.currentTarget);
    const { r } = box.current!;
    px.set(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
    py.set(Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)));
  };
  const onLeave = () => {
    box.current = null;
    px.set(0.5); py.set(0.5); hover.set(0);
  };

  return (
    <Tag
      className={`c3d ${className}`}
      style={enabled ? { rotateX, rotateY, y, transformPerspective: perspective, transformStyle: 'preserve-3d' } : undefined}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerCancel={onLeave}
    >
      {children}
      {glare && enabled && <m.span aria-hidden="true" className="c3d-glare" style={{ background: glareBg, opacity: glareOpacity }} />}
    </Tag>
  );
}
