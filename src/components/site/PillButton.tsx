import { useRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

/** Pill-shaped wrapper with a subtle magnetic pull toward the cursor. */
export function PillButton({
  children,
  className,
  variant = "primary",
}: {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "gold" | "outline";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const move = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.15}px, ${(e.clientY - r.top - r.height / 2) * 0.25}px)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  const styles = {
    primary: "bg-primary text-primary-foreground hover:shadow-lift",
    gold: "bg-gold-gradient text-gold-foreground hover:shadow-lift",
    outline: "border border-gold/60 text-current hover:bg-gold hover:text-gold-foreground",
  }[variant];
  return (
    <span
      ref={ref}
      onMouseMove={move}
      onMouseLeave={leave}
      className={cn(
        "inline-flex rounded-full transition-[transform,box-shadow,background-color,color] duration-300 ease-out [&>*]:inline-flex [&>*]:h-12 [&>*]:items-center [&>*]:gap-2 [&>*]:rounded-full [&>*]:px-7 [&>*]:text-sm [&>*]:font-semibold",
        styles,
        className,
      )}
    >
      {children}
    </span>
  );
}
