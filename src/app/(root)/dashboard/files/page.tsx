"use client";
import React from "react";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";

export default function Home() {
  return (
    <main className="container mx-auto pt-12">
      <div className={"flex"}>
        <RightSidebar title={'Your File'}/>
      </div>
    </main>
  );
}
