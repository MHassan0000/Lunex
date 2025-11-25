"use client";

import { useProductsStore } from "@/lib/store/productsStore";
import type { Product } from "@/db";

interface ProductsListClientProps {
  products: Product[];
}

export function ProductsListClient({ products }: ProductsListClientProps) {
  const { selectedProduct, setSelectedProduct } = useProductsStore();

  return (
    <div className="grid gap-6 md:grid-cols-[2fr,1.2fr] items-start">
      <section className="grid gap-4 sm:grid-cols-2">
        {products.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() => setSelectedProduct(product)}
            className="group flex flex-col items-start rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-left transition hover:border-zinc-500 hover:bg-zinc-900"
          >
            <div className="mb-2 text-xs uppercase tracking-wide text-amber-400/80">
              {product.category}
            </div>
            <div className="mb-1 text-sm font-medium group-hover:text-amber-300">
              {product.name}
            </div>
            <div className="mb-2 text-xs text-zinc-400 line-clamp-2">
              {product.description}
            </div>
            <div className="mt-auto text-sm font-semibold text-amber-300">
              ${(product.priceCents / 100).toFixed(2)}
            </div>
          </button>
        ))}
      </section>

      <aside className="hidden h-full flex-col rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-sm md:flex">
        {!selectedProduct ? (
          <div className="text-zinc-400">
            Select a gadget on the left to see quick details here.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-wide text-amber-400/80">
              {selectedProduct.category}
            </div>
            <h2 className="text-lg font-semibold">{selectedProduct.name}</h2>
            {selectedProduct.description && (
              <p className="text-zinc-300 text-sm">{selectedProduct.description}</p>
            )}
            <div className="pt-2 text-base font-semibold text-amber-300">
              ${(selectedProduct.priceCents / 100).toFixed(2)}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
