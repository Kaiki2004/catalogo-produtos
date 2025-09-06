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
        className="flex-1 min-w-0 sm:max-w-md"
      />

      <Select
        label="Status"
        labelPlacement="inside"
        selectedKeys={new Set([status])}
        onSelectionChange={(keys) => {
          const first = Array.from(keys)[0] ?? "";
          setStatus(first as StatusOpt);
        }}
        size="md"
        variant="bordered"
        className="sm:w-56"
        classNames={{
          trigger: "h-11 px-3 text-left",
          value: "text-left",
          label: "text-left",
        }}
      >
        <SelectItem key="">Todos</SelectItem>
        <SelectItem key="ACTIVE">ACTIVE</SelectItem>
        <SelectItem key="INACTIVE">INACTIVE</SelectItem>
      </Select>

      <Button color="primary" onPress={openCreate} className="h-11 sm:ml-auto">
        Novo produto
      </Button>
    </div>
  );
}
