import { pgTable, text, uuid, integer } from 'drizzle-orm/pg-core';
import { z } from 'zod';

export const storage = pgTable('storage', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(), // e.g. "256GB"
    slug: text('slug').notNull().unique(), // e.g. "256gb"
    sortOrder: integer('sort_order').notNull().default(0),
});

export const insertStorageSchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    sortOrder: z.number().int().optional(),
});

export const selectStorageSchema = insertStorageSchema.extend({
    id: z.string().uuid(),
});

export type InsertStorage = z.infer<typeof insertStorageSchema>;
export type SelectStorage = z.infer<typeof selectStorageSchema>;
