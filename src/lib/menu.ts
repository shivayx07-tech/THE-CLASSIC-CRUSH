import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { PricingSettings } from "./pricing";
import { getMockCategories, getMockProducts, getMockSettings, getMockZones } from "./mockData";

export type Category = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  image_key: string | null;
  sort: number;
};
export type Product = {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  subgroup: string | null;
  price: number;
  unit: string | null;
  image_key: string | null;
  is_available: boolean;
  is_bestseller: boolean;
  is_veg: boolean;
  sort: number;
};
export type Settings = PricingSettings & {
  cafe_name: string;
  phone_primary: string;
  phone_secondary: string | null;
  address: string;
  opening_hours: string;
  is_open: boolean;
  prep_minutes: number;
  delivery_minutes: number;
  instagram_url: string | null;
};
export type Zone = { id: string; name: string; distance_km: number; is_active: boolean };

export const menuQuery = queryOptions({
  queryKey: ["menu"],
  queryFn: async () => {
    try {
      const [c, p] = await Promise.all([
        supabase.from("categories").select("*").order("sort"),
        supabase.from("products").select("*").order("sort"),
      ]);
      if (c.data && Array.isArray(c.data) && c.data.length > 0 && p.data && Array.isArray(p.data)) {
        return {
          categories: c.data as Category[],
          products: (p.data as unknown as Product[]).map((x) => ({ ...x, price: Number(x.price) })),
        };
      }
    } catch (e) {
      console.warn("Using mock menu data fallback", e);
    }
    return {
      categories: getMockCategories(),
      products: getMockProducts(),
    };
  },
});

export const settingsQuery = queryOptions({
  queryKey: ["settings"],
  queryFn: async () => {
    try {
      const [s, z] = await Promise.all([
        supabase.from("settings").select("*").eq("id", 1).single(),
        supabase.from("delivery_zones").select("*").order("distance_km"),
      ]);
      if (s.data && z.data) {
        return { settings: s.data as unknown as Settings, zones: z.data as unknown as Zone[] };
      }
    } catch (e) {
      console.warn("Using mock settings data fallback", e);
    }
    return {
      settings: getMockSettings(),
      zones: getMockZones(),
    };
  },
});

export const STATUS_LABEL: Record<string, string> = {
  placed: "Order placed",
  accepted: "Accepted",
  preparing: "Preparing",
  ready: "Ready",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  picked_up: "Picked up",
  cancelled: "Cancelled",
};
export const DELIVERY_FLOW = [
  "placed",
  "accepted",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
];
export const PICKUP_FLOW = ["placed", "accepted", "preparing", "ready", "picked_up"];
