import { db, products } from "@/db";
import { ProductsListClient } from "@/components/products-list";

export default async function Home() {
  // const items = await db.select().from(products).orderBy(products.createdAt);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Featured Digital PC Gadgets</h1>
          <p className="text-zinc-400 text-sm">
            Products are loaded from Neon PostgreSQL via Drizzle ORM.
          </p>
        </header>

        {/* <ProductsListClient products={items} /> */}
      </div>
    </main>
  );
}
