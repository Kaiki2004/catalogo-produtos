// types/product.ts
export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
};

export type CreateProductInput = Omit<Product, "id" | "createdAt">;

export type UpdateProductInput = Partial<Omit<Product, "id" | "createdAt">>;
