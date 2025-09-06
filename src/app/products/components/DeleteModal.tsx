"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useProductsUi } from "@/store/useProductsUi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProductApi } from "@/lib/api";

export default function DeleteModal() {
  const { toDelete, cancelDelete } = useProductsUi();
  const qc = useQueryClient();

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteProductApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });

  const onConfirm = async () => {
    if (!toDelete || deleteMut.isPending) return;
    await deleteMut.mutateAsync(toDelete.id);
    cancelDelete();
  };

  return (
    <Modal
      isOpen={!!toDelete}
      onOpenChange={(open) => {
        if (!open) cancelDelete();
      }}
      backdrop="blur"
      placement="center"
      size="sm"
      classNames={{
        base: "rounded-2xl",
        header: "pb-0",
        footer: "border-t border-slate-200 dark:border-slate-700",
      }}
    >
      <ModalContent className="w-auto p-2 rounded-2xl shadow-2xl">
        <ModalHeader className="flex flex-col items-center gap-2">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
            Remover produto
          </h3>
        </ModalHeader>

        <ModalBody className="text-center text-slate-600 dark:text-slate-300">
          Tem certeza que deseja remover {toDelete?.name} ?

        </ModalBody>

        <ModalFooter className="justify-center gap-3">
          <Button
            variant="light"
            className="min-w-[100px] rounded-2xl text-amber-400 dark:text-amber-400"
            onPress={cancelDelete}
            disabled={deleteMut.isPending}
            aria-label="Cancelar remoção"
          >
            Cancelar
          </Button>
          <Button
            className="min-w-[100px] rounded-2xl text-danger-600 dark:text-danger-400"
            isLoading={deleteMut.isPending}
            onPress={onConfirm}
            disabled={!toDelete || deleteMut.isPending}
            aria-label="Confirmar remoção"
          >
            Remover
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
