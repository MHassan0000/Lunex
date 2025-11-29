"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { useVariantStore } from "@/store/variant";

type Variant = {
  color: string;
  images: string[];
};

export interface ProductGalleryProps {
  productId: string;
  variants: Variant[];
  initialVariantIndex?: number;
  className?: string;
}

function isValidSrc(src: string | undefined | null) {
  return typeof src === "string" && src.trim().length > 0;
}

export default function ProductGallery({
  productId,
  variants,
  initialVariantIndex = 0,
  className = "",
}: ProductGalleryProps) {
  const validVariants = useMemo(() => {
    const unique = new Map<string, Variant>();
    variants.forEach((v) => {
      if (Array.isArray(v.images) && v.images.some(isValidSrc)) {
        if (!unique.has(v.color)) {
          unique.set(v.color, v);
        }
      }
    });
    return Array.from(unique.values());
  }, [variants]);

  const selection = useVariantStore((s) => s.getSelection(productId));
  const selectedColor = selection.color;

  const variantIndex = useMemo(() => {
    if (!selectedColor) return Math.min(initialVariantIndex, Math.max(validVariants.length - 1, 0));
    const idx = validVariants.findIndex((v) => v.color === selectedColor);
    return idx === -1 ? 0 : idx;
  }, [selectedColor, validVariants, initialVariantIndex]);

  const images = validVariants[variantIndex]?.images?.filter(isValidSrc) ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveIndex(0);
  }, [variantIndex]);

  const setSelection = useVariantStore((s) => s.setSelection);

  const go = useCallback(
    (dir: -1 | 1) => {
      if (images.length === 0) return;

      const next = activeIndex + dir;

      // 1. Within bounds of current variant
      if (next >= 0 && next < images.length) {
        setActiveIndex(next);
        return;
      }

      // 2. Switch Variant
      const nextVariantIdx = variantIndex + dir;
      if (nextVariantIdx >= 0 && nextVariantIdx < validVariants.length) {
        const nextVariant = validVariants[nextVariantIdx];
        setSelection(productId, "color", nextVariant.color);
        return;
      }

      // 3. Loop variants (if multiple)
      if (validVariants.length > 1) {
        if (dir === 1) {
          // Loop to first variant
          setSelection(productId, "color", validVariants[0].color);
        } else {
          // Loop to last variant
          setSelection(productId, "color", validVariants[validVariants.length - 1].color);
        }
        return;
      }

      // 4. Loop within single variant (fallback)
      if (next < 0) setActiveIndex(images.length - 1);
      else if (next >= images.length) setActiveIndex(0);
    },
    [activeIndex, images.length, variantIndex, validVariants, productId, setSelection]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!mainRef.current) return;
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <section className={`flex w-full flex-col gap-6 lg:flex-row ${className}`}>
      <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col scrollbar-hide p-1">
        {images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            aria-label={`Thumbnail ${i + 1}`}
            onClick={() => setActiveIndex(i)}
            className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-sm border-2 transition-all ${i === activeIndex
              ? "border-[--color-neon-blue] shadow-[0_0_15px_rgba(0,243,255,0.4)] scale-105 z-10"
              : "border-[--color-dark-700] hover:border-[--color-light-300] opacity-70 hover:opacity-100"
              }`}
          >
            <Image src={src} alt={`Thumbnail ${i + 1}`} fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>

      <div ref={mainRef} className="order-1 relative w-full aspect-square lg:h-[600px] lg:w-auto lg:flex-1 overflow-hidden rounded-xl bg-[--color-dark-800]/50 lg:order-2 border border-[--color-dark-700] group">
        {images.length > 0 ? (
          <>
            <Image
              key={`${productId}-${variantIndex}-${activeIndex}`}
              src={images[activeIndex]}
              alt="Product image"
              fill
              sizes="(min-width:1024px) 720px, 100vw"
              className="object-contain p-8 animate-fade-in transition-transform duration-500 group-hover:scale-105"
              priority
            />

            <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                className="pointer-events-auto rounded-full bg-[--color-dark-950]/80 p-3 text-white backdrop-blur-md border border-[--color-dark-700] transition hover:border-[--color-neon-blue] hover:text-[--color-neon-blue] hover:shadow-[0_0_15px_rgba(0,243,255,0.3)]"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                className="pointer-events-auto rounded-full bg-[--color-dark-950]/80 p-3 text-white backdrop-blur-md border border-[--color-dark-700] transition hover:border-[--color-neon-blue] hover:text-[--color-neon-blue] hover:shadow-[0_0_15px_rgba(0,243,255,0.3)]"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? "w-8 bg-[--color-neon-blue] shadow-[0_0_8px_rgba(0,243,255,0.5)]" : "w-1.5 bg-[--color-dark-500]"
                    }`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[--color-dark-500]">
            <div className="flex flex-col items-center gap-4">
              <ImageOff className="h-16 w-16 opacity-50" />
              <span className="font-rajdhani text-xl uppercase tracking-wider">No images available</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
