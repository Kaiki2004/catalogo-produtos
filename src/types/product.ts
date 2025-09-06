export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
};
