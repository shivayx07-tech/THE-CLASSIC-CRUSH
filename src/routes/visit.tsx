import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useHydrated } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  MapPin,
  Clock,
  MessageCircle,
  ArrowRight,
  Navigation,
  CalendarHeart,
  Phone,
} from "lucide-react";
import { settingsQuery } from "@/lib/menu";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/visit")({
  head: () => ({
    meta: [
      { title: "Visit Us — The Classic Crush Bakery & Café" },
      {
        name: "description",
        content:
          "Find The Classic Crush: address, opening hours, phone and directions to our cosy vegetarian café.",
      },
      { property: "og:title", content: "Come Find Us — The Classic Crush" },
      {
        property: "og:description",
        content: "Step into a warm seat at our neighbourhood bakery & café.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Visit,
});

const doodles = [
  { d: "M6 3c3 2 3 8 0 10M6 3c-3 2-3 8 0 10", x: "8%", y: "18%" }, // bean
  { d: "M2 10c2-6 10-6 12 0M4 10l2-4M8 10V5M12 10l-2-4", x: "85%", y: "26%" }, // croissant
  { d: "M5 14c-2-3 2-4 0-7s2-4 0-6M10 14c-2-3 2-4 0-7s2-4 0-6", x: "14%", y: "68%" }, // steam
  { d: "M8 15V2M8 5l-3-2M8 5l3-2M8 9l-3-2M8 9l3-2", x: "90%", y: "72%" }, // wheat
  { d: "M8 1v14M1 8h14M3 3l10 10M13 3L3 13", x: "50%", y: "10%" }, // sparkle
  { d: "M6 3c3 2 3 8 0 10M6 3c-3 2-3 8 0 10", x: "70%", y: "88%" },
];

function Visit() {
  const { data } = useQuery(settingsQuery);
  const hydrated = useHydrated();
  const s = hydrated ? data?.settings : undefined;
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const on = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const address = s?.address ?? "";
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || "The Classic Crush Bakery Cafe")}`;
  const dirUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address || "The Classic Crush Bakery Cafe")}`;
  const wa = (s?.phone_primary ?? "").replace(/\D/g, "");
  const waNum = wa.length === 10 ? `91${wa}` : wa;
  const waUrl = (msg: string) => `https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`;

  return (
    <div className="relative overflow-hidden bg-ivory-rich">
      {/* Parallax doodles */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
      >
        {doodles.map((d, i) => (
          <svg
            key={i}
            viewBox="0 0 16 16"
            className="doodle absolute size-10 stroke-primary/25"
            style={{ left: d.x, top: d.y, animationDelay: `${i * 0.8}s` }}
            fill="none"
            strokeWidth={1}
            strokeLinecap="round"
          >
            <path d={d.d} />
          </svg>
        ))}
      </div>
      {/* Golden flecks */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="fleck"
            style={{
              left: `${(i * 53) % 100}%`,
              animationDelay: `${(i * 1.3) % 9}s`,
              animationDuration: `${9 + (i % 5) * 2}s`,
            }}
          />
        ))}
      </div>
      {/* Corner vines */}
      <svg
        aria-hidden
        viewBox="0 0 200 200"
        className="vine pointer-events-none absolute -bottom-6 -right-6 size-56 fill-none stroke-primary/50 md:size-80"
        strokeWidth={1.5}
      >
        <path d="M200 200C160 160 150 120 160 70S120 10 90 0" />
        <path
          className="fill-primary/20"
          d="M160 120c-20-5-30-20-25-35 15 5 25 18 25 35zM155 80c15-12 32-10 40 0-12 10-28 10-40 0zM120 35c-18 2-30-8-32-22 16-2 28 8 32 22z"
        />
      </svg>
      <svg
        aria-hidden
        viewBox="0 0 200 200"
        className="vine pointer-events-none absolute -left-6 -top-6 size-40 rotate-180 fill-none stroke-primary/40 md:size-56"
        strokeWidth={1.5}
      >
        <path d="M200 200C160 160 150 120 160 70S120 10 90 0" />
        <path
          className="fill-primary/20"
          d="M160 120c-20-5-30-20-25-35 15 5 25 18 25 35zM120 35c-18 2-30-8-32-22 16-2 28 8 32 22z"
        />
      </svg>

      <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
        <Reveal className="text-center">
          <p className="foil-text eyebrow !text-sm">Location & Timings</p>
          <h1 className="foil-text mt-3 text-4xl font-semibold uppercase tracking-wide sm:text-6xl md:text-8xl">
            Come Find Us.
          </h1>
          <div className="gold-rule mx-auto mt-5 w-48" />
          <p className="mx-auto mt-6 flex max-w-xl items-center justify-center gap-3 font-display text-2xl italic text-muted-foreground">
            <span className="sparkle text-gold">✦</span>
            “Step into a warm seat, a fresh bake, and a cup made with love.”
            <span className="relative inline-block">
              <span className="steam absolute -top-4 left-1" />
              <span className="steam absolute -top-4 left-3" style={{ animationDelay: ".6s" }} />
              <svg
                viewBox="0 0 24 24"
                className="size-7 stroke-primary"
                fill="none"
                strokeWidth={1.5}
              >
                <path d="M4 9h12v5a5 5 0 01-5 5H9a5 5 0 01-5-5zM16 10h2a2 2 0 010 4h-2" />
              </svg>
            </span>
          </p>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-5">
            <Reveal delay={100}>
              <GlassCard
                icon={
                  <span className="relative">
                    <span className="absolute inset-0 animate-ping rounded-full bg-gold/50" />
                    <MapPin className="relative size-5 text-gold" />
                  </span>
                }
                title="Our Address"
              >
                <p>{address || "Loading…"}</p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group/link mt-2 inline-flex cursor-alias items-center gap-1 text-sm font-semibold text-primary"
                >
                  View on Map{" "}
                  <ArrowRight className="size-4 transition-transform duration-500 group-hover/link:translate-x-1.5" />
                </a>
              </GlassCard>
            </Reveal>
            <Reveal delay={200}>
              <GlassCard icon={<Clock className="tick size-5 text-gold" />} title="Opening Hours">
                <p>{s?.opening_hours || "Loading…"}</p>
              </GlassCard>
            </Reveal>
            <Reveal delay={300}>
              <GlassCard
                icon={<MessageCircle className="size-5 animate-pulse text-success" />}
                title="Phone & Enquiries"
              >
                {s && (
                  <p className="flex flex-wrap items-center gap-2">
                    <Phone className="size-4" />
                    <a href={`tel:${s.phone_primary}`}>{s.phone_primary}</a>
                    {s.phone_secondary && (
                      <>
                        {" "}
                        · <a href={`tel:${s.phone_secondary}`}>{s.phone_secondary}</a>
                      </>
                    )}
                  </p>
                )}
              </GlassCard>
            </Reveal>
            <Reveal delay={400} className="flex flex-wrap gap-3 pt-2">
              <CtaLink href={dirUrl} icon={<Navigation className="size-4" />}>
                Get Directions
              </CtaLink>
              <CtaLink
                href={waUrl("Hi! I'd like to place an order.")}
                icon={<MessageCircle className="size-4" />}
                emerald
              >
                Order on WhatsApp
              </CtaLink>
            </Reveal>
            <Reveal delay={500}>
              <a
                href={waUrl("Hi! I'd like to book a table / event at The Classic Crush.")}
                target="_blank"
                rel="noreferrer"
                className="shimmer-btn group flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gold-gradient text-sm font-bold uppercase tracking-widest text-gold-foreground shadow-lift transition duration-500 hover:-translate-y-1"
              >
                <CalendarHeart className="size-5" /> Book a Table / Event{" "}
                <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-2" />
              </a>
            </Reveal>
          </div>

          <Reveal delay={200} variant="zoom">
            <div className="map-frame relative h-[420px] overflow-hidden rounded-[2rem] p-2 lg:h-full lg:min-h-[520px]">
              <div className="relative h-full overflow-hidden rounded-[1.6rem]">
                {address ? (
                  <iframe
                    title="Map to The Classic Crush"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                    className="h-full w-full border-0 sepia-[.25]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="h-full w-full bg-muted" />
                )}
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
                  <span className="absolute left-1/2 top-full size-6 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-gold/60" />
                  <svg viewBox="0 0 24 32" className="pin relative h-12 w-9 drop-shadow-lg">
                    <path
                      d="M12 0C5 0 0 5 0 12c0 9 12 20 12 20s12-11 12-20C24 5 19 0 12 0z"
                      className="fill-destructive stroke-gold"
                      strokeWidth={1.5}
                    />
                    <circle cx="12" cy="12" r="4.5" className="fill-gold" />
                  </svg>
                </div>
                <div className="absolute left-4 top-4 rounded-full border border-gold/50 bg-card/85 px-4 py-2 text-xs font-bold tracking-wide shadow-card backdrop-blur-md transition duration-500 hover:-translate-y-0.5">
                  <span className="mr-2 inline-block size-2 animate-pulse rounded-full bg-success" />
                  OPEN {s?.opening_hours ? `· ${s.opening_hours}` : "NOW"}
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-4 right-4 rounded-full border border-gold/50 bg-card/85 px-4 py-2 text-xs font-bold shadow-card backdrop-blur-md transition duration-500 hover:-translate-y-1 hover:bg-gold hover:text-gold-foreground"
                >
                  🗺️ Open in Google Maps
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function GlassCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="glass-card group flex gap-4 rounded-3xl p-6 transition duration-500 hover:-translate-y-1.5 hover:shadow-lift [transform-style:preserve-3d] hover:[transform:perspective(800px)_rotateX(2deg)_translateY(-6px)]">
      <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-forest-gradient">
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-semibold">{title}</h3>
        <div className="mt-1 text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}

function CtaLink({
  href,
  icon,
  children,
  emerald,
}: {
  href: string;
  icon: ReactNode;
  children: ReactNode;
  emerald?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`bubble-btn group relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-full border px-6 text-xs font-bold uppercase tracking-widest transition duration-500 hover:-translate-y-0.5 ${emerald ? "border-success bg-success text-primary-foreground" : "border-gold bg-primary text-primary-foreground"}`}
    >
      {icon}
      {children}
      <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1.5" />
    </a>
  );
}
