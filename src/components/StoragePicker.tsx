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
        <p className="text-xs font-bold uppercase tracking-wider text-[--color-light-300]">Select Storage</p>
        <button className="text-xs font-bold uppercase tracking-wider text-[--color-neon-blue] hover:text-white transition-colors focus:outline-none">
          Specs Guide
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-full">
        {STORAGE_OPTIONS.map((s) => {
          const isActive = selected === s;
          return (
            <button
              key={s}
              onClick={() => setSelection(productId, "storage", isActive ? "" : s)}
              className={`rounded-sm border px-2 sm:px-3 py-2 sm:py-3 text-center text-xs sm:text-sm font-bold transition-all focus:outline-none ${isActive
                ? "border-[--color-neon-blue] bg-[--color-neon-blue]/20 text-[--color-neon-blue] shadow-[0_0_15px_rgba(0,243,255,0.2)]"
                : "border-gray-700 bg-gray-900 text-[--color-dark-500] hover:border-[--color-neon-blue]/50 hover:text-[--color-light-300]"
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
