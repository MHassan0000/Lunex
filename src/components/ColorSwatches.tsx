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
            className={`relative h-[72px] w-[120px] overflow-hidden rounded-lg ring-1 ring-light-300 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500] ${isActive ? "ring-[--color-dark-500]" : "hover:ring-dark-500"
              }`}
          >
            <Image src={src} alt={v.color} fill sizes="120px" className="object-cover" />
            {isActive && (
              <span className="absolute right-1 top-1 rounded-full bg-light-100 p-1">
                <Check className="h-4 w-4 text-dark-900" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
