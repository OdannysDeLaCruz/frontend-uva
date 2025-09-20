import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalHeader from "@/app/core/components/conditional-header"
import ConditionalFooter from "@/app/core/components/conditional-footer"
import { ThemeProvider } from "@/app/core/components/theme-provider"
import { AuthProvider } from "@/app/core/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "UVA",
  description: "Unidad de Valor de Ahorro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ConditionalHeader />
            <main>{children}</main>
            <ConditionalFooter />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
