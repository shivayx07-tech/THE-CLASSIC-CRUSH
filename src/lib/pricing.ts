// Pure pricing rules shared by checkout UI and the server-side order validation.
export type DeliverySlab = { max_km: number; fee: number };

export type PricingSettings = {
  delivery_slabs: DeliverySlab[];
  max_radius_km: number;
  free_delivery_threshold: number;
  min_order_value: number;
  tax_percent: number;
};

export type DeliveryQuote =
  | { ok: true; fee: number; free: boolean }
  | { ok: false; reason: "out_of_range" };

export function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function quoteDelivery(distanceKm: number, subtotal: number, s: PricingSettings): DeliveryQuote {
  if (distanceKm > Number(s.max_radius_km)) return { ok: false, reason: "out_of_range" };
  const slabs = [...s.delivery_slabs].sort((a, b) => a.max_km - b.max_km);
  const slab = slabs.find((x) => distanceKm <= Number(x.max_km));
  if (!slab) return { ok: false, reason: "out_of_range" };
  const threshold = Number(s.free_delivery_threshold);
  if (threshold > 0 && subtotal >= threshold) return { ok: true, fee: 0, free: true };
  return { ok: true, fee: Number(slab.fee), free: false };
}

export function computeTotals(
  subtotal: number,
  fulfillment: "delivery" | "pickup",
  distanceKm: number | null,
  s: PricingSettings,
) {
  const tax = round2((subtotal * Number(s.tax_percent)) / 100);
  let deliveryFee = 0;
  let error: string | null = null;
  if (subtotal < Number(s.min_order_value)) {
    error = `Minimum order is ₹${s.min_order_value}`;
  }
  if (fulfillment === "delivery") {
    if (distanceKm == null) error = error ?? "Choose your delivery area";
    else {
      const q = quoteDelivery(distanceKm, subtotal, s);
      if (!q.ok) error = error ?? "Sorry, this address is outside our delivery area";
      else deliveryFee = q.fee;
    }
  }
  return { subtotal: round2(subtotal), tax, deliveryFee, total: round2(subtotal + tax + deliveryFee), error };
}

export const inr = (n: number) =>
  "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 });
