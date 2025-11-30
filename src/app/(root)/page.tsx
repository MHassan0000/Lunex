import React from "react";
import { Card } from "@/components";
import { getAllProducts } from "@/lib/actions/product";
import Link from "next/link";
import Image from "next/image";
import { GridScan } from "@/components/GridScan";
import ScrambledText from "@/components/ScrambledText";

const CATEGORIES = [
  { name: "Smartphones", slug: "smartphones", image: "/images/smartphones.png" },
  { name: "Laptops", slug: "laptops", image: "/images/laptops.png" },
  { name: "Audio", slug: "headphones", image: "/images/audio.png" },
  { name: "Wearables", slug: "smartwatches", image: "/images/wearables.png" },
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
      {/* Hero Section - extends behind navbar */}
      <section className="relative min-h-[680px] md:min-h-[1000px] w-full -mt-20 pt-20">
        {/* PixelBlast Animated Background */}
        <div className="absolute inset-0 z-0 -p-20">
          <GridScan
            sensitivity={0.55}
            lineThickness={1}
            linesColor="#392e4e"
            gridScale={0.1}
            scanColor="#FF9FFC"
            scanOpacity={0.4}
            enablePost
            bloomIntensity={0.6}
            chromaticAberration={0.002}
            noiseIntensity={0.01}
          />
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[--color-dark-950]/50 to-[--color-dark-950]" />
        </div>

        {/* Hero Content */}
        <div className="relative mx-auto flex min-h-[600px] md:min-h-[700px] max-w-7xl flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 text-center
        ">
          <div className="max-w-5xl mt-20 flex flex-col justify-center items-center gap-2">
            <ScrambledText
              className="font-rajdhani text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl capitalize font-bold leading-tight text-white text-center"
              radius={100}
              duration={1.2}
              speed={0.5}
              scrambleChars={":."}>
              Level Up
            </ScrambledText>

            <ScrambledText
              className="font-rajdhani text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl capitalize font-bold leading-tight text-white text-[--color-neon-blue] text-center"
              radius={100}
              duration={1.2}
              speed={0.5}
              scrambleChars={":."}>
              Your Tech
            </ScrambledText>



            <p className="mt-4 md:mt-6 max-w-xl text-base md:text-lg text-[--color-light-300] text-center">
              Discover cutting-edge gadgets and premium electronics. From high-performance rigs to everyday essentials.
            </p>
            <div className="mt-6 md:mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/products"
                className="group relative overflow-hidden rounded-lg bg-[--color-neon-blue] px-6 md:px-8 py-3 md:py-4 font-rajdhani text-base md:text-lg font-bold text-black text-center transition-all hover:text-white hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] hover-lift"
              >
                <span className="relative z-10 ">Shop Now</span>
                <div className="absolute inset-0 bg-white opacity-100 transition-opacity group-hover:opacity-20" />
              </Link>
              <Link
                href="/products?category=laptops"
                className="group rounded-lg border-2 border-[--color-neon-blue] px-6 md:px-8 py-3 md:py-4 font-rajdhani text-base md:text-lg font-bold text-[--color-neon-blue] text-center transition-all hover:bg-[--color-neon-blue]/10 hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] hover-lift"
              >
                View Gadgets
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/grid.png')] opacity-5 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="mb-8 md:mb-12 text-center font-rajdhani text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-wider text-white">
            Shop by <span className="text-[--color-neon-purple] text-glow-purple">Category</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group relative h-48 md:h-64 lg:h-72 overflow-hidden rounded-xl border border-[--color-dark-700] bg-[--color-dark-800] transition-all hover:-translate-y-2 hover:border-[--color-neon-purple] hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
              >
                {/* Background Image */}
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[--color-dark-950] via-[--color-dark-900]/40 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20">
                  <h3 className="font-rajdhani text-xl md:text-2xl lg:text-3xl font-bold text-white transition-all group-hover:text-[--color-neon-purple] group-hover:text-glow-purple translate-y-2 group-hover:translate-y-0">
                    {cat.name}
                  </h3>
                  <div className="h-0 group-hover:h-6 overflow-hidden transition-all duration-300">
                    <p className="mt-1 text-xs md:text-sm text-[--color-light-300] opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                      Explore Collection →
                    </p>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 border-2 border-[--color-neon-purple] opacity-0 scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 rounded-xl pointer-events-none" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-[--color-dark-900] py-12 md:py-20 relative border-y border-[--color-dark-700]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 md:mb-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <h2 className="font-rajdhani text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-wider text-white">
              Featured <span className="text-[--color-neon-green] text-glow">Gear</span>
            </h2>
            <Link
              href="/products"
              className="text-sm font-bold uppercase tracking-widest text-[--color-neon-green] transition-all hover:text-white hover:text-glow hover:underline decoration-[--color-neon-green] underline-offset-4"
            >
              View All →
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {products.map((p) => (
                <Card
                  key={p.id}
                  title={p.name}
                  subtitle={p.subtitle || "Electronics"}
                  imageSrc={p.imageUrl || "/products/laptops/laptop1.png"}
                  price={p.minPrice || 0}
                  href={`/products/${p.id}`}
                  badge={
                    p.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                      ? { label: "New", tone: "blue" }
                      : undefined
                  }
                  className="h-full"
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-[--color-dark-700] bg-[--color-dark-800] p-8 md:p-12 text-center">
              <p className="text-lg text-[--color-light-300]">
                No products available yet. Run the seed script to populate the database.
              </p>
              <p className="mt-2 text-sm text-[--color-dark-500]">
                Run: <code className="rounded bg-[--color-dark-700] px-2 py-1">npm run db:seed</code>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Lunex */}
      <section className="py-12 md:py-20 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 md:mb-12 text-center font-rajdhani text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-wider text-white">
            Why Choose <span className="text-[--color-neon-blue] text-glow">Lunex</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "24-Month Warranty",
                description: "All products come with comprehensive warranty coverage",
                color: "text-[--color-neon-blue]",
                border: "group-hover:border-[--color-neon-blue]",
                glow: "group-hover:shadow-[0_0_20px_rgba(14,165,233,0.3)]"
              },
              {
                title: "Fast Delivery",
                description: "Get your tech delivered within 48 hours",
                color: "text-[--color-neon-purple]",
                border: "group-hover:border-[--color-neon-purple]",
                glow: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              },
              {
                title: "Premium Quality",
                description: "Only the best brands and latest technology",
                color: "text-[--color-neon-green]",
                border: "group-hover:border-[--color-neon-green]",
                glow: "group-hover:shadow-[0_0_20px_rgba(10,255,104,0.3)]"
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className={`glass-panel-rpg group rounded-xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-2 border border-transparent ${feature.border} ${feature.glow}`}
              >
                <h3 className={`mb-3 font-rajdhani text-2xl font-bold text-white ${feature.color} transition-colors`}>
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-[--color-light-300] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main >
  );
};

export default Home;
