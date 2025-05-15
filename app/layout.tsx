import type React from "react";
import type { Metadata } from "next";
import { Urbanist as FontSans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/components/providers";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

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
    <html lang="en">
      <body className={`${fontSans.className}`}>
        <Providers>
          <main>{children}</main>
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
