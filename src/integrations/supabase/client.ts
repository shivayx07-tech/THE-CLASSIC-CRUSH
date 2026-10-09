/* eslint-disable @typescript-eslint/no-explicit-any */
// Supabase client with graceful mock fallback for standalone operation without environment variables
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { brokeredPreviewStorage } from "./previewAuthStorage";
import {
  getMockCategories,
  getMockProducts,
  getMockSettings,
  getMockZones,
  getMockOrders,
  saveMockCategories,
  saveMockProducts,
  saveMockSettings,
  saveMockZones,
  updateMockOrder,
  type MockOrder,
} from "@/lib/mockData";

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

function serverSupabaseUrl(publicUrl: string, supabaseKey: string): string | undefined {
  if (typeof window !== "undefined" || typeof process === "undefined") return undefined;
  const serverUrl = process.env["SUPABASE_URL"]?.replace(/\/+$/, "");
  if (
    !serverUrl ||
    serverUrl === publicUrl ||
    process.env["SUPABASE_PUBLISHABLE_KEY"] !== supabaseKey
  )
    return undefined;
  return serverUrl;
}

function createSupabaseFetch(supabaseUrl: string, supabaseKey: string): typeof fetch {
  const publicUrl = supabaseUrl.replace(/\/+$/, "");
  const serverUrl = serverSupabaseUrl(publicUrl, supabaseKey);
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
    if (serverUrl) {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      if (url.startsWith(`${publicUrl}/`)) {
        const target = serverUrl + url.slice(publicUrl.length);
        const request =
          typeof input === "string" || input instanceof URL ? target : new Request(target, input);
        return fetch(request, { ...init, headers });
      }
    }
    return fetch(input, { ...init, headers });
  };
}

// Mock auth session state for standalone operation
const ADMIN_USER_ID = "00000000-0000-0000-0000-000000000001";
const ADMIN_EMAIL = "admin@classiccrush.com";

function getMockAuthSession() {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("tcc_admin_logged_in");
  if (stored === "true") {
    return {
      access_token: "mock-jwt-token-admin",
      token_type: "bearer",
      expires_in: 3600,
      refresh_token: "mock-refresh-token",
      user: {
        id: ADMIN_USER_ID,
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
        email: ADMIN_EMAIL,
        role: "authenticated",
      },
    };
  }
  return null;
}

function createMockSupabaseClient() {
  const authListeners = new Set<(event: string, session: unknown) => void>();

  const mockAuth = {
    onAuthStateChange: (cb: (event: string, session: unknown) => void) => {
      authListeners.add(cb);
      return {
        data: {
          subscription: {
            unsubscribe: () => authListeners.delete(cb),
          },
        },
      };
    },
    getSession: async () => {
      const session = getMockAuthSession();
      return { data: { session }, error: null };
    },
    getUser: async () => {
      const session = getMockAuthSession();
      return { data: { user: session?.user ?? null }, error: null };
    },
    signInWithPassword: async ({ email }: { email: string; password?: string }) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("tcc_admin_logged_in", "true");
      }
      const session = getMockAuthSession();
      authListeners.forEach((cb) => cb("SIGNED_IN", session));
      return { data: { session, user: session?.user ?? null }, error: null };
    },
    signUp: async ({ email }: { email: string; password?: string }) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("tcc_admin_logged_in", "true");
      }
      const session = getMockAuthSession();
      authListeners.forEach((cb) => cb("SIGNED_IN", session));
      return { data: { session, user: session?.user ?? null }, error: null };
    },
    signOut: async () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("tcc_admin_logged_in");
      }
      authListeners.forEach((cb) => cb("SIGNED_OUT", null));
      return { error: null };
    },
  };

  const createTableQuery = (table: string) => {
    let _select = "*";
    let _orderCol = "sort";
    let _orderAsc = true;
    let _filterCol: string | null = null;
    let _filterVal: unknown = null;
    let _inCol: string | null = null;
    let _inVals: unknown[] = [];
    let _limitCount: number | null = null;
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
      limit: (n: number) => {
        _limitCount = n;
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
        const items = Array.isArray(records) ? records : [records];
        if (table === "products") {
          const prods = getMockProducts();
          const newItems = items.map((it, i) => ({
            id: it.id || "prod-" + Date.now() + "-" + i,
            ...it,
          }));
          prods.push(...newItems);
          saveMockProducts(prods);
          return { data: Array.isArray(records) ? newItems : newItems[0], error: null };
        }
        if (table === "delivery_zones") {
          const zones = getMockZones();
          const newZones = items.map((it, i) => ({
            id: it.id || "zone-" + Date.now() + "-" + i,
            is_active: it.is_active ?? true,
            ...it,
          }));
          zones.push(...newZones);
          saveMockZones(zones);
          return { data: Array.isArray(records) ? newZones : newZones[0], error: null };
        }
        return { data: records, error: null };
      },
      update: (patch: any) => {
        return {
          eq: async (col: string, val: unknown) => {
            if (table === "products") {
              const prods = getMockProducts();
              const idx = prods.findIndex((p) => (p as any)[col] === val);
              if (idx !== -1) {
                prods[idx] = { ...prods[idx], ...patch };
                saveMockProducts(prods);
              }
              return { data: prods[idx] ?? null, error: null };
            }
            if (table === "settings") {
              const s = getMockSettings();
              const updated = { ...s, ...patch };
              saveMockSettings(updated);
              return { data: updated, error: null };
            }
            if (table === "delivery_zones") {
              const zones = getMockZones();
              const idx = zones.findIndex((z) => (z as any)[col] === val);
              if (idx !== -1) {
                zones[idx] = { ...zones[idx], ...patch };
                saveMockZones(zones);
              }
              return { data: zones[idx] ?? null, error: null };
            }
            if (table === "orders") {
              const updated = updateMockOrder(String(val), patch);
              return { data: updated, error: null };
            }
            return { data: null, error: null };
          },
        };
      },
      delete: () => {
        return {
          eq: async (col: string, val: unknown) => {
            if (table === "products") {
              const prods = getMockProducts().filter((p) => (p as any)[col] !== val);
              saveMockProducts(prods);
              return { data: null, error: null };
            }
            if (table === "delivery_zones") {
              const zones = getMockZones().filter((z) => (z as any)[col] !== val);
              saveMockZones(zones);
              return { data: null, error: null };
            }
            return { data: null, error: null };
          },
        };
      },
      then: (resolve: (res: any) => void) => {
        let result: any[] = [];
        if (table === "categories") {
          result = [...getMockCategories()];
        } else if (table === "products") {
          result = [...getMockProducts()];
        } else if (table === "settings") {
          result = [{ id: 1, ...getMockSettings() }];
        } else if (table === "delivery_zones") {
          result = [...getMockZones()];
        } else if (table === "orders") {
          result = [...getMockOrders()];
        } else if (table === "user_roles") {
          result = [{ id: "role-1", user_id: ADMIN_USER_ID, role: "admin" }];
        }

        if (_filterCol) {
          result = result.filter((item) => item[_filterCol!] === _filterVal);
        }
        if (_inCol && _inVals.length > 0) {
          result = result.filter((item) => _inVals.includes(item[_inCol!]));
        }

        if (_orderCol) {
          result.sort((a, b) => {
            const va = a[_orderCol!];
            const vb = b[_orderCol!];
            if (va < vb) return _orderAsc ? -1 : 1;
            if (va > vb) return _orderAsc ? 1 : -1;
            return 0;
          });
        }

        if (_limitCount !== null) {
          result = result.slice(0, _limitCount);
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
    auth: mockAuth,
    from: (table: string) => createTableQuery(table),
    channel: (_name: string) => ({
      on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
      subscribe: () => ({ unsubscribe: () => {} }),
    }),
    removeChannel: () => {},
  } as unknown as ReturnType<typeof createClient<Database>>;
}

function createSupabaseClient() {
  const SUPABASE_URL = import.meta.env["VITE_SUPABASE_URL"] || process.env["SUPABASE_URL"];
  const SUPABASE_PUBLISHABLE_KEY =
    import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] || process.env["SUPABASE_PUBLISHABLE_KEY"];

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    // Fall back to standalone mock client without throwing
    return createMockSupabaseClient();
  }

  try {
    return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      global: {
        fetch: createSupabaseFetch(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY),
      },
      auth: {
        storage: brokeredPreviewStorage(),
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (err) {
    console.warn("[Supabase] Failed to initialize live client, using mock fallback", err);
    return createMockSupabaseClient();
  }
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
