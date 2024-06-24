"use client";
import React from "react";
import Sidebar from "@/components/Sidebar";

const LeftSidebar = () => {
  return (
    <section
      className={
        "sticky left-0 top-0 gap-8 ml-8 flex flex-col justify-between items-center pt-20 text-white-1 h-fit w-full"
      }
    >
      <Sidebar />
    </section>
  );
};

export default LeftSidebar;
