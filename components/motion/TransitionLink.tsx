'use client';

import NextLink from 'next/link';
import type { ComponentProps, MouseEvent } from 'react';
import { useRouteTransition, type SharedSource } from './RouteTransition';

type SharedFrom = {
  /** Same id must be given to <SharedImage id=…/> on the destination page. */
  id: string;
  /** Returns the element (clipped, rounded image box) the morph should start from. */
  getBox: () => HTMLElement | null;
};

type Props = Omit<ComponentProps<typeof NextLink>, 'href'> & {
  href: string;
  sharedFrom?: SharedFrom;
};

function readShared(from: SharedFrom): SharedSource | undefined {
  const box = from.getBox();
  const img = box?.querySelector('img');
  if (!box || !img) return undefined;
  const r = box.getBoundingClientRect();
  if (r.width < 8 || r.height < 8) return undefined;
  const radius = parseFloat(getComputedStyle(box).borderTopLeftRadius) || 0;
  return {
    id: from.id,
    src: img.currentSrc || img.src,
    rect: { left: r.left, top: r.top, width: r.width, height: r.height },
    radius,
  };
}

/**
 * Drop-in replacement for next/link. Plain left-clicks run the cinematic exit
 * before navigating; modified clicks (new tab, download…), hash-only links,
 * external URLs and target="_blank" fall through to the browser untouched.
 */
export default function TransitionLink({ href, onClick, sharedFrom, target, ...rest }: Props) {
  const { navigate } = useRouteTransition();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (target && target !== '_self') return;
    if (href.startsWith('#') || /^(https?:)?\/\//.test(href) || /^(mailto|tel):/.test(href)) return;
    event.preventDefault();
    navigate(href, { shared: sharedFrom ? readShared(sharedFrom) : undefined });
  };

  return <NextLink href={href} target={target} onClick={handleClick} {...rest} />;
}
