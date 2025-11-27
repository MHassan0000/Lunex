"use client";

import { create } from "zustand";

type VariantSelection = {
  storage: string | null;
  ram: string | null;
  color: string | null;
};

type State = {
  selections: Record<string, VariantSelection>;
  setSelection: (productId: string, key: keyof VariantSelection, value: string) => void;
  getSelection: (productId: string) => VariantSelection;
};

const DEFAULT_SELECTION: VariantSelection = {
  storage: null,
  ram: null,
  color: null,
};

export const useVariantStore = create<State>((set, get) => ({
  selections: {},
  setSelection: (productId, key, value) =>
    set((s) => ({
      selections: {
        ...s.selections,
        [productId]: {
          ...(s.selections[productId] || DEFAULT_SELECTION),
          [key]: value,
        },
      },
    })),
  getSelection: (productId) => {
    return get().selections[productId] || DEFAULT_SELECTION;
  },
}));
