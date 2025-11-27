import { db } from '@/lib/db';
import {
  colors, storage, brands, categories, collections, productCollections,
  products, productVariants, productImages,
  insertColorSchema, insertStorageSchema, insertBrandSchema,
  insertCategorySchema, insertCollectionSchema, insertProductSchema, insertVariantSchema, insertProductImageSchema,
  type InsertProduct, type InsertVariant, type InsertProductImage,
} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { mkdirSync, existsSync, cpSync } from 'fs';
import { join, basename } from 'path';

type ProductRow = typeof products.$inferSelect;
type VariantRow = typeof productVariants.$inferSelect;

type RGBHex = `#${string}`;

const log = (...args: unknown[]) => console.log('[seed]', ...args);
const err = (...args: unknown[]) => console.error('[seed:error]', ...args);

function pick<T>(arr: T[], n: number) {
  const a = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && a.length; i++) {
    const idx = Math.floor(Math.random() * a.length);
    out.push(a.splice(idx, 1)[0]);
  }
  return out;
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  try {
    log('Seeding filters: colors, storage');

    const colorRows = [
      { name: 'Black', slug: 'black', hexCode: '#000000' as RGBHex },
      { name: 'White', slug: 'white', hexCode: '#FFFFFF' as RGBHex },
      { name: 'Silver', slug: 'silver', hexCode: '#C0C0C0' as RGBHex },
      { name: 'Space Gray', slug: 'space-gray', hexCode: '#4B4B4B' as RGBHex },
      { name: 'Gold', slug: 'gold', hexCode: '#FFD700' as RGBHex },
      { name: 'Blue', slug: 'blue', hexCode: '#0000FF' as RGBHex },
    ].map((c) => insertColorSchema.parse(c));
    for (const row of colorRows) {
      const exists = await db.select().from(colors).where(eq(colors.slug, row.slug)).limit(1);
      if (!exists.length) await db.insert(colors).values(row);
    }

    const storageRows = [
      { name: '64GB', slug: '64gb', sortOrder: 0 },
      { name: '128GB', slug: '128gb', sortOrder: 1 },
      { name: '256GB', slug: '256gb', sortOrder: 2 },
      { name: '512GB', slug: '512gb', sortOrder: 3 },
      { name: '1TB', slug: '1tb', sortOrder: 4 },
      { name: '2TB', slug: '2tb', sortOrder: 5 },
    ].map((s) => insertStorageSchema.parse(s));
    for (const row of storageRows) {
      const exists = await db.select().from(storage).where(eq(storage.slug, row.slug)).limit(1);
      if (!exists.length) await db.insert(storage).values(row);
    }

    log('Seeding brands');
    const brandRows = [
      { name: 'Apple', slug: 'apple' },
      { name: 'Samsung', slug: 'samsung' },
      { name: 'Lenovo', slug: 'lenovo' },
      { name: 'Sony', slug: 'sony' },
      { name: 'Dell', slug: 'dell' },
      { name: 'ASUS', slug: 'asus' },
      { name: 'HP', slug: 'hp' },
      { name: 'Google', slug: 'google' },
      { name: 'Xiaomi', slug: 'xiaomi' },
    ].map(b => insertBrandSchema.parse(b));

    for (const row of brandRows) {
      const exists = await db.select().from(brands).where(eq(brands.slug, row.slug)).limit(1);
      if (!exists.length) await db.insert(brands).values(row);
    }

    log('Seeding categories');
    const catRows = [
      { name: 'Smartphones', slug: 'smartphones', parentId: null },
      { name: 'Laptops', slug: 'laptops', parentId: null },
      { name: 'Tablets', slug: 'tablets', parentId: null },
      { name: 'Smartwatches', slug: 'smartwatches', parentId: null },
      { name: 'Headphones', slug: 'headphones', parentId: null },
      { name: 'Accessories', slug: 'accessories', parentId: null },
    ].map((c) => insertCategorySchema.parse(c));
    for (const row of catRows) {
      const exists = await db.select().from(categories).where(eq(categories.slug, row.slug)).limit(1);
      if (!exists.length) await db.insert(categories).values(row);
    }

    log('Seeding collections');
    const collectionRows = [
      insertCollectionSchema.parse({ name: "Tech Deals", slug: 'tech-deals' }),
      insertCollectionSchema.parse({ name: 'New Arrivals', slug: 'new-arrivals' }),
    ];
    for (const row of collectionRows) {
      const exists = await db.select().from(collections).where(eq(collections.slug, row.slug)).limit(1);
      if (!exists.length) await db.insert(collections).values(row);
    }

    const allColors = await db.select().from(colors);
    const allStorage = await db.select().from(storage);
    const allBrands = await db.select().from(brands);
    const allCategories = await db.select().from(categories);
    const newArrivals = (await db.select().from(collections).where(eq(collections.slug, 'new-arrivals')))[0];

    // Dummy product generation
    const productsData = [
      { name: 'iPhone 15 Pro', brand: 'Apple', category: 'Smartphones', basePrice: 999 },
      { name: 'Galaxy S24 Ultra', brand: 'Samsung', category: 'Smartphones', basePrice: 1199 },
      { name: 'MacBook Air M3', brand: 'Apple', category: 'Laptops', basePrice: 1099 },
      { name: 'XPS 15', brand: 'Dell', category: 'Laptops', basePrice: 1499 },
      { name: 'iPad Pro', brand: 'Apple', category: 'Tablets', basePrice: 799 },
      { name: 'Galaxy Tab S9', brand: 'Samsung', category: 'Tablets', basePrice: 899 },
      { name: 'WH-1000XM5', brand: 'Sony', category: 'Headphones', basePrice: 349 },
      { name: 'Pixel 8 Pro', brand: 'Google', category: 'Smartphones', basePrice: 899 },
      { name: 'Watch Series 9', brand: 'Apple', category: 'Smartwatches', basePrice: 399 },
      { name: 'ThinkPad X1 Carbon', brand: 'Lenovo', category: 'Laptops', basePrice: 1699 },
    ];

    log('Creating products with variants');
    for (const p of productsData) {
      const brand = allBrands.find(b => b.name === p.brand);
      const category = allCategories.find(c => c.name === p.category);

      if (!brand || !category) continue;

      const desc = `The new ${p.name} from ${p.brand} features cutting-edge technology and premium design.`;

      const product = insertProductSchema.parse({
        name: p.name,
        description: desc,
        categoryId: category.id,
        brandId: brand.id,
        model: p.name,
        specs: { cpu: 'Latest Gen', display: 'OLED' },
        warrantyMonths: 12,
        releaseYear: 2024,
        isPublished: true,
      });

      const retP = await db.insert(products).values(product as InsertProduct).returning();
      const insertedProduct = (retP as ProductRow[])[0];

      const colorChoices = pick(allColors, randInt(2, 3));
      const storageChoices = pick(allStorage, randInt(2, 3));

      const variantIds: string[] = [];
      let defaultVariantId: string | null = null;

      for (const color of colorChoices) {
        for (const storageOption of storageChoices) {
          const priceNum = Number((p.basePrice + (storageOption.sortOrder * 50)).toFixed(2));
          const sku = `${brand.slug.toUpperCase().slice(0, 3)}-${insertedProduct.id.slice(0, 4)}-${color.slug.slice(0, 3).toUpperCase()}-${storageOption.slug.toUpperCase()}`;

          const variant = insertVariantSchema.parse({
            productId: insertedProduct.id,
            sku,
            price: priceNum.toFixed(2),
            colorId: color.id,
            storageId: storageOption.id,
            ram: '8GB', // Default for now
            inStock: randInt(10, 100),
            weight: 0.5,
          });

          const retV = await db.insert(productVariants).values(variant as InsertVariant).returning();
          const created = (retV as VariantRow[])[0];
          variantIds.push(created.id);
          if (!defaultVariantId) defaultVariantId = created.id;
        }
      }

      if (defaultVariantId) {
        await db.update(products).set({ defaultVariantId }).where(eq(products.id, insertedProduct.id));
      }

      // Add to collection
      if (newArrivals) {
        await db.insert(productCollections).values({
          productId: insertedProduct.id,
          collectionId: newArrivals.id,
        });
      }

      // Add product images using existing shoe images
      const imageUrls = [
        '/shoes/shoe-1.jpg',
        '/shoes/shoe-2.webp',
        '/shoes/shoe-3.webp',
        '/shoes/shoe-4.webp',
      ];

      // Add one primary image for the product (not variant-specific)
      const primaryImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
      await db.insert(productImages).values(insertProductImageSchema.parse({
        productId: insertedProduct.id,
        variantId: null, // Product-level image
        url: primaryImageUrl,
        isPrimary: true,
        sortOrder: 0,
      }) as InsertProductImage);

      // Add variant-specific images
      for (let i = 0; i < Math.min(variantIds.length, 3); i++) {
        const variantImageUrl = imageUrls[(i + 1) % imageUrls.length];
        await db.insert(productImages).values(insertProductImageSchema.parse({
          productId: insertedProduct.id,
          variantId: variantIds[i],
          url: variantImageUrl,
          isPrimary: false,
          sortOrder: i + 1,
        }) as InsertProductImage);
      }

      log(`Seeded product ${p.name} with ${variantIds.length} variants and images`);
    }

    log('Seeding complete');
  } catch (e) {
    err(e);
    process.exitCode = 1;
  }
}

seed();
