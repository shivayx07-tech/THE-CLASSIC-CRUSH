/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { STATUS_LABEL } from "@/lib/menu";
import { inr } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  component: AdminOrders,
});

type Filter = "active" | "all" | "done";

function nextStatus(status: string, fulfillment: string): string | null {
  const flow =
    fulfillment === "pickup"
      ? ["placed", "accepted", "preparing", "ready", "picked_up"]
      : ["placed", "accepted", "preparing", "ready", "out_for_delivery", "delivered"];
  const i = flow.indexOf(status);
  return i >= 0 && i < flow.length - 1 ? (flow[i + 1] ?? null) : null;
}
const ACTION: Record<string, string> = {
  accepted: "Accept",
  preparing: "Start preparing",
  ready: "Mark ready",
  out_for_delivery: "Out for delivery",
  delivered: "Mark delivered",
  picked_up: "Mark picked up",
};

function AdminOrders() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Filter>("active");
  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const ch = supabase
      .channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (p) => {
        if (p.eventType === "INSERT")
          toast.success("New order received!", { icon: <Bell className="size-4" /> });
        qc.invalidateQueries({ queryKey: ["admin-orders"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);

  async function update(id: string, patch: Database["public"]["Tables"]["orders"]["Update"]) {
    const { error } = await supabase.from("orders").update(patch).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
  }

  const today = new Date().toDateString();
  const todays = orders.filter(
    (o) => new Date(o.created_at).toDateString() === today && o.status !== "cancelled",
  );
  const isDone = (s: string) => ["delivered", "picked_up", "cancelled"].includes(s);
  const shown = orders.filter(
    (o) => filter === "all" || (filter === "active" ? !isDone(o.status) : isDone(o.status)),
  );

  return (
    <div>
      <h1 className="mb-6 text-4xl font-semibold">Orders</h1>
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Today's orders" value={String(todays.length)} />
        <Stat
          label="Today's revenue"
          value={inr(todays.reduce((a, o) => a + Number(o.total), 0))}
        />
        <Stat
          label="New (awaiting)"
          value={String(orders.filter((o) => o.status === "placed").length)}
        />
        <Stat
          label="In progress"
          value={String(orders.filter((o) => !isDone(o.status) && o.status !== "placed").length)}
        />
      </div>
      <div className="mb-4 flex gap-2">
        {(["active", "done", "all"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm capitalize",
              filter === f ? "border-primary bg-primary text-primary-foreground" : "bg-card",
            )}
          >
            {f === "done" ? "Completed" : f}
          </button>
        ))}
      </div>
      {shown.length === 0 && (
        <p className="rounded-2xl bg-card p-10 text-center text-muted-foreground shadow-card">
          No orders here yet.
        </p>
      )}
      <div className="grid gap-4 xl:grid-cols-2">
        {shown.map((o) => (
          <OrderCard key={o.id} o={o} update={update} />
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-card">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-display text-3xl font-semibold">{value}</div>
    </div>
  );
}

function OrderCard({
  o,
  update,
}: {
  o: any;
  update: (id: string, patch: Database["public"]["Tables"]["orders"]["Update"]) => Promise<unknown>;
}) {
  const [partner, setPartner] = useState(o.delivery_partner ?? "");
  const [partnerPhone, setPartnerPhone] = useState(o.delivery_partner_phone ?? "");
  const next = nextStatus(o.status, o.fulfillment);
  const addr = o.address as { line1: string; landmark?: string; pincode: string } | null;
  const needsPartner = next === "out_for_delivery" && !o.delivery_partner;

  return (
    <div
      className={cn(
        "rounded-2xl bg-card p-5 shadow-card",
        o.status === "placed" && "ring-2 ring-gold",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="font-display text-xl font-semibold">#{o.order_number}</div>
          <div className="text-xs text-muted-foreground">
            {new Date(o.created_at).toLocaleString("en-IN")}
          </div>
        </div>
        <div className="flex gap-2">
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold capitalize">
            {o.fulfillment}
          </span>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              o.status === "cancelled"
                ? "bg-destructive/10 text-destructive"
                : "bg-primary/10 text-primary",
            )}
          >
            {STATUS_LABEL[o.status]}
          </span>
        </div>
      </div>
      <div className="mt-3 text-sm">
        <b>{o.customer_name}</b> ·{" "}
        <a href={`tel:${o.phone}`} className="inline-flex items-center gap-1 text-primary">
          <Phone className="size-3" />
          {o.phone}
        </a>
        {addr && (
          <p className="text-muted-foreground">
            {addr.line1}
            {addr.landmark ? `, ${addr.landmark}` : ""} – {addr.pincode} · {o.zone_name} (
            {o.distance_km} km)
          </p>
        )}
        {o.notes && <p className="mt-1 rounded-md bg-accent px-2 py-1">Note: {o.notes}</p>}
      </div>
      <ul className="mt-3 space-y-0.5 text-sm">
        {o.order_items.map(
          (i: { id: string; quantity: number; name: string; line_total: number }) => (
            <li key={i.id} className="flex justify-between">
              <span>
                {i.quantity} × {i.name}
              </span>
              <span>{inr(Number(i.line_total))}</span>
            </li>
          ),
        )}
      </ul>
      <div className="mt-2 flex justify-between border-t pt-2 text-sm">
        <span>
          {o.payment_method.replace(/_/g, " ").toUpperCase()} ·{" "}
          <span className={o.payment_status === "paid" ? "text-success" : "text-muted-foreground"}>
            {o.payment_status}
          </span>
        </span>
        <b>{inr(Number(o.total))}</b>
      </div>

      {o.fulfillment === "delivery" && ["accepted", "preparing", "ready"].includes(o.status) && (
        <div className="mt-3 flex flex-wrap gap-2">
          <Input
            className="h-9 flex-1"
            placeholder="Delivery partner name"
            value={partner}
            onChange={(e) => setPartner(e.target.value)}
          />
          <Input
            className="h-9 w-36"
            placeholder="Phone"
            value={partnerPhone}
            onChange={(e) => setPartnerPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
          />
          <Button
            size="sm"
            variant="outline"
            disabled={!partner.trim()}
            onClick={() =>
              update(o.id, {
                delivery_partner: partner.trim(),
                delivery_partner_phone: partnerPhone || null,
              })
            }
          >
            Assign
          </Button>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {next && (
          <Button
            size="sm"
            variant={o.status === "placed" ? "gold" : "default"}
            disabled={needsPartner}
            title={needsPartner ? "Assign a delivery partner first" : undefined}
            onClick={() =>
              update(o.id, {
                status: next,
                ...(next === "delivered" || next === "picked_up" ? { payment_status: "paid" } : {}),
              })
            }
          >
            {ACTION[next]}
          </Button>
        )}
        {o.payment_status !== "paid" && o.status !== "cancelled" && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => update(o.id, { payment_status: "paid" })}
          >
            Mark paid
          </Button>
        )}
        {!["delivered", "picked_up", "cancelled"].includes(o.status) && (
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive"
            onClick={() => confirm("Cancel this order?") && update(o.id, { status: "cancelled" })}
          >
            Cancel
          </Button>
        )}
      </div>
      {needsPartner && (
        <p className="mt-2 text-xs text-muted-foreground">
          Assign a delivery partner to send it out.
        </p>
      )}
    </div>
  );
}
