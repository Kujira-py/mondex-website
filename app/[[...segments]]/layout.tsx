import type { Metadata } from "next";
import { SITE_URL, assetPath } from "@/components/marketing/seo";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "MonDex | Pokémon TCG",
  icons: {
    icon: assetPath("/favicon.svg"),
    shortcut: assetPath("/favicon.svg"),
  },
};

export default async function RootLayout({
  children, params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ segments?: string[] }>;
}>) {
  const locale = (await params).segments?.[0] === "en" ? "en" : "de";
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
