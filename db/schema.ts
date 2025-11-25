import { pgTable, serial, varchar, integer, numeric, text, timestamp } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  priceCents: integer("price_cents").notNull(),
  stock: integer("stock").notNull().default(0),
  category: varchar("category", { length: 100 }).notNull(),
  imageUrl: varchar("image_url", { length: 512 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
