"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const SLIDE_W = 1920;
const SLIDE_H = 1080;

/**
 * Slide stage — fills its container while preserving the 16:9 aspect ratio
 * of the source design (1920 × 1080). Uses uniform scale so circles stay
 * round, photos don't squish, etc. On non-16:9 viewports the slide is
 * centered with a matching background filling the letterbox.
 */
export function SlideStage({
  children,
  background = "var(--latam-offwhite)",
}: {
  children: ReactNode;
  background?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const compute = () => {
      const { width, height } = el.getBoundingClientRect();
      const s = Math.min(width / SLIDE_W, height / SLIDE_H);
      setScale(s > 0 ? s : 1);
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="slide-page relative w-full h-full overflow-hidden flex items-center justify-center"
      style={{ background }}
    >
      <div
        className="slide-stage"
        style={{ transform: `scale(${scale})`, background }}
      >
        {children}
      </div>
    </div>
  );
}

export { SLIDE_W, SLIDE_H };
