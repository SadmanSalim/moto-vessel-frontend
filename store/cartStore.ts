import { create } from "zustand";
import { persist } from "zustand/middleware";
import { analytics } from "@/lib/analytics";

export interface CartItem {
  id: number;
  /** 'pos' = synced from the POS system, 'website' = created manually in the admin panel. */
  source: "pos" | "website";
  sku: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

function sameItem(a: Pick<CartItem, "id" | "source">, b: Pick<CartItem, "id" | "source">) {
  return a.id === b.id && a.source === b.source;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number, source: CartItem["source"]) => void;
  updateQuantity: (id: number, source: CartItem["source"], quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find((i) => sameItem(i, item));
        if (existing) {
          set({
            items: get().items.map((i) =>
              sameItem(i, item) ? { ...i, quantity: i.quantity + item.quantity } : i,
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
        analytics.addToCart({ id: item.id, name: item.name, price: item.price, quantity: item.quantity });
      },
      removeItem: (id, source) => {
        const removed = get().items.find((i) => sameItem(i, { id, source }));
        set({ items: get().items.filter((i) => !sameItem(i, { id, source })) });
        if (removed) {
          analytics.removeFromCart({ id: removed.id, name: removed.name, price: removed.price, quantity: removed.quantity });
        }
      },
      updateQuantity: (id, source, qty) =>
        set({
          items: get().items.map((i) =>
            sameItem(i, { id, source }) ? { ...i, quantity: Math.max(1, qty) } : i,
          ),
        }),
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "mv-cart" },
  ),
);
