import Link from "next/link";
import { Suspense } from "react";
import { Card, CollapsibleSection, ProductGallery, StoragePicker } from "@/components";
import { Heart, ShoppingBag, Star, ShieldCheck, Calendar, Cpu } from "lucide-react";
import ColorSwatches from "@/components/ColorSwatches";
import { getProduct, getProductReviews, getRecommendedProducts, type Review, type RecommendedProduct } from "@/lib/actions/product";

type GalleryVariant = { color: string; images: string[] };

function formatPrice(price: number | null | undefined) {
  if (price === null || price === undefined) return undefined;
  return `$${price.toFixed(2)}`;
}

function NotFoundBlock() {
  return (
    <section className="mx-auto max-w-3xl rounded-xl border border-[--color-dark-700] bg-[--color-dark-800] p-8 text-center">
      <h1 className="font-rajdhani text-3xl font-bold text-white">Product not found</h1>
      <p className="mt-2 text-[--color-dark-500]">The product you’re looking for doesn’t exist or may have been removed.</p>
      <div className="mt-6">
        <Link
          href="/products"
          className="inline-block rounded-md bg-[--color-neon-blue] px-6 py-3 font-rajdhani font-bold text-black transition hover:bg-white hover:shadow-[0_0_15px_rgba(0,243,255,0.5)]"
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
            <Star key={i} className={`h-4 w-4 ${i <= Math.round(avg) ? "fill-[--color-neon-blue]" : "text-[--color-dark-500]"}`} />
          ))}
        </span>
      }
    >
      {reviews.length === 0 ? (
        <p className="text-[--color-dark-500]">No reviews yet.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.slice(0, 10).map((r) => (
            <li key={r.id} className="rounded-lg border border-[--color-dark-700] bg-[--color-dark-800] p-4">
              <div className="mb-1 flex items-center justify-between">
                <p className="font-medium text-white">{r.author}</p>
                <span className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className={`h-4 w-4 ${i <= r.rating ? "fill-[--color-neon-blue] text-[--color-neon-blue]" : "text-[--color-dark-500]"}`} />
                  ))}
                </span>
              </div>
              {r.title && <p className="font-medium text-white">{r.title}</p>}
              {r.content && <p className="mt-1 line-clamp-[8] text-sm text-[--color-light-300]">{r.content}</p>}
              <p className="mt-2 text-xs text-[--color-dark-500]">{new Date(r.createdAt).toLocaleDateString()}</p>
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
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 min-h-screen bg-[--color-dark-950] pt-20">
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
    <main className="min-h-screen bg-[--color-dark-950] pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="py-4 text-xs text-[--color-dark-500]">
          <Link href="/" className="hover:text-[--color-neon-blue]">Home</Link> / <Link href="/products" className="hover:text-[--color-neon-blue]">Products</Link> /{" "}
          <span className="text-white">{product.name}</span>
        </nav>

        <section className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_480px]">
          {galleryVariants.length > 0 && (
            <ProductGallery productId={product.id} variants={galleryVariants} className="lg:sticky lg:top-24" />
          )}

          <div className="flex flex-col gap-6">
            <header className="flex flex-col gap-2">
              {product.brand && (
                <Link href={`/products?brand=${product.brand.slug}`} className="text-sm font-bold uppercase tracking-widest text-[--color-neon-blue]">
                  {product.brand.name}
                </Link>
              )}
              <h1 className="font-rajdhani text-4xl font-bold text-white sm:text-5xl">{product.name}</h1>
              {product.model && <p className="text-sm text-[--color-dark-500]">Model: {product.model}</p>}
            </header>

            <div className="flex items-center gap-3">
              <p className="font-rajdhani text-3xl font-bold text-white text-glow">{formatPrice(displayPrice)}</p>
              {compareAt && (
                <>
                  <span className="text-lg text-[--color-dark-500] line-through">{formatPrice(compareAt)}</span>
                  {discount !== null && (
                    <span className="rounded border border-[--color-neon-green] bg-[--color-neon-green]/10 px-2 py-0.5 text-xs font-bold text-[--color-neon-green]">
                      {discount}% OFF
                    </span>
                  )}
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-[--color-light-300]">
              {product.releaseYear && (
                <div className="flex items-center gap-1.5 rounded bg-[--color-dark-800] px-2 py-1">
                  <Calendar className="h-3.5 w-3.5 text-[--color-neon-purple]" />
                  <span>Released {product.releaseYear}</span>
                </div>
              )}
              {product.warrantyMonths && (
                <div className="flex items-center gap-1.5 rounded bg-[--color-dark-800] px-2 py-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-[--color-neon-green]" />
                  <span>{product.warrantyMonths} Month Warranty</span>
                </div>
              )}
            </div>

            <ColorSwatches productId={product.id} variants={galleryVariants} />
            <StoragePicker productId={product.id} />

            <div className="flex flex-col gap-3 mt-4">
              <button className="flex items-center justify-center gap-2 rounded-md bg-[--color-neon-blue] px-6 py-4 font-rajdhani text-lg font-bold text-black transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(0,243,255,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-neon-blue]">
                <ShoppingBag className="h-5 w-5" />
                Add to Cart
              </button>
              <button className="flex items-center justify-center gap-2 rounded-md border border-[--color-dark-700] bg-[--color-dark-800] px-6 py-4 font-medium text-white transition hover:border-[--color-neon-purple] hover:text-[--color-neon-purple] focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-neon-purple]">
                <Heart className="h-5 w-5" />
                Add to Wishlist
              </button>
            </div>

            <CollapsibleSection title="Tech Specs" defaultOpen>
              {specs ? (
                <div className="grid grid-cols-1 gap-y-2 text-sm">
                  {Object.entries(specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-[--color-dark-700] py-2 last:border-0">
                      <span className="font-medium text-[--color-dark-500] capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                      <span className="text-white text-right">{String(value)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[--color-dark-500]">No specifications available.</p>
              )}
            </CollapsibleSection>

            <CollapsibleSection title="Description">
              <p className="text-[--color-light-300] leading-relaxed">{product.description}</p>
            </CollapsibleSection>

            <CollapsibleSection title="Shipping & Returns">
              <p className="text-[--color-light-300]">Free standard shipping on all orders over $100. 30-day hassle-free returns.</p>
            </CollapsibleSection>

            <Suspense
              fallback={
                <CollapsibleSection title="Reviews">
                  <p className="text-[--color-dark-500]">Loading reviews…</p>
                </CollapsibleSection>
              }
            >
              <ReviewsSection productId={product.id} />
            </Suspense>
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
