import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import interior from "@/assets/interior.jpg";
import { Reveal } from "@/components/site/Reveal";
import { Ambient } from "@/components/site/Ambient";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Our Story — The Classic Crush Bakery & Café" },
      {
        name: "description",
        content:
          "A pure vegetarian neighbourhood bakery & café run by students of the School of Hotel Management.",
      },
      { property: "og:title", content: "Our Story — The Classic Crush" },
      {
        property: "og:description",
        content: "Made with love by hospitality students — honest, local and 100% vegetarian.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Story,
});

const features = [
  {
    t: "Honest & Local",
    d: "Fresh ingredients from nearby suppliers, baked in small batches every day.",
    path: "M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1z",
    anim: "group-hover:animate-bounce",
  },
  {
    t: "100% Vegetarian",
    d: "Every single item on our menu is pure vegetarian — always.",
    path: "M5 19c0-8 6-14 14-14 0 8-6 14-14 14zm0 0l7-7",
    anim: "sway",
  },
  {
    t: "Warm Hospitality",
    d: "Served with a smile by the future stars of the hotel industry.",
    path: "M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z",
    anim: "animate-pulse",
  },
];

const Doodle = ({ d, className = "" }: { d: string; className?: string }) => (
  <svg
    viewBox="0 0 16 16"
    className={`size-6 fill-none stroke-gold ${className}`}
    strokeWidth={1.2}
    strokeLinecap="round"
  >
    <path d={d} />
  </svg>
);
const HAT = "M4 14h8M4 14V9a3 3 0 01-1-5 3 3 0 015-2 3 3 0 015 2 3 3 0 01-1 5v5";
const WHISK = "M8 15V8M5 8c-2-5 1-7 3-7s5 2 3 7z";

function Story() {
  return (
    <div className="relative overflow-hidden bg-ivory-rich">
      <Ambient />

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-4 pt-10 md:pt-14">
        <Reveal variant="zoom">
          <div className="map-frame relative overflow-hidden rounded-[2.5rem] p-2">
            <div className="relative h-[70vh] min-h-[440px] overflow-hidden rounded-[2.1rem]">
              <img
                src={interior}
                alt="Inside The Classic Crush café"
                width={1600}
                height={912}
                className="h-full w-full scale-105 object-cover transition-transform duration-[3s] hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e3a23]/95 via-[#0e3a23]/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 px-6 pb-12 text-center text-forest-foreground md:pb-16">
                <div className="relative mx-auto inline-block">
                  <span className="steam absolute -top-6 left-1/3" />
                  <span
                    className="steam absolute -top-6 left-1/2"
                    style={{ animationDelay: ".7s" }}
                  />
                  <span
                    className="steam absolute -top-6 left-2/3"
                    style={{ animationDelay: "1.3s" }}
                  />
                  <Reveal>
                    <p className="foil-text font-script text-5xl md:text-6xl">Our Story</p>
                  </Reveal>
                </div>
                <Reveal delay={150}>
                  <h1 className="glow-title mt-2 text-4xl font-semibold uppercase tracking-wide sm:text-5xl md:text-7xl">
                    <span className="sparkle mr-3 text-2xl text-gold">✦</span>The Neighbourhood
                    Gathering
                    <span
                      className="sparkle ml-3 text-2xl text-gold"
                      style={{ animationDelay: "1s" }}
                    >
                      ✦
                    </span>
                  </h1>
                </Reveal>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Golden thread */}
      <div aria-hidden className="relative mx-auto h-24 w-px">
        <div className="thread absolute inset-0" />
      </div>

      <section className="relative mx-auto max-w-3xl px-4 text-center">
        <Reveal>
          <div className="flex items-center justify-center gap-3">
            <Doodle d={HAT} className="doodle" />
            <Doodle d={WHISK} className="sway" />
            <span className="sparkle text-gold">✦</span>
            <p className="eyebrow text-gold">Made with love</p>
            <span className="sparkle text-gold" style={{ animationDelay: ".8s" }}>
              ✦
            </span>
            <Doodle d={WHISK} className="sway" />
            <Doodle d={HAT} className="doodle" />
          </div>
          <h2 className="mt-3 text-4xl font-semibold md:text-6xl">Where students become hosts</h2>
          <div className="gold-rule mx-auto mt-4 w-40" />
        </Reveal>
        <Reveal delay={150}>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            The Classic Crush is an initiative by the School of Hotel Management. Our students bake,
            cook and serve every order — learning the craft of hospitality while sharing their love
            for good food with the neighbourhood.
          </p>
        </Reveal>
      </section>

      <div aria-hidden className="relative mx-auto h-24 w-px">
        <div className="thread absolute inset-0" />
      </div>

      {/* Promise */}
      <section className="relative mx-auto max-w-5xl px-4">
        <Reveal>
          <div className="promise-card relative overflow-hidden rounded-[2.5rem] p-10 text-center text-forest-foreground md:p-14">
            {["8%,20%", "88%,18%", "12%,78%", "84%,74%"].map((p, i) => {
              const [l, t] = p.split(",");
              return (
                <span
                  key={i}
                  className="doodle absolute text-xl text-gold"
                  style={{ left: l, top: t, animationDelay: `${i}s` }}
                >
                  {i % 2 ? "✦" : "🍃"}
                </span>
              );
            })}
            <p className="eyebrow text-gold">A promise</p>
            <h2 className="foil-text mt-2 text-4xl font-semibold md:text-5xl">
              Our Pure Vegetarian Promise
            </h2>
            <p className="mx-auto mt-4 max-w-xl opacity-90">
              No meat, no fish, no eggs in our savouries — just wholesome vegetarian food you can
              share with everyone at the table.
            </p>
          </div>
        </Reveal>
      </section>

      <div aria-hidden className="relative mx-auto h-24 w-px">
        <div className="thread absolute inset-0" />
      </div>

      {/* Values */}
      <section className="relative mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-3">
        {features.map((f, i) => (
          <Reveal key={f.t} delay={i * 120}>
            <div className="glass-card group h-full rounded-3xl p-8 text-center transition duration-500 hover:shadow-[0_30px_60px_-20px_color-mix(in_oklab,var(--gold)_55%,transparent)] hover:[transform:perspective(800px)_rotateX(4deg)_translateY(-10px)_scale(1.03)]">
              <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-forest-gradient">
                <svg
                  viewBox="0 0 24 24"
                  className={`size-8 fill-transparent stroke-gold transition-colors duration-500 group-hover:fill-gold/30 ${f.anim}`}
                  strokeWidth={1.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path className="draw-icon" d={f.path} />
                </svg>
              </div>
              <h3 className="mt-5 text-2xl font-semibold">{f.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
            </div>
          </Reveal>
        ))}
      </section>

      <Reveal className="relative pb-6 pt-16 text-center">
        <Link
          to="/menu"
          className="cta-emerald shimmer-btn group inline-flex h-14 items-center gap-3 rounded-full px-9 text-sm font-bold uppercase tracking-widest text-primary-foreground transition duration-500 hover:-translate-y-1"
        >
          Explore the menu{" "}
          <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-2" />
        </Link>
      </Reveal>
    </div>
  );
}
