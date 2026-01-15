import type { Metadata } from "next";
import { Pacifico, Roboto } from "next/font/google";
import "./globals.css";
import ConditionalHeader from "@/app/core/components/conditional-header"
// import ConditionalFooter from "@/app/core/components/conditional-footer"
import { ThemeProvider } from "@/app/core/components/theme-provider"
import { AuthProvider } from "@/app/core/contexts/auth-context"
// import { WompiProvider } from "@/app/core/components/WompiProvider"

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto"
})
const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico"
})

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
      <body className={`${roboto.className} ${pacifico.variable}`}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* <WompiProvider> */}
            <AuthProvider>
              <ConditionalHeader />
              <main>{children}</main>
              {/* <ConditionalFooter /> */}
            </AuthProvider>
          {/* </WompiProvider> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
