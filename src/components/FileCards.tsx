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
} from "@/components/ui/alert-dialog";

import { Doc } from "../../convex/_generated/dataModel";
import {
  EllipsisVertical,
  FileIcon,
  FileImage,
  FileText,
  FileVideo2,
  FolderArchive,
  GanttChartIcon,
  ImageIcon,
  StarIcon,
  StarOff,
  TrashIcon,
  UndoIcon,
  Video,
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { Protect } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, formatDistance, formatRelative, subDays } from "date-fns";

function FileCardsAction({
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
                    "This file is deleted from this organisation and will be deleted permanently after 15 days from today.",
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
          <Protect role="org:admin">
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={"flex gap-1 text-red-600 items-center cursor-pointer"}
              onClick={async () => {
                if (file.markDeleted) {
                  await restoreFile({ fileId: file._id });
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

const FileCards = ({
  file,
  favourites,
}: {
  file: Doc<"files">;
  favourites: Doc<"favourite">[];
}) => {
  const fileTypes = {
    jpeg: <ImageIcon />,
    png: <ImageIcon />,
    pdf: <FileText />,
    zip: <FolderArchive />,
    csv: <GanttChartIcon />,
    video: <Video />,
    svg: <ImageIcon />,
  } as unknown as Record<Doc<"files">["fileType"], ReactNode>;

  const isFavourites = favourites.some(
    (favourite) => favourite.fileId === file._id,
  );
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  });
  const getUrl = useQuery(api.file.getUrl, { fileId: file.fileId });
  let Url = getUrl ? getUrl.toString() : "";
  return (
    <Card className={"hover:bg-slate-100 w-[300px]"}>
      <CardHeader className={"relative"}>
        <CardTitle className={"flex gap-2 text-base font-normal"}>
          <p className={"flex justify-center]"}>{fileTypes[file.fileType]}</p>
          <h1 className={'flex overflow-hidden'}>{file.name}</h1>
        </CardTitle>
        <span className={"absolute top-2 right-2"}>
          <FileCardsAction isFavorite={isFavourites} file={file} />
        </span>
      </CardHeader>
      <CardContent
        className={
          "h-[200px] overflow-hidden rounded-2xl flex justify-center items-center"
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

      <CardFooter className={"flex justify-between"}>
        <div className={"flex mt-3 gap-2 text-xs text-gray-500 items-center w-40"}>
          <Avatar className={"size-6"}>
            <AvatarImage src={userProfile?.imageUrl} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {userProfile?.name}
        </div>
        <h1 className={"text-xs text-gray-400 flex items-center mt-3"}>
          Uploaded On : {formatRelative(file._creationTime, new Date())}
        </h1>
      </CardFooter>
    </Card>
  );
};

export default FileCards;
