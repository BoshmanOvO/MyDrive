"use client";
import React from "react";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";

export default function Home() {
  return (
    <main className="container mx-auto pt-12">
      <div className={"flex"}>
        <div className={'w-40'}>
          <LeftSidebar/>
        </div>
        <div className={'w-full ml-4'}>
            <RightSidebar/>
        </div>
      </div>
    </main>
  );
}
