"use server";

import type { Product } from "@/types/product";
import { createProduct, updateProduct, deleteProduct } from "@/lib/products";

type CreateProductInput = Omit<Product, "id" | "createdAt">;
type UpdateProductInput = Partial<Omit<Product, "id" | "createdAt">>;

export async function createProductAction(data: CreateProductInput) {
  return createProduct(data);
}

export async function updateProductAction(id: string, patch: UpdateProductInput) {
  return updateProduct(id, patch);
}

export async function deleteProductAction(id: string) {
  return deleteProduct(id);
}
