import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Brand LogoMark: Elegant crest featuring "TCC" with a stylish pastry bite
 * taken out of the second 'C' and small crispy crumbs drifting off.
 */
export function LogoMark({
  className,
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  const maskId = useId();

  return (
    <div
      className={cn(
        "relative flex aspect-square shrink-0 items-center justify-center rounded-full transition-all duration-300 hover:scale-105",
        className,
      )}
    >
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full drop-shadow-sm select-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`gold-${maskId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDEAA8" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#A8751A" />
          </linearGradient>
          <linearGradient id={`bg-${maskId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#12482c" />
            <stop offset="100%" stopColor="#082215" />
          </linearGradient>

          {/* Tooth bite marks cut out of the second C */}
          <mask id={maskId}>
            <rect width="100" height="100" fill="white" />
            {/* Scalloped bite arcs biting into the right curve of the second C */}
            <circle cx="80" cy="42" r="6.2" fill="black" />
            <circle cx="82.5" cy="51" r="5.6" fill="black" />
            <circle cx="77.5" cy="58.5" r="4.8" fill="black" />
          </mask>
        </defs>

        {/* Outer Circular Crest */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill={`url(#bg-${maskId})`}
          stroke={`url(#gold-${maskId})`}
          strokeWidth="2.5"
        />
        {/* Delicate beaded inner border */}
        <circle
          cx="50"
          cy="50"
          r="41.5"
          fill="none"
          stroke={`url(#gold-${maskId})`}
          strokeWidth="0.8"
          strokeDasharray="2.5 2"
          opacity="0.75"
        />

        {/* Bitten TCC Monogram */}
        <g mask={`url(#${maskId})`}>
          <text
            x="48"
            y="58"
            fontFamily="'Playfair Display', Georgia, serif"
            fontSize="26.5"
            fontWeight="800"
            letterSpacing="-0.8"
            fill={`url(#gold-${maskId})`}
            textAnchor="middle"
          >
            TCC
          </text>
        </g>

        {/* Floating pastry crumbs next to the bite */}
        <circle cx="88.5" cy="43.5" r="1.5" fill="#D4AF37" />
        <circle cx="86.5" cy="52" r="1.2" fill="#FDEAA8" />
        <circle cx="83.5" cy="61" r="1.1" fill="#D4AF37" />
        <circle cx="91.5" cy="49.5" r="0.9" fill="#FDEAA8" />
        <path d="M89 55.5 L91 57 L89.2 58 Z" fill="#D4AF37" />
      </svg>
    </div>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-3 group">
      <LogoMark light={light} className="h-11 w-11 shadow-sm transition-transform duration-300 group-hover:scale-105" />
      <div className="leading-tight">
        <div
          className={cn(
            "font-display text-xl font-bold tracking-tight transition-colors duration-300",
            light ? "text-forest-foreground" : "text-[#0e3a23] group-hover:text-[#13492d]",
          )}
        >
          The Classic Crush
        </div>
        <div
          className={cn(
            "eyebrow !text-[0.62rem] font-bold tracking-[0.24em] text-gold",
            light ? "opacity-90" : "opacity-95",
          )}
        >
          Bakery & Café
        </div>
      </div>
    </div>
  );
}
