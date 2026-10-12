/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { CheckCircle2, Phone, Loader2 } from "lucide-react";
import { getOrdersByTokens } from "@/lib/orders.functions";
import { settingsQuery, STATUS_LABEL } from "@/lib/menu";
import { inr } from "@/lib/pricing";
import { OrderTimeline } from "@/components/site/OrderTimeline";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/order/$token")({
  validateSearch: z.object({ placed: z.boolean().optional() }),
  head: () => ({
    meta: [
      { title: "Track your order — The Classic Crush" },
      { name: "description", content: "Live status of your Classic Crush order." },
      { property: "og:title", content: "Track your order — The Classic Crush" },
      { property: "og:description", content: "Live status of your order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderPage,
});

const PAY_LABEL: Record<string, string> = {
  upi: "UPI",
  card: "Card",
  cod: "Cash on delivery",
  pay_at_cafe: "Pay at café",
};

function OrderPage() {
  const { token } = Route.useParams();
  const { placed } = Route.useSearch();
  const fetchOrders = useServerFn(getOrdersByTokens);
  const { data, isLoading } = useQuery({
    queryKey: ["order", token],
    queryFn: () => fetchOrders({ data: { tokens: [token] } }),
    refetchInterval: 10000,
  });
  const { data: sd } = useQuery(settingsQuery);
  const o = data?.[0];

  if (isLoading)
    return (
      <div className="grid place-items-center py-32">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  if (!o)
    return (
      <div className="py-24 text-center">
        <h1 className="text-3xl">Order not found</h1>
        <Link to="/" className="text-primary">
          Go home
        </Link>
      </div>
    );

  const done = o.status === "delivered" || o.status === "picked_up";
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {placed && (
        <div className="mb-8 rounded-3xl bg-forest-gradient p-8 text-center text-forest-foreground">
          <CheckCircle2 className="mx-auto size-14 text-gold" />
          <h1 className="mt-3 text-4xl font-semibold">
            Thank you, {o.customer_name.split(" ")[0]}!
          </h1>
          <p className="font-script text-3xl text-gold">Made with love, just for you</p>
          <p className="mt-2 opacity-85">
            Your order <b>#{o.order_number}</b> has been placed.
          </p>
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-[1fr_340px]">
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-card">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="eyebrow text-gold">Order #{o.order_number}</p>
              <h2 className="text-3xl font-semibold">{STATUS_LABEL[o.status]}</h2>
              {!done && o.status !== "cancelled" && o.eta_minutes && (
                <p className="text-sm text-muted-foreground">
                  Estimated {o.fulfillment === "pickup" ? "pickup" : "delivery"} by{" "}
                  {new Date(
                    new Date(o.created_at).getTime() + o.eta_minutes * 60000,
                  ).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </p>
              )}
            </div>
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold capitalize">
              {o.fulfillment}
            </span>
          </div>
          <OrderTimeline status={o.status} fulfillment={o.fulfillment} events={o.order_events} />
          {o.delivery_partner && (
            <div className="mt-6 rounded-2xl bg-accent p-4 text-sm">
              Your delivery partner: <b>{o.delivery_partner}</b>
              {o.delivery_partner_phone && (
                <a
                  className="ml-2 inline-flex items-center gap-1 text-primary"
                  href={`tel:${o.delivery_partner_phone}`}
                >
                  <Phone className="size-3" />
                  {o.delivery_partner_phone}
                </a>
              )}
            </div>
          )}
          <p className="mt-6 text-xs text-muted-foreground">This page refreshes automatically.</p>
        </div>
        <aside className="space-y-4 rounded-3xl border border-border/80 bg-card p-6 text-sm shadow-card">
          <h3 className="text-xl font-semibold">Details</h3>
          {o.order_items.map((i: any) => (
            <div key={i.id} className="flex justify-between">
              <span>
                {i.quantity} × {i.name}
              </span>
              <span>{inr(Number(i.line_total))}</span>
            </div>
          ))}
          <div className="gold-rule" />
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{inr(Number(o.subtotal))}</span>
          </div>
          {o.fulfillment === "delivery" && (
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{Number(o.delivery_fee) === 0 ? "Free" : inr(Number(o.delivery_fee))}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Taxes</span>
            <span>{inr(Number(o.tax))}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{inr(Number(o.total))}</span>
          </div>
          <div className="gold-rule" />
          <p>
            Payment: <b>{PAY_LABEL[o.payment_method]}</b> ·{" "}
            <span
              className={o.payment_status === "paid" ? "text-success" : "text-muted-foreground"}
            >
              {o.payment_status}
            </span>
          </p>
          {o.address && (
            <p>
              Deliver to: {o.address.line1}
              {o.address.landmark ? `, ${o.address.landmark}` : ""} – {o.address.pincode} (
              {o.zone_name})
            </p>
          )}
          {sd && (
            <p>
              Questions? Call{" "}
              <a className="text-primary" href={`tel:${sd.settings.phone_primary}`}>
                {sd.settings.phone_primary}
              </a>
            </p>
          )}
          <Button asChild variant="outline" className="w-full">
            <Link to="/menu">Order more</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
