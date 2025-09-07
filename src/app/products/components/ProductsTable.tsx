"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Skeleton,
} from "@heroui/react";
import type { Product } from "@/types/product";
import { useMemo } from "react";

type Props = {
  data?: Product[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onEdit: (p: Product) => void;
  onAskDelete: (p: Product) => void;
  skeletonRows?: number; // opcional
};

export default function ProductsTable({
  data,
  isLoading,
  isError,
  onRetry,
  onEdit,
  onAskDelete,
  skeletonRows = 5,
}: Props) {
  const items = data ?? [];

  const BRL = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 2,
      }),
    []
  );

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: skeletonRows }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700">
        <span className="text-sm text-slate-600 dark:text-slate-300">
          Erro ao carregar. Tentar novamente?
        </span>
        <Button size="sm" color="primary" onPress={onRetry} aria-label="Tentar novamente">
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <Table
      aria-label="Tabela de produtos"
      removeWrapper
      className="border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm"
      classNames={{
        th: "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-semibold text-xs uppercase tracking-wide",
        td: "text-sm text-slate-700 dark:text-slate-200 py-3",
        tr: "hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
      }}
    >
      <TableHeader>
        <TableColumn>NOME</TableColumn>
        <TableColumn className="whitespace-nowrap">PREÇO</TableColumn>
        <TableColumn>ESTOQUE</TableColumn>
        <TableColumn>STATUS</TableColumn>
        <TableColumn>AÇÕES</TableColumn>
      </TableHeader>

      <TableBody
        emptyContent={
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            Nenhum produto encontrado
          </div>
        }
        items={items}
      >
        {(p) => (
          <TableRow key={p.id}>
            <TableCell className="font-medium">{p.name}</TableCell>
            <TableCell>{BRL.format(p.price)}</TableCell>
            <TableCell>{p.stock}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${p.status === "ACTIVE"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  }`}
              >
                {p.status}
              </span>
            </TableCell>
            <TableCell className="flex gap-2">
              <Button
                size="sm"
                variant="flat"
                onPress={() => onEdit(p)}
                aria-label={`Editar ${p.name}`}
                title={`Editar ${p.name}`}
              >
                Editar
              </Button>
              <Button
                size="sm"
                color="danger"
                variant="flat"
                onPress={() => onAskDelete(p)}
                aria-label={`Remover ${p.name}`}
                title={`Remover ${p.name}`}
              >
                Remover
              </Button>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
