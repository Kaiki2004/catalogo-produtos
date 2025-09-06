import type { Product } from "@/types/product";

export type CreateProductInput = Omit<Product, "id" | "createdAt">;
export type UpdateProductInput = Partial<Omit<Product, "id" | "createdAt">>;

export async function fetchProducts(params: {
  search?: string;
  status?: "ACTIVE" | "INACTIVE" | "";
}): Promise<Product[]> {
  const sp = new URLSearchParams();
  if (params?.search) sp.set("search", params.search);
  if (params?.status) sp.set("status", params.status);

  const res = await fetch(`/api/products?${sp.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  const json = (await res.json()) as { data: Product[] };
  return json.data;
}

export async function createProductApi(
  input: CreateProductInput
): Promise<Product> {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

export async function updateProductApi(
  id: string,
  patch: UpdateProductInput
): Promise<Product> {
  const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to update product: ${res.status} ${text}`);
  }
  return res.json();
}

export async function deleteProductApi(id: string): Promise<void> {
  const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to delete product: ${res.status} ${text}`);
  }
}
