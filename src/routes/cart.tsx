import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { foodImage } from "@/lib/food-images";
import { inr } from "@/lib/pricing";
import { settingsQuery } from "@/lib/menu";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — The Classic Crush" },
      { name: "description", content: "Review your order before checkout." },
      { property: "og:title", content: "Your Cart — The Classic Crush" },
      { property: "og:description", content: "Review your order before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const cart = useCart();
  const { data } = useQuery(settingsQuery);
  const s = data?.settings;
  const short = s ? Number(s.min_order_value) - cart.subtotal : 0;
  const toFree = s ? Number(s.free_delivery_threshold) - cart.subtotal : 0;

  if (cart.items.length === 0)
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <ShoppingBag className="mx-auto size-12 text-gold" />
        <h1 className="mt-4 text-4xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Something sweet is waiting for you.</p>
        <Button asChild variant="gold" size="lg" className="mt-6">
          <Link to="/menu">Browse menu</Link>
        </Button>
      </div>
    );

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="mb-6 text-5xl font-semibold text-[#0e3a23]">Your cart</h1>
        <div className="divide-y rounded-3xl border border-border/80 bg-card shadow-card">
          {cart.items.map((i) => (
            <div key={i.productId} className="flex items-center gap-4 p-4">
              <img
                src={foodImage(i.imageKey)}
                alt={i.name}
                width={80}
                height={80}
                loading="lazy"
                className="size-20 rounded-2xl object-cover"
              />
              <div className="flex-1">
                <div className="font-display text-lg font-bold text-[#0e3a23]">{i.name}</div>
                <div className="text-sm text-muted-foreground">{inr(i.price)} each</div>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border/80 p-1">
                <button
                  aria-label="Decrease"
                  className="grid size-8 place-items-center rounded-full hover:bg-accent transition"
                  onClick={() => cart.setQty(i.productId, i.qty - 1)}
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-5 text-center font-bold">{i.qty}</span>
                <button
                  aria-label="Increase"
                  className="grid size-8 place-items-center rounded-full hover:bg-accent transition"
                  onClick={() => cart.setQty(i.productId, i.qty + 1)}
                >
                  <Plus className="size-4" />
                </button>
              </div>
              <div className="w-20 text-right font-bold text-[#0e3a23]">{inr(i.price * i.qty)}</div>
              <button
                aria-label="Remove"
                onClick={() => cart.remove(i.productId)}
                className="text-muted-foreground transition hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <aside className="h-fit space-y-4 rounded-3xl border border-border/80 bg-card p-6 shadow-card lg:sticky lg:top-24">
        <h2 className="text-2xl font-semibold text-[#0e3a23]">Summary</h2>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-bold text-[#0e3a23]">{inr(cart.subtotal)}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Delivery fee and taxes are calculated at checkout.
        </p>
        {s && short > 0 && (
          <p className="rounded-2xl border border-border/60 bg-accent/60 p-3 text-sm">
            Add {inr(short)} more to reach the minimum order of {inr(s.min_order_value)}.
          </p>
        )}
        {s && short <= 0 && toFree > 0 && (
          <p className="rounded-2xl border border-border/60 bg-accent/60 p-3 text-sm">
            Add {inr(toFree)} more for free delivery.
          </p>
        )}
        <Button
          asChild={short <= 0}
          disabled={short > 0}
          variant="gold"
          size="lg"
          className="w-full glow-hover transition-all duration-300"
        >
          {short <= 0 ? (
            <Link to="/checkout">Proceed to checkout</Link>
          ) : (
            <span>Proceed to checkout</span>
          )}
        </Button>
        <Link to="/menu" className="block text-center text-sm text-primary">
          Add more items
        </Link>
      </aside>

      {/* Mobile Sticky Checkout Bar */}
      <div className="fixed inset-x-3 bottom-[calc(4.25rem+max(env(safe-area-inset-bottom),0.35rem))] z-30 flex items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card/95 p-3.5 shadow-[0_-8px_28px_rgba(14,58,35,0.12)] backdrop-blur-xl lg:hidden">
        <div>
          <div className="text-[0.68rem] font-bold uppercase tracking-wider text-muted-foreground">Subtotal</div>
          <div className="font-display text-xl font-bold text-[#0e3a23]">{inr(cart.subtotal)}</div>
        </div>
        <Button
          asChild={short <= 0}
          disabled={short > 0}
          variant="gold"
          size="lg"
          className="h-12 px-6 font-bold shadow-md transition-transform active:scale-95"
        >
          {short <= 0 ? (
            <Link to="/checkout" className="flex items-center gap-2">
              Proceed to checkout →
            </Link>
          ) : (
            <span>Add {inr(short)} more</span>
          )}
        </Button>
      </div>
    </div>
  );
}
