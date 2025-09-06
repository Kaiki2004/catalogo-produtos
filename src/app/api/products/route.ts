import { NextRequest, NextResponse } from "next/server";
import { listProducts, createProduct } from "@/lib/products";
import type { Product } from "@/types/product";


type CreateProductInput = Omit<Product, "id" | "createdAt">;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const status = (searchParams.get("status") ?? "") as "ACTIVE" | "INACTIVE" | "";

  const data = await listProducts({ search, status });

  return NextResponse.json({ data }, { status: 200 });
}

export async function POST(req: NextRequest) {
  let body: Partial<CreateProductInput>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body?.name || typeof body.name !== "string" || !body.name.trim()) {
    return NextResponse.json({ error: "NOME OBRIGATÓRIO" }, { status: 400 });
  }
  if (typeof body.price !== "number" || Number.isNaN(body.price)) {
    return NextResponse.json({ error: "PREÇO DEVE SER UM NUMERO" }, { status: 400 });
  }
  if (!Number.isInteger(body.stock as number)) {
    return NextResponse.json({ error: "O ESTOQUE DEVER SER UM NUMERO INTEIRO" }, { status: 400 });
  }
  if (body.status !== "ACTIVE" && body.status !== "INACTIVE") {
    return NextResponse.json({ error: "STATUS DEVE SER ACTIVE OU INACTIVE" }, { status: 400 });
  }

  const created = await createProduct(body as CreateProductInput);
  return NextResponse.json(created, { status: 201 });
}
