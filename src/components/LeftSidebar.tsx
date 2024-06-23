import React from "react";
import Sidebar from "@/components/Sidebar";

const LeftSidebar = () => {
  return (
    <section className={"relative flex gap-8 h-[calc(100vh-120px)]"}>
      <Sidebar/>
    </section>
  );
};

export default LeftSidebar;
