import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc } from "../../convex/_generated/dataModel";
import {
  FileImage,
  FileText,
  FileVideo2,
  FolderArchive,
  GanttChartIcon,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelative } from "date-fns";
import FileCardsAction from "@/components/FileCardAction";
import { fileTypes } from "@/lib/fileTypes";

const FileCards = ({
  file,
}: {
  file: Doc<"files"> & { isFav ?: boolean }
}) => {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  });
  const getUrl = useQuery(api.file.getUrl, { fileId: file.fileId });
  let Url = getUrl ? getUrl.toString() : "";
  return (
    <Card className={"hover:bg-slate-100 w-[300px]"}>
      <CardHeader className={"relative"}>
        <CardTitle className={"flex gap-2 text-base font-bold"}>
          <p className={"flex justify-center]"}>{fileTypes[file.fileType]}</p>
          <h1 className={"flex overflow-hidden"}>{file.name}</h1>
        </CardTitle>
        <span className={"absolute top-2 right-2"}>
          <FileCardsAction isFavorite={file.isFav} file={file} />
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
        <div
          className={"flex mt-5 gap-2 text-xs text-gray-500 items-center w-40"}
        >
          <Avatar className={"size-6"}>
            <AvatarImage src={userProfile?.imageUrl} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {userProfile?.name}
        </div>
        <h1 className={"text-xs text-gray-400 flex items-center mt-5"}>
          Uploaded On : {formatRelative(file._creationTime, new Date())}
        </h1>
      </CardFooter>
    </Card>
  );
};

export default FileCards;
