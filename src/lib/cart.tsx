import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = { productId: string; name: string; price: number; imageKey: string | null; qty: number };

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "tcc-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, loaded]);

  const value = useMemo<CartCtx>(() => ({
    items,
    count: items.reduce((a, i) => a + i.qty, 0),
    subtotal: items.reduce((a, i) => a + i.qty * i.price, 0),
    add: (item, qty = 1) =>
      setItems((prev) => {
        const ex = prev.find((p) => p.productId === item.productId);
        if (ex) return prev.map((p) => (p.productId === item.productId ? { ...p, qty: Math.min(20, p.qty + qty) } : p));
        return [...prev, { ...item, qty }];
      }),
    setQty: (id, qty) =>
      setItems((prev) => (qty <= 0 ? prev.filter((p) => p.productId !== id) : prev.map((p) => (p.productId === id ? { ...p, qty: Math.min(20, qty) } : p)))),
    remove: (id) => setItems((prev) => prev.filter((p) => p.productId !== id)),
    clear: () => setItems([]),
  }), [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}

const ORDERS_KEY = "tcc-my-orders";
export function rememberOrder(token: string) {
  const list: string[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
  if (!list.includes(token)) localStorage.setItem(ORDERS_KEY, JSON.stringify([token, ...list].slice(0, 30)));
}
export function myOrderTokens(): string[] {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]"); } catch { return []; }
}
