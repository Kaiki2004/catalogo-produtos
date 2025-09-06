"use server";

import { Product } from "@/types/product";
import { createProduct, updateProduct, deleteProduct } from "@/lib/products";

export async function createProductAction(
  data: Omit<Product, "id" | "createdAt">
) {
  "use server";
  return createProduct(data);
}

export async function updateProductAction(id: string, patch: Partial<Product>) {
  "use server";
  return updateProduct(id, patch);
}

export async function deleteProductAction(id: string) {
  "use server";
  return deleteProduct(id);
}
