# 📦 Catálogo de Produtos (CRUD)

Aplicação de exemplo em **Next.js (App Router)** com **TypeScript**, **Tailwind CSS**, **TanStack Query** e **HeroUI**.  
Implementa um **CRUD completo** (listar, criar, editar e remover) com **mock de dados em memória** e **Zustand** para gerenciamento de estado de UI (filtros e modais).

---

## 🔧 Requisitos

- Node.js ≥ 18  
- pnpm ≥ 8 (recomendado)  
- Next.js 14+  

---

## 🚀 Instalação e execução

### 1) Instale as dependências
```bash
pnpm i
```

### 2) Rode o servidor de desenvolvimento
 ```
pnpm dev
```
### 3) Acesse a rota
```
http://localhost:3000/products
```

# 🧭 Rota principal

/products → Lista de produtos com:

- 🔍 Filtro por nome e status

- ➕ Criar (modal)

- ✏️ Editar (modal)

- ❌ Remover (confirmação)

- 📊 Estados: loading (skeleton), erro (retry), vazio


# 🏗️ Arquitetura (resumo)
```
app/
  layout.tsx              # layout principal
  providers.tsx           # providers globais
  products/
    page.tsx              # página principal
    components/
      Filters.tsx
      ProductsTable.tsx
      ProductModal.tsx
      Delete.tsx
lib/
  products.ts             # mock do "banco" em memória
types/
  product.ts              # tipo Product
store/
  useProductsUi.ts        # Zustand: filtros e modais
```

## 📌 Modelo
```
export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
};
```

## Estado (Zustand)

useProductsUi.ts armazena:

- 🔎 Filtros (search, status) → persistidos em localStorage

- 📋 Modal de produto → abrir/fechar, form, item em edição

- 🗑️ Modal de delete → item a remover