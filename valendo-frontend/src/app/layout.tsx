import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/auth-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Valendo — Duelos de Conhecimento",
    template: "%s | Valendo",
  },
  description: "Plataforma de duelos de conhecimento em tempo real. Desafie amigos, responda perguntas geradas por IA e suba no ranking!",
  keywords: ["quiz", "duelo", "conhecimento", "tempo real", "multiplayer", "perguntas"],
  authors: [{ name: "Valendo" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Valendo",
    title: "Valendo — Duelos de Conhecimento",
    description: "Desafie amigos em duelos de conhecimento em tempo real!",
  },
  twitter: {
    card: "summary_large_image",
    title: "Valendo — Duelos de Conhecimento",
    description: "Desafie amigos em duelos de conhecimento em tempo real!",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#06060c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              className: "!bg-card !border-border/50 !text-foreground",
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
