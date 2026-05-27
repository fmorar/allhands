"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const SLIDE_W = 1920;
const SLIDE_H = 1080;

/**
 * Slide stage — fills its container while preserving the 16:9 aspect ratio
 * of the source design (1920 × 1080). Uses uniform scale so photos / circles
 * don't deform. Lets a `backgroundImage` cover the full viewport so the
 * letterbox area on non-16:9 screens matches the slide.
 */
export function SlideStage({
  children,
  background = "var(--latam-offwhite)",
  backgroundImage,
}: {
  children: ReactNode;
  background?: string;
  backgroundImage?: string;
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

  // When a bg image is set, both the outer (covers letterbox) and the inner
  // stage paint it. The outer uses background-size: cover so it fills the
  // viewport; the inner uses the same so the visual content lines up.
  const outerStyle: React.CSSProperties = backgroundImage
    ? {
        background,
        backgroundImage: `url("${backgroundImage}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    : { background };

  const innerStyle: React.CSSProperties = {
    transform: `scale(${scale})`,
    ...(backgroundImage
      ? {
          background: "transparent",
        }
      : { background }),
  };

  return (
    <div
      ref={containerRef}
      className="slide-page relative w-full h-full overflow-hidden flex items-center justify-center"
      style={outerStyle}
    >
      <div className="slide-stage" style={innerStyle}>
        {children}
      </div>
    </div>
  );
}

export { SLIDE_W, SLIDE_H };
