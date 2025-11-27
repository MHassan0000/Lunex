"use client";

import { useVariantStore } from "@/store/variant";

const STORAGE_OPTIONS = ["64GB", "128GB", "256GB", "512GB", "1TB", "2TB"];

export interface StoragePickerProps {
  productId: string;
  className?: string;
}

export default function StoragePicker({ productId, className = "" }: StoragePickerProps) {
  const setSelection = useVariantStore((s) => s.setSelection);
  const selection = useVariantStore((s) => s.getSelection(productId));
  const selected = selection.storage;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[--color-light-300]">Select Storage</p>
        <button className="text-xs text-[--color-neon-blue] underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-neon-blue]">
          Specs Guide
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {STORAGE_OPTIONS.map((s) => {
          const isActive = selected === s;
          return (
            <button
              key={s}
              onClick={() => setSelection(productId, "storage", isActive ? "" : s)}
              className={`rounded-lg border px-3 py-3 text-center text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-neon-blue] ${isActive
                  ? "border-[--color-neon-blue] bg-[--color-neon-blue]/10 text-[--color-neon-blue] shadow-[0_0_10px_rgba(0,243,255,0.2)]"
                  : "border-[--color-dark-700] bg-[--color-dark-800] text-[--color-dark-500] hover:border-[--color-light-300] hover:text-[--color-light-300]"
                }`}
              aria-pressed={isActive}
            >
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
}
