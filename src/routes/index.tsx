import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bike, Store, Clock, Heart, Leaf, ChevronLeft, ChevronRight } from "lucide-react";
import hero from "@/assets/hero.jpg";
import slideCoffee from "@/assets/slide-coffee.jpg";
import slidePizza from "@/assets/slide-pizza.jpg";
import slideBrownie from "@/assets/slide-brownie.jpg";
import oven from "@/assets/oven.jpg";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/site/Reveal";
import { PillButton } from "@/components/site/PillButton";
import { menuQuery, settingsQuery } from "@/lib/menu";
import { foodImage } from "@/lib/food-images";
import { ProductCard } from "@/components/site/ProductCard";
import { inr } from "@/lib/pricing";

const slides = [slideBrownie, slidePizza, slideCoffee, hero];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Classic Crush — Order Desserts & Café Bites Online" },
      {
        name: "description",
        content:
          "Signature chocolate desserts, patties, pizza, sandwiches, momos and shakes. Order for delivery or pickup.",
      },
      { property: "og:title", content: "The Classic Crush — Bakery & Café" },
      {
        property: "og:description",
        content:
          "Made with love by the School of Hotel Management. Order online for delivery or pickup.",
      },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(menuQuery),
      context.queryClient.ensureQueryData(settingsQuery),
    ]),
  component: Home,
});

// CrowdFavourites must be defined BEFORE Home due to TanStack Router code-splitting
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CrowdFavourites({ best }: { best: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const syncArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", syncArrows, { passive: true });
    const raf = requestAnimationFrame(syncArrows);
    return () => {
      el.removeEventListener("scroll", syncArrows);
      cancelAnimationFrame(raf);
    };
  }, [syncArrows]);

  const scroll = useCallback((dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 20 : 280;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    isDragging.current = true;
    startX.current = e.clientX;
    startScroll.current = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
    el.style.cursor = "grabbing";
    el.style.scrollSnapType = "none";
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = startScroll.current + (startX.current - e.clientX);
  }, []);

  const onPointerUp = useCallback((_e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el || !isDragging.current) return;
    isDragging.current = false;
    el.style.cursor = "";
    setTimeout(() => {
      if (el) el.style.scrollSnapType = "";
    }, 80);
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 pt-20">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="eyebrow text-gold">Signature</p>
          <h2 className="text-4xl font-semibold">Crowd favourites</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="crowd-fav-prev"
            aria-label="Scroll left"
            onClick={() => scroll(-1)}
            disabled={!canLeft}
            className="grid size-9 place-items-center rounded-full border border-border bg-card shadow-sm transition-all duration-200 hover:bg-accent hover:shadow-md disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            id="crowd-fav-next"
            aria-label="Scroll right"
            onClick={() => scroll(1)}
            disabled={!canRight}
            className="grid size-9 place-items-center rounded-full border border-border bg-card shadow-sm transition-all duration-200 hover:bg-accent hover:shadow-md disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight className="size-4" />
          </button>
          <Link to="/menu" className="ml-1 text-sm font-semibold text-primary">
            See full menu →
          </Link>
        </div>
      </div>

      <div
        ref={scrollRef}
        id="crowd-fav-track"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="cursor-grab select-none overflow-x-auto pb-4"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`#crowd-fav-track::-webkit-scrollbar{display:none}`}</style>
        <div className="flex gap-5 pr-8">
          {best.map((p) => (
            <div
              key={p.id}
              data-card=""
              className="w-[78%] shrink-0 sm:w-[44%] lg:w-[28%]"
              style={{ scrollSnapAlign: "start" }}
            >
              <ProductCard p={p} />
            </div>
          ))}
        </div>
      </div>

      <p className="mt-2 text-center text-xs text-muted-foreground">Drag or swipe to see more →</p>
    </section>
  );
}

function Home() {
  const { data } = useSuspenseQuery(menuQuery);
  const { data: sd } = useSuspenseQuery(settingsQuery);
  const s = sd.settings;
  const best = data.products
    .filter((p) => p.is_bestseller || p.category_id === data.categories[0]?.id)
    .slice(0, 10);
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSlide((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);
  const [y, setY] = useState(0);
  useEffect(() => {
    const on = () => setY(window.scrollY);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-forest text-forest-foreground">
        <AnimatePresence initial={false}>
          <motion.div
            key={slide}
            className="absolute inset-0 -top-20 bg-cover bg-center will-change-transform"
            style={{ backgroundImage: `url(${slides[slide]})`, y: y * 0.4 }}
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1.04 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.4 }, scale: { duration: 6, ease: "linear" } }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e3a23]/95 via-[#0e3a23]/75 to-[#0e3a23]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e3a23]/95 via-transparent to-[#0e3a23]/50" />
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === slide ? "w-8 bg-gold" : "w-3 bg-forest-foreground/50"}`}
            />
          ))}
        </div>
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:min-h-[640px] md:grid-cols-2 md:py-24">
          <div className="space-y-6">
            <Reveal>
              <span className="animate-float inline-flex items-center gap-2 rounded-full border border-gold/60 bg-forest-foreground/10 px-4.5 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-gold backdrop-blur-md">
                <Leaf className="size-3.5" /> 100% Pure Vegetarian
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="text-5xl font-semibold leading-[1.02] md:text-7xl">
                The Classic Crush
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="font-script text-4xl text-gold md:text-6xl drop-shadow-[0_2px_14px_rgba(212,175,55,0.45)]">
                Made with Love
              </p>
            </Reveal>
            <Reveal delay={300}>
              <p className="max-w-md text-lg opacity-85">
                Chocolate-loaded signature desserts, warm patties, cheesy pizzas and cool shakes —
                baked fresh by the School of Hotel Management, delivered to your door.
              </p>
            </Reveal>
            <Reveal delay={400} className="flex flex-wrap gap-3">
              <PillButton variant="gold" className="glow-hover shadow-lg shadow-gold/20">
                <Link to="/menu">Order Now</Link>
              </PillButton>
              <PillButton variant="outline" className="glow-hover border-gold/70 text-forest-foreground hover:bg-gold hover:text-gold-foreground">
                <Link to="/orders">Track an order</Link>
              </PillButton>
            </Reveal>
            <Reveal delay={500} className="flex flex-wrap gap-5 pt-2 text-sm opacity-90">
              <span className="flex items-center gap-2">
                <Bike className="size-4 text-gold" /> Delivery within {s.max_radius_km} km
              </span>
              <span className="flex items-center gap-2">
                <Store className="size-4 text-gold" /> Pickup in ~{s.prep_minutes} min
              </span>
              <span className="flex items-center gap-2">
                <Clock className="size-4 text-gold" /> {s.opening_hours}
              </span>
            </Reveal>
          </div>
          <Reveal variant="zoom" className="relative hidden justify-end self-end md:flex">
            <div className="rounded-3xl border border-gold/30 bg-[#0e3a23]/80 px-6 py-4 shadow-lift backdrop-blur-xl">
              <div className="eyebrow text-gold font-bold">Free delivery</div>
              <div className="font-display text-xl font-semibold text-forest-foreground">
                on orders above {inr(s.free_delivery_threshold)}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {!s.is_open && (
        <div className="bg-destructive py-2 text-center text-sm text-destructive-foreground">
          We're not taking orders right now. Please check back soon.
        </div>
      )}

      <section className="mx-auto max-w-6xl px-4 pt-16">
        <div className="mb-8 text-center">
          <p className="eyebrow text-gold font-bold tracking-[0.25em]">Explore</p>
          <h2 className="text-4xl font-semibold text-[#0e3a23]">Our Menu</h2>
          <div className="gold-rule mx-auto mt-4 w-40" />
        </div>
      </section>
      <div className="relative mt-2 overflow-hidden py-4 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <div className="animate-marquee flex w-max gap-5">
          {[...data.categories, ...data.categories].map((c, i) => (
            <Link
              key={c.id + i}
              to="/menu"
              search={{ c: c.slug }}
              aria-hidden={i >= data.categories.length}
              className="group relative w-56 shrink-0 overflow-hidden rounded-3xl bg-card border border-border/80 p-3 shadow-card transition-all duration-500 ease-out hover:-translate-y-2.5 hover:shadow-xl hover:shadow-gold/20 hover:border-gold/60 sm:w-64"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted/40">
                <img
                  src={foodImage(c.image_key)}
                  alt={c.name}
                  loading="lazy"
                  width={816}
                  height={816}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
              </div>
              <div className="p-3 pt-3.5 text-left">
                <div className="font-display text-xl font-bold leading-tight text-[#0e3a23] transition-colors duration-300 group-hover:text-primary">
                  {c.name}
                </div>
                <div className="mt-1 text-xs text-[#0e3a23]/75 font-medium line-clamp-1">
                  {c.tagline}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[0.7rem] font-bold uppercase tracking-wider text-gold group-hover:underline">
                    View items →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <section className="relative mt-20 overflow-hidden">
        <div
          className="absolute inset-0 -top-64 -bottom-64 bg-cover bg-center will-change-transform"
          style={{
            backgroundImage: `url(${oven})`,
            transform: `translateY(${(y - 1300) * 0.15}px)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e3a23]/85 via-[#0e3a23]/65 to-[#0e3a23]/85" />
        <div className="relative mx-auto flex min-h-[520px] max-w-6xl items-center justify-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl rounded-3xl border border-gold/45 bg-[#0e3a23]/75 p-8 text-center text-forest-foreground shadow-lift backdrop-blur-2xl ring-1 ring-gold/20 md:p-12"
          >
            <p className="eyebrow text-gold font-bold tracking-[0.25em]">Freshly Baked Every Morning</p>
            <h2 className="mt-3 text-4xl font-semibold md:text-5xl text-forest-foreground">From our oven to your door.</h2>
            <p className="mt-4 text-lg opacity-90 text-forest-foreground/90">
              Experience the magic of School of Hotel Management.
            </p>
            <PillButton variant="gold" className="glow-hover mt-8 shadow-lg shadow-gold/25">
              <Link to="/menu">Explore Combo Offers</Link>
            </PillButton>
          </motion.div>
        </div>
      </section>

      <CrowdFavourites best={best} />

      <section className="mx-auto max-w-6xl px-4 pt-20">
        <div className="grid gap-6 rounded-3xl bg-card p-8 shadow-card md:grid-cols-3">
          {[
            {
              icon: Heart,
              t: "Made with love",
              d: "Every item is prepared fresh by our hospitality students.",
            },
            {
              icon: Bike,
              t: "Fair delivery",
              d: `From ${inr(s.delivery_slabs[0]?.fee ?? 0)} depending on distance — free above ${inr(s.free_delivery_threshold)}.`,
            },
            {
              icon: Store,
              t: "Pickup or delivery",
              d: "Pay online, cash on delivery, or pay at the café when you collect.",
            },
          ].map((f) => (
            <div key={f.t} className="flex gap-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-primary">
                <f.icon className="size-5" />
              </div>
              <div>
                <div className="font-display text-xl font-semibold">{f.t}</div>
                <p className="text-sm text-muted-foreground">{f.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
