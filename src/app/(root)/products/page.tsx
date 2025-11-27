import { Card, ScrollReveal } from "@/components";
import Filters from "@/components/Filters";
import Sort from "@/components/Sort";
import { parseFilterParams } from "@/lib/utils/query";
import { getAllProducts } from "@/lib/actions/product";
import { PackageX } from "lucide-react";
import Link from "next/link";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const parsed = parseFilterParams(sp);
  const { products, totalCount } = await getAllProducts(parsed);

  const activeBadges: string[] = [];

  // Brand filters
  (sp.brand ? (Array.isArray(sp.brand) ? sp.brand : [sp.brand]) : []).forEach((b) =>
    activeBadges.push(String(b))
  );

  // Storage filters
  (sp.storage ? (Array.isArray(sp.storage) ? sp.storage : [sp.storage]) : []).forEach((s) =>
    activeBadges.push(`Storage: ${s}`)
  );

  // RAM filters
  (sp.ram ? (Array.isArray(sp.ram) ? sp.ram : [sp.ram]) : []).forEach((r) =>
    activeBadges.push(`RAM: ${r}`)
  );

  // Color filters
  (sp.color ? (Array.isArray(sp.color) ? sp.color : [sp.color]) : []).forEach((c) =>
    activeBadges.push(String(c)[0].toUpperCase() + String(c).slice(1))
  );

  // Price filters
  (sp.price ? (Array.isArray(sp.price) ? sp.price : [sp.price]) : []).forEach((p) => {
    const [min, max] = String(p).split("-");
    const label = min && max ? `$${min} - $${max}` : min && !max ? `Over $${min}` : `$0 - $${max}`;
    activeBadges.push(label);
  });

  return (
    <main className="min-h-screen bg-[--color-dark-950] px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[--color-dark-700] py-8">
          <div>
            <h1 className="font-rajdhani text-4xl font-bold text-white">
              Products
            </h1>
            <p className="mt-1 text-sm text-[--color-dark-500]">
              <span className="text-[--color-neon-blue]">{totalCount}</span> items available
            </p>
          </div>
          <Sort />
        </header>

        {/* Active Filters */}
        {activeBadges.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 py-4">
            <span className="text-sm font-medium text-[--color-dark-500]">Active Filters:</span>
            {activeBadges.map((b, i) => (
              <span
                key={`${b}-${i}`}
                className="animate-scale-in rounded-md border border-[--color-neon-blue] bg-[--color-neon-blue]/10 px-3 py-1 text-xs font-medium text-[--color-neon-blue]"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {b}
              </span>
            ))}
          </div>
        )}

        {/* Main Content */}
        <section className="grid grid-cols-1 gap-8 py-8 md:grid-cols-[280px_1fr]">
          {/* Filters Sidebar */}
          <aside className="h-fit">
            <Filters />
          </aside>

          {/* Products Grid */}
          <div>
            {products.length === 0 ? (
              <ScrollReveal>
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-[--color-dark-700] bg-[--color-dark-800] p-12 text-center">
                  <PackageX className="mb-4 h-16 w-16 text-[--color-dark-500]" />
                  <h3 className="mb-2 font-rajdhani text-2xl font-bold text-white">
                    No Products Found
                  </h3>
                  <p className="mb-6 text-[--color-light-300]">
                    Try adjusting your filters or browse all products
                  </p>
                  <Link
                    href="/products"
                    className="rounded-lg border border-[--color-neon-blue] px-6 py-3 font-rajdhani font-bold text-[--color-neon-blue] transition-all hover:bg-[--color-neon-blue]/10 hover:shadow-[0_0_20px_rgba(0,243,255,0.3)]"
                  >
                    Clear Filters
                  </Link>
                </div>
              </ScrollReveal>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((p, i) => {
                  const price =
                    p.minPrice !== null && p.maxPrice !== null && p.minPrice !== p.maxPrice
                      ? `$${p.minPrice.toFixed(2)} - $${p.maxPrice.toFixed(2)}`
                      : p.minPrice !== null
                        ? p.minPrice
                        : undefined;
                  return (
                    <ScrollReveal key={p.id} delay={i * 50}>
                      <Card
                        title={p.name}
                        subtitle={p.subtitle ?? undefined}
                        imageSrc={p.imageUrl ?? "/placeholder-product.jpg"}
                        price={price}
                        href={`/products/${p.id}`}
                        badge={
                          p.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                            ? { label: "New", tone: "blue" }
                            : undefined
                        }
                      />
                    </ScrollReveal>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
