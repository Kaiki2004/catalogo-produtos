"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";
import Filters from "./components/Filters";
import ProductsTable from "./components/ProductsTable";
import ProductModal from "./components/ProductModal";
import DeleteModal from "./components/DeleteModal";
import { useProductsUi } from "@/store/useProductsUi";

export default function ProductsPage() {
  const { search, status, openEdit, askDelete } = useProductsUi();
  const page = 1;

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["products", { search, status, page }],
    queryFn: () => fetchProducts({ search, status }),
  });

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <Filters />
      <ProductsTable
        data={data}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        onEdit={openEdit}
        onAskDelete={askDelete}
      />
      <ProductModal />
      <DeleteModal />
    </main>
  );
}
