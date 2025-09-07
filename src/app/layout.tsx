
import "./globals.css"; 

import Providers from "./providers";

export const metadata = { title: "Produtos" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-dvh bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
