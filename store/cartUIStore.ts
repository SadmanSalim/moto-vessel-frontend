import { create } from "zustand";

/** Controls whether the cart sidebar drawer is open. Separate from cartStore
 * (which holds the actual items) so any component — the header cart icon,
 * an "Add to Cart" button, etc. — can open/close the drawer without needing
 * to touch cart data itself. */
interface CartUIStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useCartUIStore = create<CartUIStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}));
