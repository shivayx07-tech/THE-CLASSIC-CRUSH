/* eslint-disable @typescript-eslint/no-explicit-any */
// Server-side Supabase client with safe mock fallback for standalone operation without environment variables
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import {
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  MOCK_SETTINGS,
  MOCK_ZONES,
  getMockOrders,
  createMockOrder,
  updateMockOrder,
  type MockOrder,
} from "@/lib/mockData";

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    if (
      isNewSupabaseApiKey(supabaseKey) &&
      headers.get("Authorization") === `Bearer ${supabaseKey}`
    ) {
      headers.delete("Authorization");
    }

    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

function createMockSupabaseAdmin() {
  const createTableQuery = (table: string) => {
    let _select = "*";
    let _orderCol = "sort";
    let _orderAsc = true;
    let _filterCol: string | null = null;
    let _filterVal: unknown = null;
    let _inCol: string | null = null;
    let _inVals: unknown[] = [];
    let _single = false;
    let _maybeSingle = false;

    const builder: any = {
      select: (cols = "*") => {
        _select = cols;
        return builder;
      },
      order: (col: string, options?: { ascending?: boolean }) => {
        _orderCol = col;
        _orderAsc = options?.ascending ?? true;
        return builder;
      },
      eq: (col: string, val: unknown) => {
        _filterCol = col;
        _filterVal = val;
        return builder;
      },
      in: (col: string, vals: unknown[]) => {
        _inCol = col;
        _inVals = vals;
        return builder;
      },
      single: () => {
        _single = true;
        return builder.then ? builder.then((res: any) => res) : builder;
      },
      maybeSingle: () => {
        _maybeSingle = true;
        return builder.then ? builder.then((res: any) => res) : builder;
      },
      insert: async (records: any) => {
        if (table === "orders") {
          const rec = Array.isArray(records) ? records[0] : records;
          const created = createMockOrder({
            customer_name: rec.customer_name,
            phone: rec.phone,
            fulfillment: rec.fulfillment,
            address: rec.address,
            zone_name: rec.zone_name,
            distance_km: rec.distance_km,
            notes: rec.notes,
            subtotal: rec.subtotal,
            delivery_fee: rec.delivery_fee,
            tax: rec.tax,
            total: rec.total,
            payment_method: rec.payment_method,
            items: [],
            eta_minutes: rec.eta_minutes ?? 25,
          });
          const allOrders = getMockOrders();
          const found = allOrders.find((o) => o.tracking_token === created.token);
          return {
            data: found ?? { id: "mock-order-id", tracking_token: created.token },
            error: null,
            select: () => ({
              single: async () => ({
                data: found ?? { id: "mock-order-id", tracking_token: created.token },
                error: null,
              }),
            }),
          };
        }
        return { data: records, error: null };
      },
      update: (patch: any) => {
        return {
          eq: async (col: string, val: unknown) => {
            if (table === "orders") {
              const updated = updateMockOrder(String(val), patch);
              return { data: updated, error: null };
            }
            return { data: null, error: null };
          },
        };
      },
      then: (resolve: (res: any) => void) => {
        let result: any[] = [];
        if (table === "categories") {
          result = [...MOCK_CATEGORIES];
        } else if (table === "products") {
          result = [...MOCK_PRODUCTS];
        } else if (table === "settings") {
          result = [{ id: 1, ...MOCK_SETTINGS }];
        } else if (table === "delivery_zones") {
          result = [...MOCK_ZONES];
        } else if (table === "orders") {
          result = [...getMockOrders()];
        }

        if (_filterCol) {
          result = result.filter((item) => item[_filterCol!] === _filterVal);
        }
        if (_inCol && _inVals.length > 0) {
          result = result.filter((item) => _inVals.includes(item[_inCol!]));
        }

        if (_single || _maybeSingle) {
          resolve({ data: result[0] ?? null, error: null });
        } else {
          resolve({ data: result, error: null });
        }
      },
    };

    return builder;
  };

  return {
    from: (table: string) => createTableQuery(table),
  } as unknown as ReturnType<typeof createClient<Database>>;
}

function createSupabaseAdminClient() {
  const SUPABASE_URL = process.env["SUPABASE_URL"] || import.meta.env["VITE_SUPABASE_URL"];
  const SUPABASE_SERVICE_ROLE_KEY =
    process.env["SUPABASE_SERVICE_ROLE_KEY"] ||
    import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
    process.env["SUPABASE_PUBLISHABLE_KEY"];

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return createMockSupabaseAdmin();
  }

  try {
    return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      global: {
        fetch: createSupabaseFetch(SUPABASE_SERVICE_ROLE_KEY),
      },
      auth: {
        storage: undefined,
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  } catch {
    return createMockSupabaseAdmin();
  }
}

let _supabaseAdmin: ReturnType<typeof createSupabaseAdminClient> | undefined;

export const supabaseAdmin = new Proxy({} as ReturnType<typeof createSupabaseAdminClient>, {
  get(_, prop, receiver) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    return Reflect.get(_supabaseAdmin, prop, receiver);
  },
});
