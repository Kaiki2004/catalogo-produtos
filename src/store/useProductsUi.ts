"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/types/product";

export type StatusOpt = "" | "ACTIVE" | "INACTIVE";

type FormState = Omit<Product, "id" | "createdAt">;

type ProductsUiState = {

  search: string;
  status: StatusOpt;
  setSearch: (v: string) => void;
  setStatus: (s: StatusOpt) => void;


  isModalOpen: boolean;
  editing: Product | null;
  form: FormState;
  openCreate: () => void;
  openEdit: (p: Product) => void;

  setForm: (patch: Partial<FormState>) => void;
 
  updateField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  closeModal: () => void;


  toDelete: Product | null;
  askDelete: (p: Product) => void;
  cancelDelete: () => void;

  resetUi: () => void;
};

const emptyForm: FormState = {
  name: "",
  price: 0,
  stock: 0,
  status: "ACTIVE",
};

export const useProductsUi = create<ProductsUiState>()(
  persist(
    (set) => ({

      search: "",
      status: "" as StatusOpt,
      setSearch: (v) => set({ search: v }),
      setStatus: (s) => set({ status: s }),


      isModalOpen: false,
      editing: null,
      form: emptyForm,
      openCreate: () => set({ isModalOpen: true, editing: null, form: emptyForm }),
      openEdit: (p) =>
        set({
          isModalOpen: true,
          editing: p,
          form: { name: p.name, price: p.price, stock: p.stock, status: p.status },
        }),
      setForm: (patch) =>
        set((state) => ({ form: { ...state.form, ...patch } })),
      updateField: (key, value) =>
        set((state) => ({ form: { ...state.form, [key]: value } })),
      closeModal: () => set({ isModalOpen: false, editing: null, form: emptyForm }),


      toDelete: null,
      askDelete: (p) => set({ toDelete: p }),
      cancelDelete: () => set({ toDelete: null }),

      resetUi: () =>
        set({
          search: "",
          status: "",
          isModalOpen: false,
          editing: null,
          form: emptyForm,
          toDelete: null,
        }),
    }),
    {
      name: "products-ui",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ search: s.search, status: s.status }),
    }
  )
);
