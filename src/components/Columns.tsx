"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { formatRelative } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import FileCardsAction from "@/components/FileCardAction";
import Image from "next/image";
import { fileTypes } from "@/lib/fileTypes";

function UserProfile({ userId }: { userId: Id<"users"> }) {
  const userProfile = useQuery(api.users.getUserProfile, { userId });
  return (
    <div className={"flex mt-3 gap-2 text-xs text-gray-500 items-center w-40"}>
      <Avatar className={"size-6"}>
        <AvatarImage src={userProfile?.imageUrl} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      {userProfile?.name}
    </div>
  );
}

export const columns: ColumnDef<Doc<"files">>[] = [
  {
    header: "Name",
    cell: ({ row }) => {
      const file = row.original;
      return (
          <div className={'font-bold'}>
            {file.name}
          </div>
      )
    },
  },
  {
    accessorKey: "fileType",
    cell: ({ row }) => {
      const file = row.original;
      return (
        <div className={'flex gap-2 items-center'}>
          {fileTypes[file.fileType]} {file.fileType}
        </div>
      );
    },
  },
  {
    header: "Created By",
    cell: ({ row }) => {
      return <UserProfile userId={row.original.userId} />;
    },
  },
  {
    header: "Created On",
    cell: ({ row }) => {
      return (
        <div>{formatRelative(row.original._creationTime, new Date())}</div>
      );
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      return <FileCardsAction file={row.original} isFavorite={false} />;
      // TODO :  favourite not working yet of the grid
    },
  },
];
