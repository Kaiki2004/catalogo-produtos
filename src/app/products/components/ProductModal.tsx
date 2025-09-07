"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
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
    if (editing) {
      await updateMut.mutateAsync({ id: editing.id, patch: form });
    } else {
      await createMut.mutateAsync(form);
    }
    closeModal();
  };

  const nameInvalid = form.name.trim().length === 0;


  return (
    <Modal className="w-auto p-5 rounded-2xl shadow-2xl"
      isOpen={isModalOpen}
      onOpenChange={(open) => {
        if (!open) closeModal();
      }}>

      <ModalContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <ModalHeader className="flex flex-col gap-1 text-center">
            <span>
              {editing ? "Editar produto" : "Novo produto"}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Preencha os campos abaixo.
            </span>
          </ModalHeader>

          <ModalBody>
            <div className=" m-2 ">
              <Input
                label="Nome"
                placeholder="Digite o nome..."
                value={form.name}
                onValueChange={(v) => setForm({ name: v })}
                isRequired
                isInvalid={nameInvalid}
                autoFocus
                className="m-2"
              />

              <Input
                type="number"
                label="Preço"
                labelPlacement="inside"
                value={Number.isFinite(form.price) ? String(form.price) : ""}
                onValueChange={(v) => setForm({ price: Number(v || 0) })}
                min={0}
                step="0.01"
                className="m-2"
              />

              <Input
                type="number"
                label="Estoque"
                labelPlacement="inside"
                value={Number.isFinite(form.stock) ? String(form.stock) : ""}
                onValueChange={(v) => setForm({ stock: Number(v || 0) })}
                min={0}
                step="1"
                className="m-2"
              />

              <div className="m-2 text-left w-[40%]">
                <Select
                  label="Status"
                  selectedKeys={[form.status]}
                  className="bg-white">
                  <SelectItem key="ACTIVE" >ACTIVE</SelectItem>
                  <SelectItem key="INACTIVE" >INACTIVE</SelectItem>
                </Select>
              </div>
            </div>
          </ModalBody>

          <ModalFooter className="gap-2 justify-center">
            <Button
              variant="light"
              onPress={closeModal}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              color="primary"
              type="submit"
              isLoading={isSaving}
            >
              {editing ? "Salvar" : "Criar"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
