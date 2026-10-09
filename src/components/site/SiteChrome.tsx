import { Link, useHydrated } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ShoppingBag, Phone, Instagram, Menu as MenuIcon } from "lucide-react";
import { Logo } from "./Logo";
import { useCart } from "@/lib/cart";
import { settingsQuery } from "@/lib/menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/story", label: "Our Story" },
  { to: "/visit", label: "Visit Us" },
  { to: "/orders", label: "My Orders" },
] as const;

export function SiteHeader() {
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={cn("sticky top-0 z-40 border-b transition-all duration-500", scrolled ? "border-border/70 bg-background/70 shadow-card backdrop-blur-xl" : "border-transparent bg-background")}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/"><Logo /></Link>
        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="relative text-sm font-medium text-muted-foreground transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all hover:text-foreground hover:after:w-full" activeProps={{ className: "!text-primary after:!w-full nav-glow" }} activeOptions={{ exact: n.to === "/" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/cart" className="relative inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-lift" aria-label="Cart">
            <ShoppingBag className="size-4" />
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-xs text-gold-foreground">{count}</span>}
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button aria-label="Open menu" className="grid size-10 place-items-center rounded-full border border-border md:hidden"><MenuIcon className="size-5" /></button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 border-l border-border/60 bg-background/75 backdrop-blur-xl">
              <SheetTitle className="font-display text-2xl">The Classic Crush</SheetTitle>
              <nav className="mt-8 flex flex-col gap-1">
                {nav.map((n) => (
                  <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-full px-4 py-3 font-display text-2xl transition hover:bg-accent" activeProps={{ className: "!text-primary bg-accent" }} activeOptions={{ exact: n.to === "/" }}>{n.label}</Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { data } = useQuery(settingsQuery);
  const hydrated = useHydrated();
  const s = hydrated ? data?.settings : undefined;
  return (
    <footer className="mt-20 bg-forest-gradient text-forest-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        <div className="space-y-3">
          <Logo light />
          <p className="font-script text-3xl text-gold">Made with Love</p>
          <p className="text-sm opacity-80">An initiative by School of Hotel Management</p>
        </div>
        <div className="space-y-2 text-sm">
          <div className="eyebrow text-gold">Visit & Call</div>
          <p className="opacity-90">{s?.address}</p>
          <p className="opacity-90">{s?.opening_hours}</p>
          {s && (
            <p className="flex flex-wrap items-center gap-2">
              <Phone className="size-4 text-gold" />
              <a href={`tel:${s.phone_primary}`}>{s.phone_primary}</a>
              {s.phone_secondary && <>| <a href={`tel:${s.phone_secondary}`}>{s.phone_secondary}</a></>}
            </p>
          )}
        </div>
        <div className="space-y-2 text-sm">
          <div className="eyebrow text-gold">Follow</div>
          {s?.instagram_url && (
            <a href={s.instagram_url} target="_blank" rel="noreferrer" className="social-glow flex items-center gap-2"><Instagram className="size-4" /> Instagram</a>
          )}
          {s?.phone_primary && (
            <a href={`https://wa.me/${s.phone_primary.replace(/\D/g, "").replace(/^(\d{10})$/, "91$1")}`} target="_blank" rel="noreferrer" className="social-glow flex items-center gap-2"><Phone className="size-4" /> WhatsApp</a>
          )}
          <p className="pt-4 opacity-70">Freshly made every day. Thank you for supporting local & young!</p>
          <Link to="/admin" className="block pt-2 text-xs opacity-50 hover:opacity-100">Staff login</Link>
        </div>
      </div>
    </footer>
  );
}
