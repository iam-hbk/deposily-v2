import type React from "react";
import type { Metadata } from "next";
import { Urbanist as FontSans, Bebas_Neue } from "next/font/google"
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontBebas = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  weight: ["400"],
})
export const metadata: Metadata = {
  title: "deposily",
  description: "Upload and analyze your bank statements",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.className}`}>{children}</body>
    </html>
  );
}
