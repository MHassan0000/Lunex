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
  const validVariants = useMemo(
    () => variants.filter((v) => Array.isArray(v.images) && v.images.some(isValidSrc)),
    [variants]
  );

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

  const go = useCallback(
    (dir: -1 | 1) => {
      if (images.length === 0) return;
      setActiveIndex((i) => {
        const next = i + dir;
        if (next < 0) return images.length - 1;
        if (next >= images.length) return 0;
        return next;
      });
    },
    [images.length]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!mainRef.current) return;
      // Only handle if gallery is focused or contained focus? 
      // Or maybe just global if hovering? 
      // Let's keep it simple: if user is interacting with gallery.
      // For now, let's remove strict focus check to allow easier testing, 
      // or ensure the container is focusable.
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <section className={`flex w-full flex-col gap-4 lg:flex-row ${className}`}>
      <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col scrollbar-hide">
        {images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            aria-label={`Thumbnail ${i + 1}`}
            onClick={() => setActiveIndex(i)}
            className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${i === activeIndex
                ? "border-[--color-neon-blue] shadow-[0_0_10px_rgba(0,243,255,0.3)]"
                : "border-[--color-dark-700] hover:border-[--color-light-300]"
              }`}
          >
            <Image src={src} alt={`Thumbnail ${i + 1}`} fill sizes="64px" className="object-cover" />
          </button>
        ))}
      </div>

      <div ref={mainRef} className="order-1 relative w-full aspect-square lg:h-[500px] lg:w-auto lg:flex-1 overflow-hidden rounded-xl bg-[--color-dark-800] lg:order-2 border border-[--color-dark-700]">
        {images.length > 0 ? (
          <>
            <Image
              src={images[activeIndex]}
              alt="Product image"
              fill
              sizes="(min-width:1024px) 720px, 100vw"
              className="object-contain p-4"
              priority
            />

            <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
              <button
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                className="pointer-events-auto rounded-full bg-[--color-dark-900]/80 p-2 text-white backdrop-blur-sm transition hover:bg-[--color-neon-blue] hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-neon-blue]"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                className="pointer-events-auto rounded-full bg-[--color-dark-900]/80 p-2 text-white backdrop-blur-sm transition hover:bg-[--color-neon-blue] hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-neon-blue]"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${i === activeIndex ? "w-6 bg-[--color-neon-blue]" : "w-1.5 bg-[--color-dark-500]"
                    }`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[--color-dark-500]">
            <div className="flex flex-col items-center gap-2">
              <ImageOff className="h-10 w-10" />
              <span>No images available</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
