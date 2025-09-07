"use client";

import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, Input, Select, SelectItem,
} from "@heroui/react";
import { useProductsUi } from "@/store/useProductsUi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProductApi, updateProductApi } from "@/lib/api";
import type { Product } from "@/types/product";

type CreateProductInput = Omit<Product, "id" | "createdAt">;
type UpdateProductInput = Partial<Omit<Product, "id" | "createdAt">>;

export default function ProductModal() {
  const { isModalOpen, closeModal, editing, form, setForm } = useProductsUi();
  const qc = useQueryClient();

  const createMut = useMutation({
    mutationFn: (data: CreateProductInput) => createProductApi(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: UpdateProductInput }) =>
      updateProductApi(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });

  const isSaving = createMut.isPending || updateMut.isPending;

  const onSubmit = async () => {
    if (editing) await updateMut.mutateAsync({ id: editing.id, patch: form });
    else await createMut.mutateAsync(form);
    closeModal();
  };

  const nameInvalid = form.name.trim().length === 0;

  return (
    <Modal
      isOpen={isModalOpen}
      onOpenChange={(open) => { if (!open) closeModal(); }}
      placement="center"
      backdrop="opaque"     
      size="full"           
      hideCloseButton       
      classNames={{
        base: "w-full h-[100dvh] rounded-none", 
        body: "flex-1 overflow-auto py-5",
      }}
    >
      <ModalContent>
        <form
          onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
          className="w-full"
        >
          <ModalHeader className="flex flex-col gap-1 text-center">
            <span className="text-base font-semibold">
              {editing ? "Editar produto" : "Novo produto"}
            </span>
            <span className="text-[13px] text-slate-500 dark:text-slate-400">
              Preencha os campos abaixo.
            </span>
          </ModalHeader>

          <ModalBody>
            <div className="grid grid-cols-1 gap-3">
              <Input
                label="Nome"
                placeholder="Digite o nome..."
                value={form.name}
                onValueChange={(v) => setForm({ name: v })}
                isRequired
                isInvalid={nameInvalid}
                variant="bordered"
                size="md"
                classNames={{ inputWrapper: "h-11 rounded-xl" }}
                autoFocus
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  type="number"
                  label="Preço"
                  value={Number.isFinite(form.price) ? String(form.price) : ""}
                  onValueChange={(v) => setForm({ price: Number(v || 0) })}
                  min={0}
                  step="0.01"
                  variant="bordered"
                  size="md"
                  classNames={{ inputWrapper: "h-11 rounded-xl" }}
                />
                <Input
                  type="number"
                  label="Estoque"
                  value={Number.isFinite(form.stock) ? String(form.stock) : ""}
                  onValueChange={(v) => setForm({ stock: Number(v || 0) })}
                  min={0}
                  step="1"
                  variant="bordered"
                  size="md"
                  classNames={{ inputWrapper: "h-11 rounded-xl" }}
                />
              </div>

              <Select
                label="Status"
                selectedKeys={new Set([form.status])}
                onSelectionChange={(keys) => {
                  const val = (Array.from(keys)[0] ?? "ACTIVE") as "ACTIVE" | "INACTIVE";
                  setForm({ status: val });
                }}
                variant="bordered"
                size="md"
                classNames={{ trigger: "h-11 rounded-xl px-3 text-left" }}
              >
                <SelectItem key="ACTIVE">ACTIVE</SelectItem>
                <SelectItem key="INACTIVE">INACTIVE</SelectItem>
              </Select>
            </div>
          </ModalBody>

          <ModalFooter className="gap-2 justify-center">
            <Button
              variant="light"
              onPress={closeModal}
              disabled={isSaving}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              color="primary"
              type="submit"
              isLoading={isSaving}
              className="rounded-xl"
            >
              {editing ? "Salvar" : "Criar"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
