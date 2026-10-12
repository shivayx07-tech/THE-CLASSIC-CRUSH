/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Receipt } from "lucide-react";
import { getOrdersByTokens } from "@/lib/orders.functions";
import { myOrderTokens, useCart } from "@/lib/cart";
import { STATUS_LABEL } from "@/lib/menu";
import { inr } from "@/lib/pricing";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "My Orders — The Classic Crush" },
      { name: "description", content: "Your recent orders and their live status." },
      { property: "og:title", content: "My Orders — The Classic Crush" },
      { property: "og:description", content: "Your recent orders and their live status." },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const [tokens, setTokens] = useState<string[] | null>(null);
  useEffect(() => setTokens(myOrderTokens()), []);
  const fetchOrders = useServerFn(getOrdersByTokens);
  const cart = useCart();
  const { data, isLoading } = useQuery({
    queryKey: ["my-orders", tokens],
    queryFn: () => fetchOrders({ data: { tokens: tokens! } }),
    enabled: tokens !== null,
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-5xl font-semibold">My orders</h1>
      <p className="mb-8 text-muted-foreground">Orders placed from this device.</p>
      {(tokens === null || isLoading) && <p className="text-muted-foreground">Loading…</p>}
      {data && data.length === 0 && (
        <div className="rounded-3xl border border-border/80 bg-card p-10 text-center shadow-card">
          <Receipt className="mx-auto size-10 text-gold" />
          <p className="mt-3">No orders yet.</p>
          <Button asChild variant="gold" className="mt-4">
            <Link to="/menu">Start an order</Link>
          </Button>
        </div>
      )}
      <div className="space-y-4">
        {data?.map((o) => (
          <div key={o.id} className="rounded-3xl border border-border/80 bg-card p-6 shadow-card transition-all duration-300 hover:shadow-lift">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="font-display text-xl font-semibold">#{o.order_number}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(o.created_at).toLocaleString("en-IN")} · {o.fulfillment}
                </div>
              </div>
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold">
                {STATUS_LABEL[o.status]}
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {o.order_items.map((i: any) => `${i.quantity}× ${i.name}`).join(", ")}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-bold">{inr(Number(o.total))}</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    o.order_items.forEach(
                      (i: any) =>
                        i.product_id &&
                        cart.add(
                          {
                            productId: i.product_id,
                            name: i.name,
                            price: Number(i.unit_price),
                            imageKey: null,
                          },
                          i.quantity,
                        ),
                    )
                  }
                >
                  Reorder
                </Button>
                <Button size="sm" asChild>
                  <Link to="/order/$token" params={{ token: o.tracking_token }}>
                    Track
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
