import type { Metadata, Viewport } from "next";
import { LXGW_WenKai_TC, Nunito_Sans } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n";
import "./globals.css";

const bodyFont = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-body",
  display: "swap"
});

const handFont = LXGW_WenKai_TC({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-hand",
  display: "swap",
  preload: false
});

export const metadata: Metadata = {
  title: "小羊学中文 | Xiao Yang Learns Chinese",
  description: "Pixel-style tiny Chinese lessons for Xiao Yang."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F1F8EA"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${handFont.variable}`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
