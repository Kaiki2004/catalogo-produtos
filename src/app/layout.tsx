import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Products CRUD",
  description: "Catálogo de Produtos (mock API)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="light">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
