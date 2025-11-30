import Link from "next/link";
import { Suspense } from "react";
import { Card, CollapsibleSection, ProductGallery, StoragePicker } from "@/components";
import AddToCartButton from "@/components/AddToCartButton";
import { Heart, Star, ShieldCheck, Calendar } from "lucide-react";
import ColorSwatches from "@/components/ColorSwatches";
import { getProduct, getProductReviews, getRecommendedProducts, type Review, type RecommendedProduct } from "@/lib/actions/product";

type GalleryVariant = { color: string; images: string[] };

function formatPrice(price: number | null | undefined) {
  if (price === null || price === undefined) return undefined;
  return `$${price.toFixed(2)}`;
}

function NotFoundBlock() {
  return (
    <section className="mx-auto max-w-3xl rounded-xl glass-panel-rpg p-12 text-center">
      <h1 className="font-rajdhani text-4xl font-bold text-white uppercase tracking-wider text-glow">Product not found</h1>
      <p className="mt-4 text-[--color-light-300]">The product you&apos;re looking for doesn&apos;t exist or may have been removed.</p>
      <div className="mt-8">
        <Link
          href="/products"
          className="inline-block rounded-sm bg-[--color-neon-blue] px-8 py-3 font-rajdhani font-bold text-black uppercase tracking-widest transition hover:bg-white hover:shadow-[0_0_20px_rgba(0,243,255,0.6)]"
        >
          Browse Products
        </Link>
      </div>
    </section>
  );
}

async function ReviewsSection({ productId }: { productId: string }) {
  const reviews: Review[] = await getProductReviews(productId);
  const count = reviews.length;
  const avg =
    count > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / count) : 0;

  return (
    <CollapsibleSection
      title={`Reviews (${count})`}
      rightMeta={
        <span className="flex items-center gap-1 text-[--color-neon-blue]">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className={`h-4 w-4 ${i <= Math.round(avg) ? "fill-[--color-neon-blue] text-[--color-neon-blue]" : "text-[--color-dark-500]"}`} />
          ))}
        </span>
      }
    >
      {reviews.length === 0 ? (
        <div className="rounded-lg border border-[--color-dark-700] bg-[--color-dark-800]/50 p-6 text-center">
          <p className="text-[--color-dark-500]">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {reviews.slice(0, 10).map((r) => (
            <li key={r.id} className="rounded-lg border border-[--color-dark-700] bg-[--color-dark-800]/50 p-6 transition-all hover:border-[--color-neon-blue]/30">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-bold text-white uppercase tracking-wider">{r.author}</p>
                <span className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className={`h-3 w-3 ${i <= r.rating ? "fill-[--color-neon-blue] text-[--color-neon-blue]" : "text-[--color-dark-500]"}`} />
                  ))}
                </span>
              </div>
              {r.title && <p className="font-bold text-[--color-light-200] mb-1">{r.title}</p>}
              {r.content && <p className="line-clamp-[8] text-sm text-[--color-light-300] leading-relaxed">{r.content}</p>}
              <p className="mt-3 text-xs text-[--color-dark-500] font-mono">{new Date(r.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </CollapsibleSection>
  );
}

async function AlsoLikeSection({ productId }: { productId: string }) {
  const recs: RecommendedProduct[] = await getRecommendedProducts(productId);
  if (!recs.length) return null;
  return (
    <section className="mt-16">
      <h2 className="mb-6 font-rajdhani text-3xl font-bold uppercase tracking-wider text-white">
        You Might Also Like
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recs.map((p) => (
          <Card
            key={p.id}
            title={p.title}
            imageSrc={p.imageUrl}
            price={p.price ?? undefined}
            href={`/products/${p.id}`}
            className="h-full"
          />
        ))}
      </div>
    </section>
  );
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getProduct(id);

  if (!data) {
    return (
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 min-h-screen bg-[--color-dark-950] pt-20 relative">
        <div className="absolute inset-0 bg-[url('/images/grid.png')] opacity-5 pointer-events-none fixed" />
        <NotFoundBlock />
      </main>
    );
  }

  const { product, variants, images } = data;

  const galleryVariants: GalleryVariant[] = variants.map((v) => {
    const imgs = images
      .filter((img) => img.variantId === v.id)
      .map((img) => img.url);

    const fallback = images
      .filter((img) => img.variantId === null)
      .sort((a, b) => {
        if (a.isPrimary && !b.isPrimary) return -1;
        if (!a.isPrimary && b.isPrimary) return 1;
        return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      })
      .map((img) => img.url);

    return {
      color: v.color?.name || "Default",
      images: imgs.length ? imgs : fallback,
    };
  }).filter((gv) => gv.images.length > 0);

  const defaultVariant =
    variants.find((v) => v.id === product.defaultVariantId) || variants[0];

  const basePrice = defaultVariant ? Number(defaultVariant.price) : null;
  const salePrice = defaultVariant?.salePrice ? Number(defaultVariant.salePrice) : null;

  const displayPrice = salePrice !== null && !Number.isNaN(salePrice) ? salePrice : basePrice;
  const compareAt = salePrice !== null && !Number.isNaN(salePrice) ? basePrice : null;

  const discount =
    compareAt && displayPrice && compareAt > displayPrice
      ? Math.round(((compareAt - displayPrice) / compareAt) * 100)
      : null;

  const specs = product.specs as Record<string, string> | null;

  return (
    <main className="min-h-screen bg-[--color-dark-950] pb-20 relative overflow-x-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[url('/images/grid.png')] opacity-5 pointer-events-none fixed" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <nav className="py-6 text-xs font-bold uppercase tracking-wide sm:tracking-widest text-[--color-dark-500] flex flex-wrap items-center gap-x-2">
          <Link href="/" className="hover:text-[--color-neon-blue] transition-colors">Home</Link> <span className="text-[--color-dark-700]">/</span> <Link href="/products" className="hover:text-[--color-neon-blue] transition-colors">Products</Link> <span className="text-[--color-dark-700]">/</span>
          <span className="text-[--color-neon-purple] break-words">{product.name}</span>
        </nav>

        <section className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_480px] w-full">
          {galleryVariants.length > 0 && (
            <ProductGallery productId={product.id} variants={galleryVariants} className="lg:sticky lg:top-24" />
          )}

          <div className="flex flex-col gap-8 min-w-0">
            <header className="flex flex-col gap-2 border-b border-[--color-dark-700] pb-6">
              {product.brand && (
                <Link href={`/products?brand=${product.brand.slug}`} className="text-sm font-bold uppercase tracking-wide sm:tracking-widest text-[--color-neon-blue] hover:text-white transition-colors w-fit">
                  {product.brand.name}
                </Link>
              )}
              <h1 className="font-rajdhani text-3xl font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight sm:tracking-normal md:tracking-wide break-words overflow-wrap-anywhere">{product.name}</h1>
              {product.model && <p className="text-sm text-[--color-dark-500] font-mono">Model: <span className="text-[--color-light-300]">{product.model}</span></p>}
            </header>

            <div className="flex flex-wrap items-center gap-4">
              <p className="font-rajdhani text-3xl sm:text-4xl font-bold text-white text-glow-purple">{formatPrice(displayPrice)}</p>
              {compareAt && (
                <>
                  <span className="text-xl text-[--color-dark-500] line-through decoration-[--color-neon-red] decoration-2">{formatPrice(compareAt)}</span>
                  {discount !== null && (
                    <span className="rounded-sm border border-[--color-neon-green] bg-[--color-neon-green]/10 px-3 py-1 text-xs font-bold text-[--color-neon-green] uppercase tracking-wider animate-pulse">
                      {discount}% OFF
                    </span>
                  )}
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-normal sm:tracking-wider text-[--color-light-300]">
              {product.releaseYear && (
                <div className="flex items-center gap-2 rounded-sm border border-[--color-dark-700] bg-[--color-dark-800] px-3 py-1.5">
                  <Calendar className="h-4 w-4 text-[--color-neon-purple]" />
                  <span>Released {product.releaseYear}</span>
                </div>
              )}
              {product.warrantyMonths && (
                <div className="flex items-center gap-2 rounded-sm border border-[--color-dark-700] bg-[--color-dark-800] px-3 py-1.5">
                  <ShieldCheck className="h-4 w-4 text-[--color-neon-green]" />
                  <span>{product.warrantyMonths} Month Warranty</span>
                </div>
              )}
            </div>

            <div className="space-y-6 p-4 sm:p-6 rounded-xl glass-panel-rpg w-full">
              <ColorSwatches productId={product.id} variants={galleryVariants} />
              <StoragePicker productId={product.id} />

              <div className="flex flex-col gap-4 mt-2">
                <AddToCartButton productId={product.id} variants={variants} />
                <button className="flex items-center justify-center gap-2 rounded-sm border border-[--color-neon-purple] bg-transparent px-4 sm:px-6 py-4 font-bold text-[--color-neon-purple] uppercase tracking-wide sm:tracking-widest transition-all hover:bg-[--color-neon-purple] hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] focus:outline-none text-sm sm:text-base">
                  <Heart className="h-5 w-5" />
                  Add to Wishlist
                </button>
              </div>
            </div>

            <div className="space-y-4 w-full overflow-hidden">
              <CollapsibleSection title="Tech Specs" defaultOpen>
                {specs ? (
                  <div className="grid grid-cols-1 gap-y-3 text-sm w-full">
                    {Object.entries(specs).map(([key, value]) => (
                      <div key={key} className="flex flex-col sm:flex-row sm:justify-between gap-2 border-b border-[--color-dark-700] py-2 last:border-0 group hover:bg-[--color-dark-800]/50 px-2 transition-colors rounded-sm overflow-hidden">
                        <span className="font-bold text-[--color-dark-500] uppercase tracking-normal sm:tracking-wider group-hover:text-[--color-neon-blue] transition-colors break-words max-w-full">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                        <span className="text-white sm:text-right font-mono break-words max-w-full overflow-wrap-anywhere text-xs sm:text-sm">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[--color-dark-500]">No specifications available.</p>
                )}
              </CollapsibleSection>

              <CollapsibleSection title="Description">
                <p className="text-[--color-light-300] leading-relaxed font-light">{product.description}</p>
              </CollapsibleSection>

              <CollapsibleSection title="Shipping & Returns">
                <p className="text-[--color-light-300]">Free standard shipping on all orders over $100. 30-day hassle-free returns.</p>
              </CollapsibleSection>

              <Suspense
                fallback={
                  <CollapsibleSection title="Reviews">
                    <p className="text-[--color-dark-500] animate-pulse">Loading reviews…</p>
                  </CollapsibleSection>
                }
              >
                <ReviewsSection productId={product.id} />
              </Suspense>
            </div>
          </div>
        </section>

        <Suspense
          fallback={
            <section className="mt-16">
              <h2 className="mb-6 font-rajdhani text-3xl font-bold uppercase tracking-wider text-white">You Might Also Like</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-96 animate-pulse rounded-xl bg-[--color-dark-800]" />
                ))}
              </div>
            </section>
          }
        >
          <AlsoLikeSection productId={product.id} />
        </Suspense>
      </div>
    </main>
  );
}
