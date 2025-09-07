import type { Product } from "@/types/product";

let PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Teclado Mecânico",
    price: 299.9,
    stock: 12,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Mouse Gamer",
    price: 159.9,
    stock: 0,
    status: "INACTIVE",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Computador",
    price: 1509.9,
    stock: 10,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  },
];

type NewProduct = {
  name: string;
  price: number;
  stock: number;
  status: "ACTIVE" | "INACTIVE";
};

type ProductPatch = Partial<Omit<Product, "id" | "createdAt">>;

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

export async function getProduct(id: string): Promise<Product | null> {
  return PRODUCTS.find((p) => p.id === id) ?? null;
}

export async function createProduct(input: NewProduct): Promise<Product> {
  const prod: Product = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  };
  PRODUCTS.unshift(prod);
  return prod;
}

export async function updateProduct(id: string, patch: ProductPatch): Promise<Product> {
  const idx = PRODUCTS.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Not found");

  PRODUCTS[idx] = { ...PRODUCTS[idx], ...patch };
  return PRODUCTS[idx];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const prevLen = PRODUCTS.length;
  PRODUCTS = PRODUCTS.filter((p) => p.id !== id);
  return PRODUCTS.length < prevLen;
}
