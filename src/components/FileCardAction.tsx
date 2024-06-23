import { Doc } from "../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EllipsisVertical,
  FileIcon,
  StarIcon,
  StarOff,
  TrashIcon,
  UndoIcon,
} from "lucide-react";
import { Protect } from "@clerk/nextjs";

export function FileCardsAction({
  file,
  isFavorite,
}: {
  file: Doc<"files">;
  isFavorite: boolean | undefined;
}) {
  const getUrl = useQuery(api.file.getUrl, { fileId: file.fileId });
  let Url = getUrl ? getUrl.toString() : "";
  const { toast } = useToast();
  const deleteFile = useMutation(api.file.deleteFile);
  const restoreFile = useMutation(api.file.restoreFile);
  const toggleFavourite = useMutation(api.file.toggleFavourite);
  const me = useQuery(api.users.getMe);
  const [isConformPage, setIsConformPage] = useState(false);

  return (
    <>
      <AlertDialog open={isConformPage} onOpenChange={setIsConformPage}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete your file, but you can still recover it
              from the trash within 15 days.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteFile({ fileId: file._id });
                setIsConformPage(false);
                toast({
                  title: "File deleted Successfully",
                  variant: "default",
                  description:
                    "This file is moved to trash and will be deleted permanently after 15 days from today.",
                });
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className={"flex gap-1 items-center cursor-pointer"}
            onClick={() => {
              window.open(Url);
            }}
          >
            <FileIcon className={"size-4"} /> Download
          </DropdownMenuItem>

          <DropdownMenuItem
            className={"flex gap-1 items-center cursor-pointer"}
            onClick={async () => {
              await toggleFavourite({ fileId: file._id });
            }}
          >
            {isFavorite ? (
              <div className={"flex gap-1 items-center"}>
                <StarOff className={"size-4"} /> Unfavourite
              </div>
            ) : (
              <div className={"flex gap-1 items-center"}>
                <StarIcon className={"size-4"} /> Favourite
              </div>
            )}
          </DropdownMenuItem>
          <Protect
            condition={(check) => {
              return (
                check({
                  role: "org:admin",
                }) || file.userId === me?._id
              );
            }}
          >
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={"flex gap-1 text-red-600 items-center cursor-pointer"}
              onClick={async () => {
                if (file.markDeleted) {
                  await restoreFile({ fileId: file._id });
                  toast({
                    title: "File Restored Successfully",
                    variant: "default",
                    description:
                      "This file is restored and is available in Your Files.",
                  });
                } else {
                  setIsConformPage(true);
                }
              }}
            >
              {file.markDeleted ? (
                <div className={"text-green-500 flex item-center gap-1"}>
                  <UndoIcon className={"size-4"} /> Restore
                </div>
              ) : (
                <div className={"flex item-center gap-1"}>
                  <TrashIcon className={"size-4"} /> Delete
                </div>
              )}
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default FileCardsAction;
