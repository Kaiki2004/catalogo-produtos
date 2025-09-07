"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";
import Filters from "./components/Filters";
import ProductsTable from "./components/ProductsTable";
import ProductModal from "./components/ProductModal";
import DeleteModal from "./components/DeleteModal";
import { useProductsUi } from "@/store/useProductsUi";

export default function ProductsPage() {
  const { search, status, openEdit, askDelete, isModalOpen } = useProductsUi();
  const page = 1;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["products", { search, status, page }],
    queryFn: () => fetchProducts({ search, status }),
  });

  return (
    <div className="p-4">
      {isModalOpen ? (
        <ProductModal />
      ) : (
        <>
          <Filters />
          <ProductsTable
            data={data}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            onEdit={openEdit}
            onAskDelete={askDelete}
          />
        </>
      )}

      <DeleteModal />
    </div>
  );
}
