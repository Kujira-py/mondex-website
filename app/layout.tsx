import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MonDex — Your collection, closer.",
  description: "A premium Pokémon collection prototype. Explore your Dex, scan demo cards, and curate your collection.",
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
    <html lang="en">
      <body className="antialiased dark">{children}</body>
    </html>
  );
}
