import { NextResponse } from "next/server";
import { db, products } from "@/db";

const sampleProducts = [
  {
    name: "Lunex Quantum Gaming PC",
    slug: "lunex-quantum-gaming-pc",
    description: "High-end gaming PC with RTX graphics and liquid cooling.",
    priceCents: 249999,
    stock: 5,
    category: "Desktop PC",
    imageUrl: "/images/products/quantum-gaming-pc.jpg",
  },
  {
    name: "Lunex Nova Mini PC",
    slug: "lunex-nova-mini-pc",
    description: "Ultra-compact mini PC for productivity and media.",
    priceCents: 89999,
    stock: 15,
    category: "Mini PC",
    imageUrl: "/images/products/nova-mini-pc.jpg",
  },
  {
    name: "Lunex StreamBox Pro",
    slug: "lunex-streambox-pro",
    description: "Stream-ready compact PC for creators and gamers.",
    priceCents: 129999,
    stock: 10,
    category: "Streaming PC",
    imageUrl: "/images/products/streambox-pro.jpg",
  },
  {
    name: "Lunex Edge Ultra Tower",
    slug: "lunex-edge-ultra-tower",
    description: "Workstation-class tower for 3D, AI, and video editing.",
    priceCents: 299999,
    stock: 3,
    category: "Workstation",
    imageUrl: "/images/products/edge-ultra-tower.jpg",
  },
];

export async function GET() {
  try {
    await db.delete(products);
    await db.insert(products).values(sampleProducts);

    return NextResponse.json({
      status: "ok",
      count: sampleProducts.length,
    });
  } catch (error) {
    console.error("Seed error", error);
    return NextResponse.json({ error: "Failed to seed products" }, { status: 500 });
  }
}
