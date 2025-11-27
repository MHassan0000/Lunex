import React from "react";
import { Card } from "@/components";
import { getAllProducts } from "@/lib/actions/product";
import Link from "next/link";
import Image from "next/image";

const CATEGORIES = [
  { name: "Smartphones", slug: "smartphones", image: "/categories/smartphone.jpg" },
  { name: "Laptops", slug: "laptops", image: "/categories/laptop.jpg" },
  { name: "Audio", slug: "headphones", image: "/categories/audio.jpg" },
  { name: "Wearables", slug: "smartwatches", image: "/categories/watch.jpg" },
];

const Home = async () => {
  const { products } = await getAllProducts({
    page: 1,
    limit: 6,
    sort: "featured",
    storageSlugs: [],
    ramSlugs: [],
    colorSlugs: [],
    brandSlugs: [],
    categorySlugs: [],
    priceRanges: [],
  });

  return (
    <main className="min-h-screen bg-[--color-dark-950]">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-[--color-dark-900]">
          {/* Placeholder for Hero Image - In a real app, use a real image */}
          <div className="h-full w-full bg-gradient-to-r from-[--color-dark-950] to-[--color-dark-800] opacity-80"></div>
        </div>
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
          <h1 className="font-rajdhani text-6xl font-bold uppercase tracking-wider text-white text-glow sm:text-8xl">
            Level Up <br />
            <span className="text-[--color-neon-blue]">Your Tech</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-[--color-light-300]">
            Discover the latest gadgets and premium electronics. From high-performance rigs to everyday essentials.
          </p>
          <div className="mt-10 flex gap-4">
            <Link
              href="/products"
              className="rounded-md bg-[--color-neon-blue] px-8 py-3 font-rajdhani text-lg font-bold text-black transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(0,243,255,0.5)]"
            >
              Shop Now
            </Link>
            <Link
              href="/products?category=laptops"
              className="rounded-md border border-[--color-neon-blue] px-8 py-3 font-rajdhani text-lg font-bold text-[--color-neon-blue] transition-all hover:bg-[--color-neon-blue]/10 hover:shadow-[0_0_10px_rgba(0,243,255,0.3)]"
            >
              View Laptops
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 font-rajdhani text-4xl font-bold uppercase tracking-wider text-white">
            Shop by <span className="text-[--color-neon-purple]">Category</span>
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group relative h-64 overflow-hidden rounded-xl border border-[--color-dark-700] bg-[--color-dark-800] transition-all hover:border-[--color-neon-purple] hover:shadow-[0_0_15px_rgba(188,19,254,0.3)]"
              >
                <div className="absolute inset-0 flex items-center justify-center bg-[--color-dark-900]">
                  {/* Placeholder for Category Image */}
                  <span className="text-[--color-dark-500]">Image: {cat.name}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[--color-dark-950] via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-6 left-6">
                  <h3 className="font-rajdhani text-2xl font-bold text-white group-hover:text-[--color-neon-purple] transition-colors">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-[--color-dark-900] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <h2 className="font-rajdhani text-4xl font-bold uppercase tracking-wider text-white">
              Featured <span className="text-[--color-neon-green]">Gear</span>
            </h2>
            <Link
              href="/products"
              className="text-sm font-medium uppercase tracking-widest text-[--color-neon-green] hover:text-white hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Card
                key={p.id}
                title={p.name}
                subtitle={p.subtitle || "Electronics"}
                imageSrc={p.imageUrl || "/placeholder.jpg"}
                price={p.minPrice || 0}
                href={`/products/${p.id}`}
                badge={p.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) ? { label: "New", tone: "blue" } : undefined}
                className="h-full"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
