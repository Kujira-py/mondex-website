import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MonDex — Deine Karten. Dein MonDex.",
  description: "Entdecke deinen persönlichen Pokédex, gestalte digitale Binder und behalte deine Sammlung im Blick. Erlebe die interaktiven MonDex-Produktdemos.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
