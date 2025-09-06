import { Product } from "@/types/product";

let PRODUCTS: Product[] = [
  {
    id: crypto.randomUUID(),
    name: "Teclado Mecânico",
    price: 299.9,
    stock: 12,
    status: "ACTIVE",
  },
  {
    id: crypto.randomUUID(),
    name: "Mouse Gamer",
    price: 159.9,
    stock: 0,
    status: "INACTIVE",
  },
];

type ListParams = { search?: string; status?: "ACTIVE" | "INACTIVE" | "" };

export async function listProducts(params: ListParams = {}): Promise<Product[]> {
  const { search = "", status = "" } = params;
  const s = search.trim().toLowerCase();
  return PRODUCTS.filter((p) => {
    const matchesSearch = !s || p.name.toLowerCase().includes(s);
    const matchesStatus = !status || p.status === status;
    return matchesSearch && matchesStatus;
  });
}

export async function createProduct(input: Omit<Product, "id">) {
  const prod: Product = {
    ...input,
    id: crypto.randomUUID(),
  };
  PRODUCTS.unshift(prod);
  return prod;
}

export async function updateProduct(id: string, patch: Partial<Product>) {
  const idx = PRODUCTS.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Not found");
  PRODUCTS[idx] = { ...PRODUCTS[idx], ...patch };
  return PRODUCTS[idx];
}

export async function deleteProduct(id: string) {
  const prevLen = PRODUCTS.length;
  PRODUCTS = PRODUCTS.filter((p) => p.id !== id);
  return prevLen !== PRODUCTS.length;
}

export async function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id) ?? null;
}
