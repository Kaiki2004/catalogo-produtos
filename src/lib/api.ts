import { Product } from "@/types/product";

export async function fetchProducts(params: {
  search?: string;
  status?: "ACTIVE" | "INACTIVE" | "";
}) {
  const sp = new URLSearchParams();
  if (params.search) sp.set("search", params.search);
  if (params.status) sp.set("status", params.status);
  const res = await fetch(`/api/products?${sp.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  const json = (await res.json()) as { data: Product[] };
  return json.data;
}

export async function createProductApi(
  input: Omit<Product, "id" | "createdAt">
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
  patch: Partial<Product>
): Promise<Product> {
  const res = await fetch(`/api/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

export async function deleteProductApi(id: string) {
  const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
}
