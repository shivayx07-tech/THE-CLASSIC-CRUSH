import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, FileImage, Download } from "lucide-react";
import printedMenu from "@/assets/classic-crush-menu.png.asset.json";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { z } from "zod";
import { menuQuery } from "@/lib/menu";
import { ProductCard } from "@/components/site/ProductCard";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/menu")({
  validateSearch: z.object({ c: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Menu — The Classic Crush" },
      {
        name: "description",
        content:
          "Browse signature desserts, quick bites, sandwiches, Maggie, beverages, burgers, fries and momos.",
      },
      { property: "og:title", content: "Menu — The Classic Crush" },
      { property: "og:description", content: "Full bakery & café menu with prices in ₹." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(menuQuery),
  component: MenuPage,
});

function MenuPage() {
  const { data } = useSuspenseQuery(menuQuery);
  const { c } = Route.useSearch();
  const [q, setQ] = useState("");
  const active = c ?? "all";

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return data.products.filter(
      (p) =>
        !term || p.name.toLowerCase().includes(term) || p.description?.toLowerCase().includes(term),
    );
  }, [data.products, q]);

  const cats = data.categories.filter((cat) => active === "all" || cat.slug === active);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow text-gold">Freshly made every day</p>
          <h1 className="text-5xl font-semibold text-[#0e3a23]">Menu</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="mt-3 border-border/80 text-[#0e3a23] hover:border-gold hover:bg-gold/10 transition-all duration-300">
                <FileImage /> View printed menu
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto p-3 bg-card border-border/80">
              <DialogTitle className="sr-only">The Classic Crush printed menu</DialogTitle>
              <img
                src={printedMenu.url}
                alt="The Classic Crush printed menu with all items and prices"
                width={851}
                height={1280}
                className="w-full rounded-2xl"
              />
              <Button asChild variant="gold" className="w-full">
                <a href={printedMenu.url} download="classic-crush-menu.png">
                  <Download /> Download menu
                </a>
              </Button>
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative md:w-80">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search dishes…"
            className="h-11 rounded-full border-border/80 bg-card pl-10 text-[#0e3a23] focus-visible:ring-gold"
          />
        </div>
      </div>
      <div className="sticky top-16 z-30 -mx-4 mb-8 flex gap-2 overflow-x-auto bg-background/95 px-4 py-3 backdrop-blur-md">
        <Chip to={undefined} active={active === "all"}>
          All
        </Chip>
        {data.categories.map((cat) => (
          <Chip key={cat.id} to={cat.slug} active={active === cat.slug}>
            {cat.name}
          </Chip>
        ))}
      </div>
      {cats.map((cat) => {
        const items = filtered.filter((p) => p.category_id === cat.id);
        if (!items.length) return null;
        return (
          <section key={cat.id} className="mb-12">
            <div className="mb-5 flex items-baseline gap-3">
              <h2 className="text-3xl font-semibold text-[#0e3a23]">{cat.name}</h2>
              <span className="text-sm font-medium text-muted-foreground">{cat.tagline}</span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </section>
        );
      })}
      {filtered.length === 0 && (
        <p className="py-20 text-center text-muted-foreground">No dishes match “{q}”.</p>
      )}
    </div>
  );
}

function Chip({
  to,
  active,
  children,
}: {
  to: string | undefined;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to="/menu"
      search={to ? { c: to } : {}}
      className={cn(
        "shrink-0 rounded-full border px-4.5 py-2 text-sm font-semibold transition-all duration-300",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border/80 bg-card text-[#0e3a23] hover:border-gold hover:bg-gold/10",
      )}
    >
      {children}
    </Link>
  );
}
