import { create } from 'zustand';

type CartState = {
  count: number;
  setCount: (count: number) => void;
  increment: (qty?: number) => void;
  decrement: (qty?: number) => void;
};

export const useCartStore = create<CartState>((set) => ({
  count: 0,
  setCount: (count) => set({ count }),
  increment: (qty = 1) => set((state) => ({ count: state.count + qty })),
  decrement: (qty = 1) => set((state) => ({ count: Math.max(0, state.count - qty) })),
}));