import { Link } from "@tanstack/react-router";
import { Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { foodImage } from "@/lib/food-images";
import { inr } from "@/lib/pricing";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/menu";

export function VegMark() {
  return <span className="inline-grid size-4 place-items-center rounded-[3px] border border-success" title="Vegetarian"><span className="size-2 rounded-full bg-success" /></span>;
}

export function ProductCard({ p }: { p: Product }) {
  const cart = useCart();
  const inCart = cart.items.find((i) => i.productId === p.id);
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-card transition duration-500 hover:-translate-y-1 hover:shadow-lift">
      <Link to="/product/$id" params={{ id: p.id }} className="relative block aspect-[4/3] overflow-hidden">
        <img src={foodImage(p.image_key)} alt={p.name} loading="lazy" width={816} height={816} className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110" draggable={false} />
        {p.is_veg && <span className="absolute left-3 top-3 grid size-7 place-items-center rounded-lg bg-card/90 shadow-card backdrop-blur"><VegMark /></span>}
        {p.is_bestseller && <span className="absolute right-3 top-3 rounded-full bg-gold-gradient px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-gold-foreground">Best seller</span>}
        <span className="absolute bottom-3 right-3 rounded-full bg-card/95 px-3 py-1 text-sm font-bold text-cocoa shadow-card backdrop-blur">{inr(p.price)}{p.unit && <span className="text-xs font-normal text-muted-foreground"> {p.unit}</span>}</span>
        {!p.is_available && <span className="absolute inset-0 grid place-items-center bg-foreground/50 font-semibold text-background">Sold out</span>}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4">
        {p.subgroup && <span className="text-xs text-muted-foreground">{p.subgroup}</span>}
        <Link to="/product/$id" params={{ id: p.id }} className="font-display text-xl font-semibold leading-tight hover:text-primary">{p.name}</Link>
        <p className="line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
        <div className="mt-auto flex items-center justify-end pt-3">
          {!p.is_available ? null : inCart ? (
            <div className="flex items-center gap-2 rounded-full bg-primary px-1 text-primary-foreground">
              <button aria-label="Decrease" className="grid size-8 place-items-center" onClick={() => cart.setQty(p.id, inCart.qty - 1)}><Minus className="size-4" /></button>
              <span className="min-w-4 text-center text-sm font-bold">{inCart.qty}</span>
              <button aria-label="Increase" className="grid size-8 place-items-center" onClick={() => cart.setQty(p.id, inCart.qty + 1)}><Plus className="size-4" /></button>
            </div>
          ) : (
            <button
              onClick={() => { cart.add({ productId: p.id, name: p.name, price: p.price, imageKey: p.image_key }); toast.success(`${p.name} added`); }}
              className="inline-flex h-9 items-center gap-1 rounded-full border border-primary px-4 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Plus className="size-4" /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
