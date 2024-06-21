"use client"
import React from "react";
import LeftSidebar from "@/components/LeftSidebar";

export default function DashBoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <main className="container mx-auto pt-12">
          <div className={"flex"}>
              <LeftSidebar/>
              {children}
          </div>
      </main>
  );
}
