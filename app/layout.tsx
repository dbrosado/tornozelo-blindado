import type { Metadata } from "next";
import { Chakra_Petch, Inter } from "next/font/google";
import "./globals.css";

const chakraPetch = Chakra_Petch({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-chakra-petch",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tornozelo Blindado",
  description: "Protocolo de reabilitação e fortalecimento de tornozelo.",
  manifest: "/manifest.json",
  themeColor: "#09090b",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${chakraPetch.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-carbon text-text-main min-h-screen selection:bg-primary selection:text-carbon" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
