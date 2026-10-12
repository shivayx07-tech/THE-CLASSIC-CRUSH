import { Link } from "@tanstack/react-router";
import { Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { foodImage } from "@/lib/food-images";
import { inr } from "@/lib/pricing";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/menu";

export function VegMark() {
  return (
    <span
      className="inline-grid size-4 place-items-center rounded-[3px] border border-success"
      title="Vegetarian"
    >
      <span className="size-2 rounded-full bg-success" />
    </span>
  );
}

export function ProductCard({ p }: { p: Product }) {
  const cart = useCart();
  const inCart = cart.items.find((i) => i.productId === p.id);
  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-card transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-xl hover:shadow-gold/15">
      <Link
        to="/product/$id"
        params={{ id: p.id }}
        className="relative block aspect-[4/3] overflow-hidden"
      >
        <img
          src={foodImage(p.image_key)}
          alt={p.name}
          loading="lazy"
          width={816}
          height={816}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          draggable={false}
        />
        {p.is_veg && (
          <span className="absolute left-3 top-3 grid size-7 place-items-center rounded-xl bg-card/90 shadow-card backdrop-blur-md">
            <VegMark />
          </span>
        )}
        {p.is_bestseller && (
          <span className="absolute right-3 top-3 rounded-full bg-gold-gradient px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-gold-foreground shadow-sm">
            Best seller
          </span>
        )}
        <span className="absolute bottom-3 right-3 rounded-full bg-card/95 px-3 py-1 text-sm font-bold text-[#0e3a23] shadow-card backdrop-blur-md">
          {inr(p.price)}
          {p.unit && <span className="text-xs font-normal text-muted-foreground"> {p.unit}</span>}
        </span>
        {!p.is_available && (
          <span className="absolute inset-0 grid place-items-center bg-foreground/60 font-semibold text-background backdrop-blur-xs">
            Sold out
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        {p.subgroup && <span className="text-xs font-medium text-muted-foreground">{p.subgroup}</span>}
        <Link
          to="/product/$id"
          params={{ id: p.id }}
          className="font-display text-xl font-bold leading-tight text-[#0e3a23] transition-colors duration-300 hover:text-[#175c37]"
        >
          {p.name}
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <div className="font-display text-lg font-bold text-[#0e3a23]">
            {inr(p.price)}
            {p.unit && <span className="block text-xs font-normal text-muted-foreground">{p.unit}</span>}
          </div>
          {!p.is_available ? null : inCart ? (
            <div className="flex items-center gap-1.5 rounded-full bg-primary px-1.5 py-0.5 text-primary-foreground shadow-sm transition-all duration-300">
              <button
                aria-label="Decrease quantity"
                className="grid size-9 place-items-center rounded-full transition-transform active:scale-90 hover:bg-white/15"
                onClick={() => cart.setQty(p.id, inCart.qty - 1)}
              >
                <Minus className="size-4 stroke-[2.5]" />
              </button>
              <span className="min-w-5 text-center text-sm font-extrabold">{inCart.qty}</span>
              <button
                aria-label="Increase quantity"
                className="grid size-9 place-items-center rounded-full transition-transform active:scale-90 hover:bg-white/15"
                onClick={() => cart.setQty(p.id, inCart.qty + 1)}
              >
                <Plus className="size-4 stroke-[2.5]" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                cart.add({ productId: p.id, name: p.name, price: p.price, imageKey: p.image_key });
                toast.success(`${p.name} added to cart`);
              }}
              className="inline-flex h-10 min-w-24 items-center justify-center gap-1.5 rounded-full border-2 border-primary bg-primary/5 px-4 text-xs font-bold uppercase tracking-wider text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-md active:scale-95"
            >
              <Plus className="size-3.5 stroke-[2.5]" /> ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
