import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Minus, Plus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { menuQuery } from "@/lib/menu";
import { foodImage } from "@/lib/food-images";
import { inr } from "@/lib/pricing";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { ProductCard, VegMark } from "@/components/site/ProductCard";

export const Route = createFileRoute("/product/$id")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(menuQuery);
    const p = data.products.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return { name: p.name, description: p.description };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — The Classic Crush` },
          {
            name: "description",
            content: loaderData.description ?? "Order online from The Classic Crush",
          },
          { property: "og:title", content: `${loaderData.name} — The Classic Crush` },
          { property: "og:description", content: loaderData.description ?? "Order online" },
        ]
      : [{ title: "Dish not found" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="py-24 text-center">
      <h1 className="text-3xl">This dish isn't on the menu</h1>
      <Link to="/menu" className="mt-4 inline-block text-primary">
        Back to menu
      </Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(menuQuery);
  const p = data.products.find((x) => x.id === id)!;
  const cat = data.categories.find((c) => c.id === p.category_id);
  const related = data.products
    .filter((x) => x.category_id === p.category_id && x.id !== p.id)
    .slice(0, 4);
  const [qty, setQty] = useState(1);
  const cart = useCart();
  const navigate = useNavigate();

  const add = (go: boolean) => {
    cart.add({ productId: p.id, name: p.name, price: p.price, imageKey: p.image_key }, qty);
    toast.success(`${qty} × ${p.name} added to cart`);
    if (go) navigate({ to: "/cart" });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        to="/menu"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Menu
      </Link>
      <div className="grid gap-10 md:grid-cols-2">
        <img
          src={foodImage(p.image_key)}
          alt={p.name}
          width={816}
          height={816}
          className="aspect-square w-full rounded-3xl object-cover shadow-lift"
        />
        <div className="flex flex-col gap-4">
          <p className="eyebrow text-gold">
            {cat?.name}
            {p.subgroup ? ` · ${p.subgroup}` : ""}
          </p>
          <h1 className="text-5xl font-semibold leading-tight">{p.name}</h1>
          <div className="flex items-center gap-3">
            {p.is_veg && (
              <span className="flex items-center gap-1.5 text-sm text-success">
                <VegMark /> Vegetarian
              </span>
            )}
            {p.is_bestseller && (
              <span className="rounded-full bg-gold-gradient px-2.5 py-0.5 text-xs font-bold text-gold-foreground">
                BEST SELLER
              </span>
            )}
          </div>
          <p className="text-lg text-muted-foreground">{p.description}</p>
          <div className="text-3xl font-bold text-primary">
            {inr(p.price)}{" "}
            {p.unit && (
              <span className="text-base font-normal text-muted-foreground">{p.unit}</span>
            )}
          </div>
          {p.is_available ? (
            <>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 rounded-full border bg-card p-1">
                  <button
                    aria-label="Decrease"
                    className="grid size-10 place-items-center rounded-full hover:bg-accent"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="w-6 text-center text-lg font-bold">{qty}</span>
                  <button
                    aria-label="Increase"
                    className="grid size-10 place-items-center rounded-full hover:bg-accent"
                    onClick={() => setQty(Math.min(20, qty + 1))}
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
                <span className="text-muted-foreground">Total {inr(qty * p.price)}</span>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="h-12 flex-1 rounded-2xl font-bold transition-transform active:scale-98" onClick={() => add(false)}>
                  Add to cart
                </Button>
                <Button size="lg" variant="gold" className="h-12 flex-1 rounded-2xl font-bold transition-transform active:scale-98" onClick={() => add(true)}>
                  Buy now
                </Button>
              </div>
            </>
          ) : (
            <p className="rounded-xl bg-muted p-4 text-muted-foreground">
              Sold out for today. Please check back tomorrow!
            </p>
          )}
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 text-3xl font-semibold text-[#0e3a23]">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((r) => (
              <ProductCard key={r.id} p={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
