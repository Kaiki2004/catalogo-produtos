// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getProduct, updateProduct, deleteProduct } from "@/lib/products";
import type { Product } from "@/types/product";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

// PATCH /api/products/:id
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }   // <- Promise aqui
) {
  try {
    const { id } = await params;                     // <- aguarde aqui
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const current = await getProduct(id);
    if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const patch = (await req.json()) as Partial<Omit<Product, "id" | "createdAt">>;

    if (patch.price !== undefined && !Number.isFinite(patch.price))
      return NextResponse.json({ error: "price must be a number" }, { status: 400 });
    if (patch.stock !== undefined && !Number.isFinite(patch.stock))
      return NextResponse.json({ error: "stock must be a number" }, { status: 400 });
    if (patch.status && !["ACTIVE", "INACTIVE"].includes(patch.status))
      return NextResponse.json({ error: "invalid status" }, { status: 400 });

    const updated = await updateProduct(id, patch);
    return NextResponse.json(updated, { status: 200 });
  } catch (e) {
    console.error("PATCH /api/products/[id] error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// DELETE /api/products/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }   // <- Promise aqui
) {
  try {
    const { id } = await params;                     // <- aguarde aqui
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const current = await getProduct(id);
    if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await deleteProduct(id);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error("DELETE /api/products/[id] error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
