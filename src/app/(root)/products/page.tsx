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
    <main className="min-h-screen bg-[--color-dark-950] px-4 sm:px-6 lg:px-8 relative">
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[url('/images/grid.png')] opacity-5 pointer-events-none fixed" />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <header className="flex flex-col gap-4 border-b border-[--color-dark-700] py-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-rajdhani text-3xl font-bold text-white uppercase tracking-wider text-glow-purple sm:text-4xl md:text-5xl">
              Products
            </h1>
            <p className="mt-2 text-sm text-[--color-dark-500] font-mono">
              <span className="text-[--color-neon-blue]">{totalCount}</span> items available
            </p>
          </div>
          <Sort />
        </header>

        {/* Active Filters */}
        {activeBadges.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 py-4">
            <span className="text-sm font-bold text-[--color-dark-500] uppercase tracking-wider">Active Filters:</span>
            {activeBadges.map((b, i) => (
              <span
                key={`${b}-${i}`}
                className="animate-scale-in rounded-sm border border-[--color-neon-blue] bg-[--color-neon-blue]/10 px-3 py-1 text-xs font-bold text-[--color-neon-blue] uppercase tracking-wider backdrop-blur-sm"
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
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-[--color-dark-700] bg-[--color-dark-800]/50 backdrop-blur-sm p-12 text-center">
                  <PackageX className="mb-4 h-16 w-16 text-[--color-dark-500]" />
                  <h3 className="mb-2 font-rajdhani text-3xl font-bold text-white uppercase tracking-wider">
                    No Products Found
                  </h3>
                  <p className="mb-6 text-[--color-light-300]">
                    Try adjusting your filters or browse all products
                  </p>
                  <Link
                    href="/products"
                    className="rounded-sm border border-[--color-neon-blue] px-8 py-3 font-rajdhani font-bold text-[--color-neon-blue] transition-all hover:bg-[--color-neon-blue] hover:text-black hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] uppercase tracking-widest"
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
                        className="h-full"
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
