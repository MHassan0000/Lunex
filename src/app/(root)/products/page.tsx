import { Card } from "@/components";
import Filters from "@/components/Filters";
import Sort from "@/components/Sort";
import { parseFilterParams } from "@/lib/utils/query";
import { getAllProducts } from "@/lib/actions/product";

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
        <header className="flex items-center justify-between py-6">
          <h1 className="font-rajdhani text-3xl font-bold text-white">
            Products <span className="text-[--color-neon-blue]">({totalCount})</span>
          </h1>
          <Sort />
        </header>

        {activeBadges.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {activeBadges.map((b, i) => (
              <span
                key={`${b}-${i}`}
                className="rounded-md border border-[--color-neon-blue] bg-[--color-neon-blue]/10 px-3 py-1 text-xs font-medium text-[--color-neon-blue]"
              >
                {b}
              </span>
            ))}
          </div>
        )}

        <section className="grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr] pb-12">
          <Filters />
          <div>
            {products.length === 0 ? (
              <div className="rounded-xl border border-[--color-dark-700] bg-[--color-dark-800] p-8 text-center">
                <p className="text-[--color-light-300]">No products match your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p) => {
                  const price =
                    p.minPrice !== null && p.maxPrice !== null && p.minPrice !== p.maxPrice
                      ? `$${p.minPrice.toFixed(2)} - $${p.maxPrice.toFixed(2)}`
                      : p.minPrice !== null
                        ? p.minPrice
                        : undefined;
                  return (
                    <Card
                      key={p.id}
                      title={p.name}
                      subtitle={p.subtitle ?? undefined}
                      imageSrc={p.imageUrl ?? "/placeholder-product.jpg"}
                      price={price}
                      href={`/products/${p.id}`}
                    />
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
