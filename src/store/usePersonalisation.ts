import { useEffect, useState, useCallback } from "react";
import { products, type Product } from "@/data/products";

const KEY_RECENT = "promro_recent";
const KEY_WISHLIST = "promro_wishlist";
const KEY_CART = "promro_cart";
const KEY_USER = "promro_user";
const KEY_ORDERS = "promro_orders";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("promro:store", { detail: { key } }));
  } catch {}
}

function useStore<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => read<T>(key, initial));
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.key === key) setState(read<T>(key, initial));
    };
    window.addEventListener("promro:store", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("promro:store", handler);
      window.removeEventListener("storage", handler);
    };
  }, [key]);
  const setter = useCallback(
    (v: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
        write(key, next);
        return next;
      });
    },
    [key]
  );
  return [state, setter];
}

/* Recently viewed */
export function useRecentlyViewed() {
  const [ids, setIds] = useStore<string[]>(KEY_RECENT, []);
  const trackView = useCallback(
    (id: string) => setIds((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 8)),
    [setIds]
  );
  const items = ids.map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[];
  return { items, trackView, clear: () => setIds([]) };
}

/* Recommended — picks from categories the user has viewed most */
export function useRecommended(exclude?: string) {
  const [ids] = useStore<string[]>(KEY_RECENT, []);
  const viewedCats = ids
    .map((id) => products.find((p) => p.id === id)?.category)
    .filter(Boolean) as string[];
  const counts = viewedCats.reduce<Record<string, number>>((acc, c) => {
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});
  const ranked = [...products]
    .filter((p) => p.id !== exclude && !ids.includes(p.id))
    .sort((a, b) => (counts[b.category] || 0) - (counts[a.category] || 0) + (b.rating - a.rating) * 0.1)
    .slice(0, 4);
  // Fallback: top rated
  if (ranked.length === 0) return [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);
  return ranked;
}

/* Wishlist */
export function useWishlist() {
  const [ids, setIds] = useStore<string[]>(KEY_WISHLIST, []);
  const toggle = useCallback(
    (id: string) =>
      setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    [setIds]
  );
  const has = (id: string) => ids.includes(id);
  const remove = (id: string) => setIds((prev) => prev.filter((x) => x !== id));
  const items = ids.map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[];
  return { ids, items, toggle, has, remove, count: ids.length };
}

/* Cart */
export type CartItem = { id: string; qty: number };
export function useCart() {
  const [items, setItems] = useStore<CartItem[]>(KEY_CART, []);
  const add = useCallback(
    (id: string, qty = 1) =>
      setItems((prev) => {
        const exists = prev.find((i) => i.id === id);
        if (exists) return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i));
        return [...prev, { id, qty }];
      }),
    [setItems]
  );
  const update = (id: string, qty: number) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  const detailed = items
    .map((i) => {
      const p = products.find((p) => p.id === i.id);
      return p ? { product: p, qty: i.qty, lineTotal: p.price * i.qty } : null;
    })
    .filter(Boolean) as { product: Product; qty: number; lineTotal: number }[];

  const subtotal = detailed.reduce((s, x) => s + x.lineTotal, 0);
  const count = items.reduce((s, x) => s + x.qty, 0);
  return { items, detailed, add, update, remove, clear, subtotal, count };
}

/* Auth (mock) */
export type User = {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  industry?: string;
  role?: string;
  phone?: string;
};
export function useUser() {
  const [user, setUser] = useStore<User | null>(KEY_USER, null);
  return {
    user,
    login: (u: User) => setUser(u),
    logout: () => setUser(null),
    update: (patch: Partial<User>) => setUser(user ? { ...user, ...patch } : null),
  };
}

/* Orders */
export type Order = {
  id: string;
  date: string;
  total: number;
  items: { name: string; qty: number; price: number; sku: string }[];
  status: "Processing" | "Shipped" | "Delivered";
};
export function useOrders() {
  const [orders, setOrders] = useStore<Order[]>(KEY_ORDERS, []);
  const addOrder = (o: Order) => setOrders((prev) => [o, ...prev]);
  return { orders, addOrder };
}
