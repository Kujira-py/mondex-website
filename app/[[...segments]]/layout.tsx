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

const THEME_SCRIPT = `try{if(localStorage.getItem("mondex-theme")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;

export default async function RootLayout({
  children, params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ segments?: string[] }>;
}>) {
  const locale = (await params).segments?.[0] === "de" ? "de" : "en";
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Runs before paint so a saved dark preference never flashes light. Light is the default. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
