import React, { ReactNode, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Doc, Id } from "../../convex/_generated/dataModel";
import {
  EllipsisVertical,
  FileImage,
  FileText,
  FileVideo2,
  FolderArchive,
  GanttChartIcon,
  ImageIcon,
  TrashIcon,
  Video,
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import Image from "next/image";

function FileCardsAction({ file }: { file: Doc<"files"> }) {
  const { toast } = useToast();
  const deleteFile = useMutation(api.file.deleteFile);
  const toggleFavourite = useMutation(api.file.toggleFavourite);
  const [isConformPage, setIsConformPage] = useState(false);
  
  return (
    <>
      <AlertDialog open={isConformPage} onOpenChange={setIsConformPage}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete your file, but you can still recover it
              from the trash.
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
                  description: "This file is deleted from this organisation.",
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
            onClick={async () => {
              await toggleFavourite({ fileId: file._id });
            }}
          >
            <TrashIcon className={"size-4"} /> Favourite
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={"flex gap-1 text-red-600 items-center cursor-pointer"}
            onClick={() => {
              setIsConformPage(true);
            }}
          >
            <TrashIcon className={"size-4"} /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

const FileCards = ({ file }: { file: Doc<"files"> }) => {
  const fileTypes = {
    jpeg: <ImageIcon />,
    png: <ImageIcon />,
    pdf: <FileText />,
    zip: <FolderArchive />,
    csv: <GanttChartIcon />,
    video: <Video />,
    svg: <ImageIcon />,
  } as unknown as Record<Doc<"files">["fileType"], ReactNode>;
  const getUrl = useQuery(api.file.getUrl, { fileId: file.fileId });
  let Url = getUrl ? getUrl.toString() : "";
  console.log(getUrl);
  console.log(file.fileId);
  return (
    <Card>
      <CardHeader className={"relative"}>
        <CardTitle className={"flex gap-2"}>
          <p className={"flex justify-center"}>{fileTypes[file.fileType]}</p>
          {file.name}
        </CardTitle>
        <span className={"absolute top-2 right-2"}>
          <FileCardsAction file={file} />
        </span>
      </CardHeader>
      <CardContent
        className={
          "h-[200px] overflow-hidden rounded-2xl mt-3 flex justify-center items-center"
        }
      >
        {(file.fileType === "png" || file.fileType === "jpeg") && (
          <Image alt={file.name} src={Url} width={200} height={200} />
        )}
        {file.fileType === "pdf" && <FileText className={"w-32 h-32"} />}
        {file.fileType === "zip" && <FolderArchive className={"w-32 h-32"} />}
        {file.fileType === "csv" && <GanttChartIcon className={"w-32 h-32"} />}
        {file.fileType === "video" && <FileVideo2 className={"w-32 h-32"} />}
        {file.fileType === "svg" && <FileImage className={"w-32 h-32"} />}
      </CardContent>
      <CardFooter className={"mt-3 flex justify-center items-center"}>
        <Button
          onClick={() => {
            window.open(Url);
          }}
        >
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileCards;
