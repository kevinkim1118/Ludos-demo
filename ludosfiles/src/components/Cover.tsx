import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { COVERS, type CoverEntry } from '../data/covers';

interface CoverProps {
  /** Slot id from the design handoff, e.g. `cv-h2h-hades`. */
  id: string;
  alt?: string;
  /** Sizing/positioning for the cropping box. */
  style?: CSSProperties;
  className?: string;
  /** Rendered when the slot has no artwork — e.g. reviewer initials. */
  fallback?: ReactNode;
}

interface Geometry {
  width: string;
  height: string;
  left: string;
  top: string;
}

/**
 * Reproduces the design tool's crop geometry.
 *
 * A cover is scaled to cover the box (its "base" scale), times any saved zoom.
 * `x`/`y` then pan it as a percentage of the *box*, clamped to however much the
 * image actually overflows — so panning never exposes the background, and a
 * crop saved against a differently-shaped box degrades to the nearest edge
 * rather than tearing a gap. This is the same math `image-slot.js` ran.
 */
function measure(box: HTMLElement, img: HTMLImageElement, entry: CoverEntry): Geometry | null {
  const fw = box.clientWidth;
  const fh = box.clientHeight;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!fw || !fh || !iw || !ih) return null;

  const base = Math.max(fw / iw, fh / ih);
  const scaled = base * (entry.s ?? 1);
  const width = iw * scaled;
  const height = ih * scaled;

  // Pan range on each axis is half the overflow past the box edge.
  const maxX = Math.max(0, (width / fw - 1) * 50);
  const maxY = Math.max(0, (height / fh - 1) * 50);
  const x = Math.min(maxX, Math.max(-maxX, entry.x ?? 0));
  const y = Math.min(maxY, Math.max(-maxY, entry.y ?? 0));

  return {
    width: `${(width / fw) * 100}%`,
    height: `${(height / fh) * 100}%`,
    left: `${50 + x}%`,
    top: `${50 + y}%`,
  };
}

/** Static replacement for the prototype's drag-and-drop `<image-slot>`. */
export function Cover({ id, alt = '', style, className, fallback }: CoverProps) {
  const entry = COVERS[id];
  const hasCrop = !!entry && (entry.s != null || entry.x != null || entry.y != null);

  const boxRef = useRef<HTMLSpanElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [geometry, setGeometry] = useState<Geometry | null>(null);

  const recompute = useCallback(() => {
    if (!hasCrop || !entry) return;
    const box = boxRef.current;
    const img = imgRef.current;
    if (!box || !img || !img.complete) return;
    setGeometry(measure(box, img, entry));
  }, [entry, hasCrop]);

  // Uncropped covers are plain `object-fit: cover` and need no measuring.
  useEffect(() => {
    if (!hasCrop) return;
    const box = boxRef.current;
    if (!box) return;
    recompute();
    const observer = new ResizeObserver(recompute);
    observer.observe(box);
    return () => observer.disconnect();
  }, [hasCrop, recompute]);

  const box: CSSProperties = {
    display: 'block',
    overflow: 'hidden',
    background: 'var(--surface-3)',
    ...style,
  };

  if (!entry) {
    return (
      <span
        className={className}
        style={{
          ...box,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          fontSize: 11,
          fontWeight: 600,
          textAlign: 'center',
        }}
      >
        {fallback}
      </span>
    );
  }

  if (!hasCrop) {
    return (
      <span className={className} style={box}>
        <img
          src={entry.src}
          alt={alt}
          loading="lazy"
          decoding="async"
          style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </span>
    );
  }

  return (
    <span ref={boxRef} className={className} style={{ ...box, position: 'relative' }}>
      <img
        ref={imgRef}
        src={entry.src}
        alt={alt}
        decoding="async"
        onLoad={recompute}
        style={
          geometry
            ? {
                position: 'absolute',
                maxWidth: 'none',
                width: geometry.width,
                height: geometry.height,
                left: geometry.left,
                top: geometry.top,
                transform: 'translate(-50%, -50%)',
              }
            : // Pre-measurement fallback: correct scale, centred.
              { display: 'block', width: '100%', height: '100%', objectFit: 'cover' }
        }
      />
    </span>
  );
}
