import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex aspect-square flex-col items-center justify-center rounded-full border-2 border-gold bg-card text-primary",
        className,
      )}
    >
      <span className="font-display text-[1.1em] font-semibold leading-none">Tcc</span>
    </div>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <LogoMark className="h-11 w-11 text-base" />
      <div className="leading-tight">
        <div
          className={cn(
            "font-display text-xl font-semibold",
            light ? "text-forest-foreground" : "text-primary",
          )}
        >
          The Classic Crush
        </div>
        <div
          className={cn("eyebrow !text-[0.6rem]", light ? "text-gold" : "text-muted-foreground")}
        >
          Bakery & Café
        </div>
      </div>
    </div>
  );
}
