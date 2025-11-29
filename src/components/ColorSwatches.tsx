"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { useVariantStore } from "@/store/variant";
import { useMemo } from "react";

type Variant = { color: string; images: string[] };

export interface ColorSwatchesProps {
  productId: string;
  variants: Variant[];
  className?: string;
}

function firstValidImage(images: string[]) {
  return images.find((s) => typeof s === "string" && s.trim().length > 0);
}

export default function ColorSwatches({ productId, variants, className = "" }: ColorSwatchesProps) {
  const setSelection = useVariantStore((s) => s.setSelection);
  const selection = useVariantStore((s) => s.getSelection(productId));
  const selectedColor = selection.color;

  // Deduplicate variants by color
  const uniqueColorVariants = useMemo(() => {
    const seen = new Set<string>();
    return variants.filter((v) => {
      if (seen.has(v.color)) return false;
      seen.add(v.color);
      return true;
    });
  }, [variants]);

  return (
    <div className={`flex flex-wrap gap-3 ${className}`} role="listbox" aria-label="Choose color">
      {uniqueColorVariants.map((v, i) => {
        const src = firstValidImage(v.images);
        if (!src) return null;
        const isActive = selectedColor === v.color;
        return (
          <button
            key={`${v.color}-${i}`}
            onClick={() => setSelection(productId, "color", v.color)}
            aria-label={`Color ${v.color}`}
            aria-selected={isActive}
            role="option"
            className={`relative h-[72px] w-[100px] overflow-hidden rounded-sm border-2 transition-all focus:outline-none ${isActive
              ? "border-[--color-neon-blue] shadow-[0_0_15px_rgba(0,243,255,0.3)]"
              : "border-[--color-dark-700] hover:border-[--color-light-300] opacity-70 hover:opacity-100"
              }`}
          >
            <Image src={src} alt={v.color} fill sizes="100px" className="object-cover" />
            {isActive && (
              <div className="absolute inset-0 bg-[--color-neon-blue]/20 flex items-center justify-center backdrop-blur-[1px]">
                <div className="rounded-full bg-[--color-neon-blue] p-1 shadow-lg">
                  <Check className="h-4 w-4 text-black" />
                </div>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white">{v.color}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
