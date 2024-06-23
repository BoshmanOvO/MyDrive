"use client";
import React from "react";
import Sidebar from "@/components/Sidebar";

const LeftSidebar = () => {
  return (
    <section className={"flex gap-8 z-10"}>
      <Sidebar/>
    </section>
  );
};

export default LeftSidebar;
