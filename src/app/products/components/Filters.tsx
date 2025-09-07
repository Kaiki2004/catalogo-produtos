"use client";

import { Input, Select, SelectItem, Button } from "@heroui/react";
import { useProductsUi, StatusOpt } from "@/store/useProductsUi";

export default function Filters() {
  const { search, status, setSearch, setStatus, openCreate } = useProductsUi();

  return (
    <div className="flex flex-col sm:flex-row sm:items-end gap-4 w-full border border-slate-200 dark:border-slate-700 rounded-lg p-3">
      <Input
        label="Buscar por nome"
        placeholder="Digite o nome..."
        value={search}
        onValueChange={setSearch}
        variant="bordered"
        className="w-[70%] border rounded-2xl p-2 border-gray-300 hover:bg-gray-200"
      />

      <Select
        label="Status"
        className=" w-[20%] h-19 border rounded-2xl p-2 border-gray-300 hover:bg-gray-200"
        selectedKeys={new Set([status])}
        onSelectionChange={(keys) => {const first = Array.from(keys)[0] ?? "";setStatus(first as StatusOpt);}}
        
      >
        <SelectItem key="">Todos</SelectItem>
        <SelectItem key="ACTIVE">ACTIVE</SelectItem>
        <SelectItem key="INACTIVE">INACTIVE</SelectItem>
      </Select>

      <Button color="primary" onPress={openCreate} className=" h-19 w-[20%] border rounded-2xl p-2 border-gray-300 hover:bg-gray-200">
        Novo produto
      </Button>
    </div>
  );
}
