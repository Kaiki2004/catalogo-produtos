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
import { useMemo } from "react";
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

  const isValid = useMemo(() => {
    const nameOk = form.name.trim().length > 0;
    const priceOk = Number.isFinite(form.price) && form.price >= 0;
    const stockOk = Number.isFinite(form.stock) && form.stock >= 0;
    const statusOk = form.status === "ACTIVE" || form.status === "INACTIVE";
    return nameOk && priceOk && stockOk && statusOk;
  }, [form]);

  const onSubmit = async () => {
    if (!isValid || isSaving) return;
    if (editing) {
      await updateMut.mutateAsync({ id: editing.id, patch: form });
    } else {
      await createMut.mutateAsync(form);
    }
    closeModal(); 
  };

  const nameInvalid = form.name.trim().length === 0;
  const priceInvalid = !Number.isFinite(form.price) || form.price < 0;
  const stockInvalid = !Number.isFinite(form.stock) || form.stock < 0;

  return (
    <Modal
      isOpen={isModalOpen}
      onOpenChange={(open) => {
        if (!open) closeModal();
      }}
      placement="center"
      backdrop="blur"
      size="md"
      isDismissable={!isSaving}
      isKeyboardDismissDisabled={isSaving}
      classNames={{
        base: "rounded-2xl border border-slate-400 dark:border-slate-800",
        header: "border-b border-slate-200/60 dark:border-slate-800/60",
        body: "py-5",
        footer: "border-t border-slate-200/60 dark:border-slate-800/60",
      }}
    >
      <ModalContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <ModalHeader className="flex flex-col gap-1 text-center">
            <span className="text-base font-semibold tracking-tight">
              {editing ? "Editar produto" : "Novo produto"}
            </span>
            <span className="text-[13px] text-slate-500 dark:text-slate-400">
              Preencha os campos abaixo.
            </span>
          </ModalHeader>

          <ModalBody>
            <div className="max-w-md mx-auto grid grid-cols-1 gap-3">
              <Input
                label="Nome"
                placeholder="Digite o nome..."
                value={form.name}
                onValueChange={(v) => setForm({ name: v })}
                isRequired
                isInvalid={nameInvalid}
                variant="bordered"
                size="md"
                classNames={{
                  inputWrapper: "h-11 rounded-xl !transition-shadow focus-within:shadow-sm",
                  input: "text-left",
                  label: "text-slate-500 dark:text-slate-400 w-full text-left",
                }}
                autoFocus
              />

              <Input
                type="number"
                label="Preço"
                labelPlacement="inside"
                value={Number.isFinite(form.price) ? String(form.price) : ""}
                onValueChange={(v) => setForm({ price: Number(v || 0) })}
                min={0}
                step="0.01"
                isInvalid={priceInvalid}
                errorMessage={priceInvalid && "Preço deve ser ≥ 0."}
                variant="bordered"
                size="md"
                classNames={{
                  inputWrapper: "h-11 rounded-xl !transition-shadow focus-within:shadow-sm",
                  input: "text-left",
                  label: "text-slate-500 dark:text-slate-400 w-full text-left",
                }}
              />

              <Input
                type="number"
                label="Estoque"
                labelPlacement="inside"
                value={Number.isFinite(form.stock) ? String(form.stock) : ""}
                onValueChange={(v) => setForm({ stock: Number(v || 0) })}
                min={0}
                step="1"
                isInvalid={stockInvalid}
                variant="bordered"
                size="md"
                classNames={{
                  inputWrapper: "h-11 rounded-xl !transition-shadow focus-within:shadow-sm",
                  input: "text-left",
                  label: "text-slate-500 dark:text-slate-400 w-full text-left",
                }}
              />

              <Select
                label="Status"
                selectedKeys={[form.status]}
                onSelectionChange={(keys) => {
                  const val = (Array.from(keys)[0] ?? "ACTIVE") as "ACTIVE" | "INACTIVE";
                  setForm({ status: val });
                }}
                variant="bordered"
                size="md"
                classNames={{
                  trigger: "h-11 rounded-xl px-3 !transition-shadow focus-within:shadow-sm",
                  value: "text-left w-full",
                  popoverContent:
                    "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl",
                }}
                renderValue={(items) =>
                  items.map((i) => (
                    <div key={i.key} className="w-full text-left text-sm font-medium tracking-tight">
                      {i.textValue}
                    </div>
                  ))
                }
              >
                <SelectItem key="ACTIVE" className="text-left">
                  ACTIVE
                </SelectItem>
                <SelectItem key="INACTIVE" className="text-left">
                  INACTIVE
                </SelectItem>
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
              isDisabled={!isValid || isSaving}
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
