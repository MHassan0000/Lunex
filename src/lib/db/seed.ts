import { db } from '@/lib/db';
import {
  colors, storage, brands, categories, collections, productCollections,
  products, productVariants, productImages,
  insertColorSchema, insertStorageSchema, insertBrandSchema,
  insertCategorySchema, insertCollectionSchema, insertProductSchema, insertVariantSchema, insertProductImageSchema,
  type InsertProduct, type InsertVariant, type InsertProductImage,
  orderItems, reviews, cartItems, wishlists,
} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

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
    log('Clearing existing data...');
    // Clear dependent tables first to avoid FK violations
    await db.delete(orderItems);
    await db.delete(reviews);
    await db.delete(cartItems);
    await db.delete(wishlists);

    // Then clear product data
    await db.delete(productImages);
    await db.delete(productVariants);
    await db.delete(productCollections);
    await db.delete(products);

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

    // Enhanced tech product generation with realistic specs
    const productsData = [
      // Smartphones
      {
        name: 'iPhone 15 Pro',
        brand: 'Apple',
        category: 'Smartphones',
        basePrice: 999,
        images: ['/products/smartphones/phone1.png', '/products/smartphones/phone2.png', '/products/smartphones/phone3.png'],
        specs: {
          display: '6.1" Super Retina XDR OLED',
          resolution: '2556 x 1179 pixels',
          processor: 'A17 Pro Bionic',
          camera: '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
          frontCamera: '12MP TrueDepth',
          battery: '3274 mAh',
          charging: '20W Fast Charging, MagSafe',
          connectivity: '5G, Wi-Fi 6E, Bluetooth 5.3',
          os: 'iOS 17',
          waterResistance: 'IP68',
        }
      },
      {
        name: 'Galaxy S24 Ultra',
        brand: 'Samsung',
        category: 'Smartphones',
        basePrice: 1199,
        images: ['/products/smartphones/phone2.png', '/products/smartphones/phone3.png', '/products/smartphones/phone1.png'],
        specs: {
          display: '6.8" Dynamic AMOLED 2X',
          resolution: '3120 x 1440 pixels, 120Hz',
          processor: 'Snapdragon 8 Gen 3',
          camera: '200MP Main + 50MP Periscope + 12MP Ultra Wide + 10MP Telephoto',
          frontCamera: '12MP',
          battery: '5000 mAh',
          charging: '45W Super Fast Charging',
          connectivity: '5G, Wi-Fi 7, Bluetooth 5.3',
          os: 'Android 14, One UI 6',
          waterResistance: 'IP68',
          sPen: 'Included',
        }
      },
      {
        name: 'Pixel 8 Pro',
        brand: 'Google',
        category: 'Smartphones',
        basePrice: 899,
        images: ['/products/smartphones/phone3.png', '/products/smartphones/phone1.png', '/products/smartphones/phone2.png'],
        specs: {
          display: '6.7" LTPO OLED',
          resolution: '2992 x 1344 pixels, 120Hz',
          processor: 'Google Tensor G3',
          camera: '50MP Main + 48MP Ultra Wide + 48MP Telephoto',
          frontCamera: '10.5MP',
          battery: '5050 mAh',
          charging: '30W Fast Charging',
          connectivity: '5G, Wi-Fi 7, Bluetooth 5.3',
          os: 'Android 14',
          waterResistance: 'IP68',
          aiFeatures: 'Magic Eraser, Best Take, Audio Magic Eraser',
        }
      },

      // Laptops
      {
        name: 'MacBook Air M3',
        brand: 'Apple',
        category: 'Laptops',
        basePrice: 1099,
        images: ['/products/laptops/laptop1.png', '/products/laptops/laptop2.png'],
        specs: {
          display: '13.6" Liquid Retina',
          resolution: '2560 x 1664 pixels',
          processor: 'Apple M3 Chip (8-core CPU)',
          gpu: '8-core or 10-core GPU',
          battery: 'Up to 18 hours',
          ports: '2x Thunderbolt 4, MagSafe 3, 3.5mm jack',
          weight: '2.7 lbs (1.24 kg)',
          os: 'macOS Sonoma',
          keyboard: 'Backlit Magic Keyboard',
          touchId: 'Yes',
        }
      },
      {
        name: 'XPS 15',
        brand: 'Dell',
        category: 'Laptops',
        basePrice: 1499,
        images: ['/products/laptops/laptop2.png', '/products/laptops/laptop3.png'],
        specs: {
          display: '15.6" InfinityEdge',
          resolution: '1920 x 1200 or 3456 x 2160 OLED',
          processor: 'Intel Core i7-13700H',
          gpu: 'NVIDIA GeForce RTX 4050',
          battery: '86 WHr, up to 13 hours',
          ports: '2x Thunderbolt 4, USB-C, SD card reader',
          weight: '4.23 lbs (1.92 kg)',
          os: 'Windows 11 Pro',
          keyboard: 'Backlit with fingerprint reader',
          webcam: '720p HD',
        }
      },
      {
        name: 'ThinkPad X1 Carbon',
        brand: 'Lenovo',
        category: 'Laptops',
        basePrice: 1699,
        images: ['/products/laptops/laptop3.png', '/products/laptops/laptop4.png'],
        specs: {
          display: '14" WUXGA IPS',
          resolution: '1920 x 1200 pixels',
          processor: 'Intel Core i7-1365U',
          gpu: 'Intel Iris Xe Graphics',
          battery: '57 WHr, up to 16 hours',
          ports: '2x Thunderbolt 4, 2x USB-A, HDMI 2.0',
          weight: '2.48 lbs (1.12 kg)',
          os: 'Windows 11 Pro',
          keyboard: 'Backlit with TrackPoint',
          security: 'Fingerprint reader, IR camera',
        }
      },
      {
        name: 'ZenBook Pro',
        brand: 'ASUS',
        category: 'Laptops',
        basePrice: 1299,
        images: ['/products/laptops/laptop4.png', '/products/laptops/laptop1.png'],
        specs: {
          display: '14.5" OLED 2.8K',
          resolution: '2880 x 1800 pixels, 120Hz',
          processor: 'Intel Core i9-13900H',
          gpu: 'NVIDIA GeForce RTX 4060',
          battery: '76 WHr, up to 10 hours',
          ports: 'Thunderbolt 4, USB-A, HDMI 2.1, SD card',
          weight: '3.53 lbs (1.6 kg)',
          os: 'Windows 11 Home',
          keyboard: 'Backlit ErgoSense',
          dialPad: 'ASUS DialPad',
        }
      },

      // Audio
      {
        name: 'WH-1000XM5',
        brand: 'Sony',
        category: 'Headphones',
        basePrice: 349,
        images: ['/products/audio/headphone1.png', '/products/audio/headphone2.png'],
        specs: {
          type: 'Over-Ear Wireless',
          driver: '30mm',
          frequencyResponse: '4Hz - 40kHz',
          noiseCancellation: 'Industry-leading ANC',
          battery: 'Up to 30 hours (ANC on)',
          charging: 'USB-C, Quick charge (3 min = 3 hours)',
          connectivity: 'Bluetooth 5.2, LDAC, AAC',
          multipoint: 'Yes (2 devices)',
          voiceAssistant: 'Alexa, Google Assistant',
          weight: '250g',
        }
      },
      {
        name: 'AirPods Max',
        brand: 'Apple',
        category: 'Headphones',
        basePrice: 549,
        images: ['/products/audio/headphone2.png', '/products/audio/headphone3.png'],
        specs: {
          type: 'Over-Ear Wireless',
          driver: '40mm dynamic',
          frequencyResponse: '10Hz - 20kHz',
          noiseCancellation: 'Active Noise Cancellation',
          battery: 'Up to 20 hours (ANC on)',
          charging: 'Lightning connector',
          connectivity: 'Bluetooth 5.0, Apple H1 chip',
          spatialAudio: 'Yes with dynamic head tracking',
          transparency: 'Transparency mode',
          weight: '384.8g',
        }
      },
      {
        name: 'Galaxy Buds2 Pro',
        brand: 'Samsung',
        category: 'Headphones',
        basePrice: 229,
        images: ['/products/audio/headphone3.png', '/products/audio/headphone4.png'],
        specs: {
          type: 'True Wireless Earbuds',
          driver: '10mm + 5.3mm 2-way',
          frequencyResponse: '20Hz - 20kHz',
          noiseCancellation: 'Intelligent ANC',
          battery: '5 hours (ANC on), 18 hours with case',
          charging: 'USB-C, Wireless charging',
          connectivity: 'Bluetooth 5.3, Samsung Seamless Codec',
          waterResistance: 'IPX7',
          voiceDetect: 'Yes',
          weight: '5.5g per earbud',
        }
      },
      {
        name: 'Pixel Buds Pro',
        brand: 'Google',
        category: 'Headphones',
        basePrice: 199,
        images: ['/products/audio/headphone4.png', '/products/audio/headphone1.png'],
        specs: {
          type: 'True Wireless Earbuds',
          driver: '11mm',
          frequencyResponse: '20Hz - 20kHz',
          noiseCancellation: 'Active Noise Cancellation',
          battery: '7 hours (ANC on), 20 hours with case',
          charging: 'USB-C, Wireless charging',
          connectivity: 'Bluetooth 5.0, AAC, SBC',
          waterResistance: 'IPX4',
          spatialAudio: 'Yes',
          weight: '6.2g per earbud',
        }
      },

      // Wearables
      {
        name: 'Watch Series 9',
        brand: 'Apple',
        category: 'Smartwatches',
        basePrice: 399,
        images: ['/products/wearables/watch1.png', '/products/wearables/watch2.png'],
        specs: {
          display: '1.9" LTPO OLED Retina',
          resolution: '484 x 396 pixels',
          processor: 'S9 SiP (64-bit dual-core)',
          sensors: 'Heart rate, ECG, Blood oxygen, Accelerometer, Gyroscope',
          battery: 'Up to 18 hours',
          charging: 'Magnetic fast charging',
          connectivity: 'Wi-Fi, Bluetooth 5.3, GPS, Cellular (optional)',
          waterResistance: '50m (5 ATM)',
          os: 'watchOS 10',
          compatibility: 'iPhone XS or later',
        }
      },
      {
        name: 'Galaxy Watch 6',
        brand: 'Samsung',
        category: 'Smartwatches',
        basePrice: 299,
        images: ['/products/wearables/watch2.png', '/products/wearables/watch3.png'],
        specs: {
          display: '1.5" Super AMOLED',
          resolution: '480 x 480 pixels',
          processor: 'Exynos W930 (5nm)',
          sensors: 'Heart rate, ECG, Blood pressure, Body composition, Sleep tracking',
          battery: 'Up to 40 hours',
          charging: 'Wireless fast charging',
          connectivity: 'Wi-Fi, Bluetooth 5.3, GPS, LTE (optional)',
          waterResistance: '50m (5 ATM)',
          os: 'Wear OS 4 with One UI Watch 5',
          compatibility: 'Android 8.0 or later',
        }
      },
      {
        name: 'Pixel Watch 2',
        brand: 'Google',
        category: 'Smartwatches',
        basePrice: 349,
        images: ['/products/wearables/watch3.png', '/products/wearables/watch1.png'],
        specs: {
          display: '1.2" AMOLED',
          resolution: '384 x 384 pixels',
          processor: 'Qualcomm SW5100',
          sensors: 'Heart rate, ECG, Skin temperature, Stress tracking, SpO2',
          battery: 'Up to 24 hours',
          charging: 'Magnetic USB-C charging',
          connectivity: 'Wi-Fi, Bluetooth 5.0, GPS, LTE (optional)',
          waterResistance: '50m (5 ATM)',
          os: 'Wear OS 4',
          compatibility: 'Android 9.0 or later',
        }
      },
    ];

    log('Creating products with variants');
    for (const p of productsData) {
      const brand = allBrands.find(b => b.name === p.brand);
      const category = allCategories.find(c => c.name === p.category);

      if (!brand || !category) continue;

      const desc = `The new ${p.name} from ${p.brand} features cutting-edge technology and premium design. Experience the best in ${p.category.toLowerCase()} with this flagship device.`;

      const product = insertProductSchema.parse({
        name: p.name,
        description: desc,
        categoryId: category.id,
        brandId: brand.id,
        model: p.name,
        specs: p.specs,
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

      // Determine RAM based on category
      const ramOptions = category.name === 'Smartphones'
        ? ['8GB', '12GB', '16GB']
        : category.name === 'Laptops'
          ? ['16GB', '32GB', '64GB']
          : category.name === 'Smartwatches'
            ? ['1GB', '2GB']
            : ['4GB', '8GB'];

      for (const color of colorChoices) {
        for (const storageOption of storageChoices) {
          const ramOption = ramOptions[Math.floor(Math.random() * ramOptions.length)];
          const priceNum = Number((p.basePrice + (storageOption.sortOrder * 50)).toFixed(2));
          const sku = `${brand.slug.toUpperCase().slice(0, 3)}-${insertedProduct.id.slice(0, 4)}-${color.slug.slice(0, 3).toUpperCase()}-${storageOption.slug.toUpperCase()}`;

          const variant = insertVariantSchema.parse({
            productId: insertedProduct.id,
            sku,
            price: priceNum.toFixed(2),
            colorId: color.id,
            storageId: storageOption.id,
            ram: ramOption,
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

      // Add product images
      const imageUrls = p.images;

      // Add one primary image for the product (not variant-specific)
      const primaryImageUrl = imageUrls[0];
      await db.insert(productImages).values(insertProductImageSchema.parse({
        productId: insertedProduct.id,
        variantId: null, // Product-level image
        url: primaryImageUrl,
        isPrimary: true,
        sortOrder: 0,
      }) as InsertProductImage);

      // Add variant-specific images
      for (let i = 0; i < Math.min(variantIds.length, imageUrls.length); i++) {
        const variantImageUrl = imageUrls[i % imageUrls.length];
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
