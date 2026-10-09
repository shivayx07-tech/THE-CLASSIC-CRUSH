import { useEffect, useState } from "react";

const doodles = [
  "M6 3c3 2 3 8 0 10M6 3c-3 2-3 8 0 10", // bean
  "M2 10c2-6 10-6 12 0M4 10l2-4M8 10V5M12 10l-2-4", // croissant
  "M5 14c-2-3 2-4 0-7s2-4 0-6M10 14c-2-3 2-4 0-7s2-4 0-6", // steam
  "M8 15V2M8 5l-3-2M8 5l3-2M8 9l-3-2M8 9l3-2", // wheat
  "M8 1v14M1 8h14", // sparkle
  "M8 14s-6-3.5-6-8a3 3 0 016-1 3 3 0 016 1c0 4.5-6 8-6 8z", // heart
  "M8 15V8M5 8c-2-5 1-7 3-7s5 2 3 7z", // whisk
];

/** Floating doodles, falling gold flecks and corner vines with gentle parallax. */
export function Ambient({ count = 14 }: { count?: number }) {
  const [y, setY] = useState(0);
  useEffect(() => {
    const on = () => setY(window.scrollY);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <>
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ transform: `translateY(${y * 0.15}px)` }}>
        {Array.from({ length: count }).map((_, i) => (
          <svg key={i} viewBox="0 0 16 16" className="doodle absolute size-9 stroke-primary/25" style={{ left: `${(i * 37 + 7) % 94}%`, top: `${(i * 61 + 5) % 96}%`, animationDelay: `${i * 0.7}s` }} fill="none" strokeWidth={1} strokeLinecap="round"><path d={doodles[i % doodles.length]} /></svg>
        ))}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {Array.from({ length: 22 }).map((_, i) => (
          <span key={i} className="fleck" style={{ left: `${(i * 53) % 100}%`, animationDelay: `${(i * 1.3) % 9}s`, animationDuration: `${9 + (i % 5) * 2}s` }} />
        ))}
      </div>
      <Vine className="-bottom-6 -right-6 size-56 md:size-80" />
      <Vine className="-left-6 -top-6 size-40 rotate-180 md:size-56" />
    </>
  );
}

export function Vine({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 200 200" className={`vine pointer-events-none absolute fill-none stroke-primary/50 ${className}`} strokeWidth={1.5}>
      <path d="M200 200C160 160 150 120 160 70S120 10 90 0" />
      <path className="fill-primary/20" d="M160 120c-20-5-30-20-25-35 15 5 25 18 25 35zM120 35c-18 2-30-8-32-22 16-2 28 8 32 22z" />
      <path className="fill-gold/30 stroke-gold/60" d="M155 80c15-12 32-10 40 0-12 10-28 10-40 0z" />
    </svg>
  );
}
