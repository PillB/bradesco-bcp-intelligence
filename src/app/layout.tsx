import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bradesco × BCP — Strategic Intelligence Command Center",
  description: "Auditable strategic intelligence dossier: Banco Bradesco (Brasil) vs BCP Perú. 89 fuentes, 56 claims, 30 herramientas interactivas, 17 módulos. Análisis estratégico independiente.",
  keywords: ["Bradesco", "BCP", "Credicorp", "inteligencia estratégica", "banca", "IA", "GenAI", "Bridge", "BIA", "Clara", "Yape", "Inovabra", "comparación bancaria"],
  authors: [{ name: "Strategic Intelligence Command Center" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Bradesco × BCP Strategic Intelligence",
    description: "Auditable strategic intelligence dossier: Banco Bradesco vs BCP Perú",
    url: "https://pillb.github.io/bradesco-bcp-intelligence/",
    siteName: "Bradesco × BCP Intelligence",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bradesco × BCP Strategic Intelligence",
    description: "AI-powered development with modern React stack",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
