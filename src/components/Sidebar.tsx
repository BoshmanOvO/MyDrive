import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileIcon, StarIcon, Trash2Icon } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div className={"w-40 flex flex-col gap-5"}>
      <Link
        href={"/dashboard/files"}
        className={"hover:bg-slate-100 rounded-2xl"}
      >
        <Button
          variant={"link"}
          className={cn("flex gap-2", {
            "text-blue-600 bg-slate-100 rounded-2xl w-full":
              pathname === "/dashboard/files",
          })}
        >
          <FileIcon />
          <h1 className={"font-bold text-base"}>All file</h1>
        </Button>
      </Link>
      <Link
        href={"/dashboard/favourite"}
        className={"hover:bg-slate-100 rounded-2xl"}
      >
        <Button
          variant={"link"}
          className={cn("flex gap-2", {
            "text-blue-600 bg-slate-100 rounded-2xl w-full":
              pathname === "/dashboard/favourite",
          })}
        >
          <StarIcon />
          <h1 className={"font-bold text-base"}>Favourite</h1>
        </Button>
      </Link>
      <Link
        href={"/dashboard/trash"}
        className={"hover:bg-slate-100 rounded-2xl"}
      >
        <Button
          variant={"link"}
          className={cn("flex gap-2", {
            "text-blue-600 bg-slate-100 rounded-2xl w-full":
              pathname === "/dashboard/trash",
          })}
        >
          <Trash2Icon />
          <h1 className={"font-bold text-base"}>Trash</h1>
        </Button>
      </Link>
    </div>
  );
};

export default Sidebar;
