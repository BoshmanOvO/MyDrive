import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/providers/ConvexClientProvider";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import React from "react";
import LeftSidebar from "@/components/LeftSidebar";

const manRope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "File Keeper",
  description: "Keep your files safe and secure.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClientProvider>
      <html lang="en">
        <body className={manRope.className}>
          <div className={'sticky top-0 right-0 z-10 bg-gray-100 w-full'}>
            <Header />
          </div>
          {children}
        </body>
      </html>
    </ConvexClientProvider>
  );
}
