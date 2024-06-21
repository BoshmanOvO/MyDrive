import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/providers/ConvexClientProvider";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster"
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "File Keeper",
  description: "Generated your podcasts using AI",
  icons: {
    icon: "public/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>
          <Header />
          {children}
          <Toaster />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
