import { describe, it, expect } from "vitest";
import { quoteDelivery, computeTotals, type PricingSettings } from "./pricing";

const s: PricingSettings = {
  delivery_slabs: [
    { max_km: 2, fee: 20 },
    { max_km: 4, fee: 30 },
    { max_km: 6, fee: 40 },
  ],
  max_radius_km: 6,
  free_delivery_threshold: 499,
  min_order_value: 99,
  tax_percent: 5,
};

describe("delivery fee", () => {
  it("0–2 km costs ₹20", () => expect(quoteDelivery(1.8, 200, s)).toEqual({ ok: true, fee: 20, free: false }));
  it("2–4 km costs ₹30", () => expect(quoteDelivery(3.2, 200, s)).toEqual({ ok: true, fee: 30, free: false }));
  it("4–6 km costs ₹40", () => expect(quoteDelivery(5.8, 200, s)).toEqual({ ok: true, fee: 40, free: false }));
  it("beyond 6 km is refused", () => expect(quoteDelivery(6.5, 200, s).ok).toBe(false));
  it("free above threshold", () => expect(quoteDelivery(5, 499, s)).toEqual({ ok: true, fee: 0, free: true }));
});

describe("totals", () => {
  it("blocks orders under the minimum", () => expect(computeTotals(50, "pickup", null, s).error).toMatch(/Minimum/));
  it("pickup has no delivery fee", () => expect(computeTotals(200, "pickup", null, s).total).toBe(210));
  it("delivery adds slab fee and tax", () => expect(computeTotals(200, "delivery", 3, s).total).toBe(240));
});
