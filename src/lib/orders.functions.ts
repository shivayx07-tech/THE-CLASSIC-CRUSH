/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { computeTotals, round2, type PricingSettings } from "./pricing";
import {
  MOCK_SETTINGS,
  MOCK_PRODUCTS,
  MOCK_ZONES,
  getMockOrders,
  createMockOrder,
  type MockOrder,
} from "./mockData";

const placeSchema = z.object({
  customer_name: z.string().trim().min(2).max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  fulfillment: z.enum(["delivery", "pickup"]),
  zone_id: z.string().nullable(),
  address: z
    .object({
      line1: z.string().trim().min(3).max(160),
      landmark: z.string().trim().max(120).optional().default(""),
      pincode: z
        .string()
        .trim()
        .regex(/^\d{6}$/, "Enter a 6-digit pincode"),
    })
    .nullable(),
  notes: z.string().trim().max(300).optional().default(""),
  payment_method: z.enum(["upi", "card", "cod", "pay_at_cafe"]),
  items: z
    .array(z.object({ product_id: z.string().min(1), quantity: z.number().int().min(1).max(20) }))
    .min(1)
    .max(40),
});

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => placeSchema.parse(d))
  .handler(async ({ data }) => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: settings } = await supabaseAdmin
        .from("settings")
        .select("*")
        .eq("id", 1)
        .single();

      const s = (settings || MOCK_SETTINGS) as unknown as PricingSettings & {
        is_open: boolean;
        prep_minutes: number;
        delivery_minutes: number;
      };

      if (!s.is_open)
        return { ok: false as const, error: "The café is closed for orders right now" };

      if (data.fulfillment === "delivery" && (!data.zone_id || !data.address))
        return { ok: false as const, error: "Delivery address and area are required" };
      if (data.fulfillment === "pickup" && data.payment_method === "cod")
        return { ok: false as const, error: "Choose Pay at Café for pickup orders" };
      if (data.fulfillment === "delivery" && data.payment_method === "pay_at_cafe")
        return { ok: false as const, error: "Pay at Café is only for pickup" };

      const ids = [...new Set(data.items.map((i) => i.product_id))];
      const { data: products } = await supabaseAdmin
        .from("products")
        .select("id,name,price,is_available")
        .in("id", ids);

      const productList =
        products && products.length > 0
          ? products
          : MOCK_PRODUCTS.filter((p) => ids.includes(p.id));
      const byId = new Map(productList.map((p) => [p.id, p]));

      const lines = [];
      for (const it of data.items) {
        const p = byId.get(it.product_id);
        if (!p)
          return { ok: false as const, error: "An item in your cart is no longer on the menu" };
        if (!p.is_available)
          return { ok: false as const, error: `${p.name} is currently unavailable` };
        const price = Number(p.price);
        lines.push({
          product_id: p.id,
          name: p.name,
          unit_price: price,
          quantity: it.quantity,
          line_total: round2(price * it.quantity),
        });
      }
      const subtotal = lines.reduce((a, l) => a + l.line_total, 0);

      let zone: { name: string; distance_km: number } | null = null;
      if (data.fulfillment === "delivery") {
        const { data: z } = await supabaseAdmin
          .from("delivery_zones")
          .select("*")
          .eq("id", data.zone_id!)
          .eq("is_active", true)
          .maybeSingle();

        const zoneData =
          z || MOCK_ZONES.find((zoneItem) => zoneItem.id === data.zone_id && zoneItem.is_active);
        if (!zoneData)
          return { ok: false as const, error: "Selected delivery area is not available" };
        zone = { name: zoneData.name, distance_km: Number(zoneData.distance_km) };
      }

      const t = computeTotals(subtotal, data.fulfillment, zone?.distance_km ?? null, s);
      if (t.error) return { ok: false as const, error: t.error };

      const eta =
        data.fulfillment === "delivery" ? s.prep_minutes + s.delivery_minutes : s.prep_minutes;

      // Create through mock store fallback / admin
      const res = createMockOrder({
        customer_name: data.customer_name,
        phone: data.phone,
        fulfillment: data.fulfillment,
        address: data.fulfillment === "delivery" ? data.address : null,
        zone_name: zone?.name ?? null,
        distance_km: zone?.distance_km ?? null,
        notes: data.notes || null,
        subtotal: t.subtotal,
        delivery_fee: t.deliveryFee,
        tax: t.tax,
        total: t.total,
        payment_method: data.payment_method,
        items: lines,
        eta_minutes: eta,
      });

      return { ok: true as const, token: res.token };
    } catch (err: any) {
      console.error("Order placement fallback error:", err);
      return {
        ok: false as const,
        error: err?.message || "Could not place order, please try again",
      };
    }
  });

export const getOrdersByTokens = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ tokens: z.array(z.string()).max(30) }).parse(d))
  .handler(async ({ data }) => {
    if (data.tokens.length === 0) return [];
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: orders } = await supabaseAdmin
        .from("orders")
        .select("*, order_items(*), order_events(*)")
        .in("tracking_token", data.tokens)
        .order("created_at", { ascending: false });

      if (orders && orders.length > 0) {
        return (orders as any[]).map((o) => ({
          ...o,
          address: o.address as { line1: string; landmark?: string; pincode: string } | null,
          order_items: o.order_items ?? [],
          order_events: (o.order_events ?? []).sort((a: any, b: any) =>
            a.created_at.localeCompare(b.created_at),
          ),
        }));
      }
    } catch {
      // fallback to mock orders
    }

    const all = getMockOrders();
    const matches = all.filter((o) => data.tokens.includes(o.tracking_token));
    return matches.map((o) => ({
      ...o,
      order_items: o.order_items ?? [],
      order_events: (o.order_events ?? []).sort((a, b) => a.created_at.localeCompare(b.created_at)),
    }));
  });
