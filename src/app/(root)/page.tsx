import React from "react";
import { Card, AnimatedCounter, ScrollReveal } from "@/components";
import { getAllProducts } from "@/lib/actions/product";
import Link from "next/link";
import { Zap, Shield, TrendingUp, Package } from "lucide-react";

const CATEGORIES = [
  { name: "Smartphones", slug: "smartphones", icon: "📱", color: "neon-blue" },
  { name: "Laptops", slug: "laptops", icon: "💻", color: "neon-purple" },
  { name: "Audio", slug: "headphones", icon: "🎧", color: "neon-green" },
  { name: "Wearables", slug: "smartwatches", icon: "⌚", color: "neon-red" },
];

const STATS = [
  { label: "Products", value: 1000, suffix: "+", icon: Package },
  { label: "Happy Customers", value: 50000, suffix: "+", icon: TrendingUp },
  { label: "Warranty", value: 24, suffix: " Months", icon: Shield },
  { label: "Fast Delivery", value: 48, suffix: " Hours", icon: Zap },
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
      <section className="relative min-h-[700px] w-full overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[--color-dark-950] via-[--color-dark-900] to-[--color-dark-950] animate-gradient" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-[--color-neon-blue] blur-[120px] animate-float" />
            <div className="absolute bottom-20 right-20 h-64 w-64 rounded-full bg-[--color-neon-purple] blur-[120px] animate-float" style={{ animationDelay: "1s" }} />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative mx-auto flex min-h-[700px] max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-rajdhani text-6xl font-bold uppercase leading-tight tracking-wider text-white animate-slide-up sm:text-7xl lg:text-8xl">
              Level Up <br />
              <span className="animate-neon-pulse text-[--color-neon-blue]">Your Tech</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-[--color-light-300] animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Discover cutting-edge gadgets and premium electronics. From high-performance rigs to everyday essentials.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Link
                href="/products"
                className="group relative overflow-hidden rounded-lg bg-[--color-neon-blue] px-8 py-4 font-rajdhani text-lg font-bold text-black transition-all hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] hover-lift"
              >
                <span className="relative z-10">Shop Now</span>
                <div className="absolute inset-0 bg-white opacity-0 transition-opacity group-hover:opacity-20" />
              </Link>
              <Link
                href="/products?category=laptops"
                className="group rounded-lg border-2 border-[--color-neon-blue] px-8 py-4 font-rajdhani text-lg font-bold text-[--color-neon-blue] transition-all hover:bg-[--color-neon-blue]/10 hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] hover-lift"
              >
                View Laptops
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="glass-panel rounded-xl p-6 animate-slide-up"
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              >
                <stat.icon className="mb-3 h-8 w-8 text-[--color-neon-blue]" />
                <div className="font-rajdhani text-3xl font-bold text-white">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="mt-1 text-sm text-[--color-dark-500]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="mb-12 text-center font-rajdhani text-5xl font-bold uppercase tracking-wider text-white">
              Shop by <span className="text-[--color-neon-purple]">Category</span>
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((cat, i) => (
              <ScrollReveal key={cat.slug} delay={i * 100}>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="group relative h-72 overflow-hidden rounded-2xl border border-[--color-dark-700] bg-[--color-dark-800] transition-all hover-lift hover:border-[--color-neon-purple] hover:shadow-[0_0_30px_rgba(188,19,254,0.3)]"
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[--color-dark-800] to-[--color-dark-900]" />

                  {/* Icon */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl opacity-20 transition-all duration-500 group-hover:scale-110 group-hover:opacity-30">
                    {cat.icon}
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[--color-dark-950] to-transparent p-6">
                    <h3 className="font-rajdhani text-3xl font-bold text-white transition-colors group-hover:text-[--color-neon-purple]">
                      {cat.name}
                    </h3>
                    <p className="mt-2 text-sm text-[--color-dark-500] group-hover:text-[--color-light-300]">
                      Explore Collection →
                    </p>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute bottom-0 left-0 h-1 w-full bg-[--color-neon-purple] opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-[--color-dark-900] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-12 flex items-end justify-between">
              <h2 className="font-rajdhani text-5xl font-bold uppercase tracking-wider text-white">
                Featured <span className="text-[--color-neon-green]">Gear</span>
              </h2>
              <Link
                href="/products"
                className="text-sm font-medium uppercase tracking-widest text-[--color-neon-green] transition-colors hover:text-white hover:underline"
              >
                View All →
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 100}>
                <Card
                  title={p.name}
                  subtitle={p.subtitle || "Electronics"}
                  imageSrc={p.imageUrl || "/placeholder.jpg"}
                  price={p.minPrice || 0}
                  href={`/products/${p.id}`}
                  badge={
                    p.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                      ? { label: "New", tone: "blue" }
                      : undefined
                  }
                  className="h-full"
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Lunex */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="mb-16 text-center font-rajdhani text-5xl font-bold uppercase tracking-wider text-white">
              Why Choose <span className="text-[--color-neon-blue]">Lunex</span>
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "24-Month Warranty",
                description: "All products come with comprehensive warranty coverage",
                color: "neon-blue",
              },
              {
                icon: Zap,
                title: "Fast Delivery",
                description: "Get your tech delivered within 48 hours",
                color: "neon-purple",
              },
              {
                icon: TrendingUp,
                title: "Premium Quality",
                description: "Only the best brands and latest technology",
                color: "neon-green",
              },
            ].map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 100}>
                <div className="glass-panel group rounded-2xl p-8 transition-all hover-lift hover:border-[--color-neon-blue]">
                  <feature.icon className="mb-4 h-12 w-12 text-[--color-neon-blue] transition-transform group-hover:scale-110" />
                  <h3 className="mb-3 font-rajdhani text-2xl font-bold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-[--color-light-300]">{feature.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
