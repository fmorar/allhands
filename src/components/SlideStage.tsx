"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const SLIDE_W = 1920;
const SLIDE_H = 1080;

/**
 * Slide stage — always fills 100% of its container (which is 100vw × 100vh).
 * Internal layout is authored at 1920 × 1080 and scaled INDEPENDENTLY on each
 * axis so it stretches to fit the viewport exactly. On 16:9 screens there is
 * no distortion; on other aspect ratios there's mild stretch which keeps all
 * content visible (vs cropping or letterboxing).
 */
export function SlideStage({
  children,
  background = "var(--latam-offwhite)",
}: {
  children: ReactNode;
  background?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState({ x: 1, y: 1 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const compute = () => {
      const { width, height } = el.getBoundingClientRect();
      setScale({
        x: width > 0 ? width / SLIDE_W : 1,
        y: height > 0 ? height / SLIDE_H : 1,
      });
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="slide-page relative w-full h-full overflow-hidden"
      style={{ background }}
    >
      <div
        className="slide-stage"
        style={{ transform: `scale(${scale.x}, ${scale.y})`, background }}
      >
        {children}
      </div>
    </div>
  );
}

export { SLIDE_W, SLIDE_H };
