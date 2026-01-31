import { create } from "zustand";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

type CartState = {
  items: CartItem[];
  itemCount: number;
  setItems: (items: CartItem[]) => void;
  setItemCount: (count: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  itemCount: 0,
  setItems: (items) => set({ items, itemCount: items.reduce((sum, it) => sum + it.quantity, 0) }),
  setItemCount: (itemCount) => set({ itemCount }),
  clearCart: () => set({ items: [], itemCount: 0 }),
}));
