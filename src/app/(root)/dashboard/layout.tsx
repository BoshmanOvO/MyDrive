"use client";
import React from "react";
import LeftSidebar from "@/components/LeftSidebar";
import Header from "@/components/Header";
import RightSidebar from "@/components/RightSidebar";
import { Toaster } from "@/components/ui/toaster";

export default function DashBoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={"flex flex-col"}>
      <main className={"flex bg-black-3"}>
        <LeftSidebar />
        <section className="flex min-h-screen flex-col px-3 sm:px-14">
          <div className="mx-auto flex w-full max-w-5xl flex-col max-sm:px-4">
            <div className="flex flex-col md:pb-14">
              <Toaster />
              {children}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
