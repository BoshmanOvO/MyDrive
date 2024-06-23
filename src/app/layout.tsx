import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/providers/ConvexClientProvider";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import React from "react";

const manRope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "File Keeper",
  description: "Generated your podcasts using AI",
  icons: {
    icon: "/public/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={manRope.className}>
        <ConvexClientProvider>
          <Header />
          {children}
          <Toaster />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
