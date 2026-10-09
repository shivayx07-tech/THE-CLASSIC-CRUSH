import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Fades/slides children up (or zooms images out) once they enter the viewport. */
export function Reveal({ children, className, delay = 0, variant = "up" }: { children: ReactNode; className?: string; delay?: number; variant?: "up" | "zoom" }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={cn("transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]", variant === "up" ? (shown ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0") : (shown ? "scale-100 opacity-100" : "scale-110 opacity-0"), className)}>
      {children}
    </div>
  );
}

export function SectionHeading({ eyebrow, title, center, light }: { eyebrow?: string; title: string; center?: boolean; light?: boolean }) {
  return (
    <Reveal className={cn("mb-8", center && "text-center")}>
      {eyebrow && <p className="eyebrow text-gold">{eyebrow}</p>}
      <h2 className={cn("text-4xl font-semibold md:text-5xl", light && "text-forest-foreground")}>{title}</h2>
      <div className={cn("gold-rule mt-4 w-40", center && "mx-auto")} />
    </Reveal>
  );
}
