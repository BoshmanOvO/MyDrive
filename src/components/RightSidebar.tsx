"use client";
import React, { useState } from "react";
import { Grid3x3Icon, Loader2, Table2 } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import UploadFilePopUpOrg from "@/components/UploadFilePopUpOrg";
import Image from "next/image";
import FileCards from "@/components/FileCards";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import FileTable from "@/components/FileTable";
import { columns } from "@/components/Columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Doc } from "../../convex/_generated/dataModel";
import { Label } from "@/components/ui/label";

const RightSidebar = ({
  title,
  favouritesOnly,
  deleted,
}: {
  title: string;
  favouritesOnly?: boolean;
  deleted?: boolean;
}) => {
  const user = useUser();
  const organization = useOrganization();
  let orgId: string | undefined = undefined;
  if (user.isLoaded && organization.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  const [query, setQuery] = useState("");
  const [fileType, setFileType] = useState<Doc<"files">["fileType"] | "All">(
    "All",
  );

  const getAllFavourites = useQuery(
    api.file.getAllFavourites,
    orgId ? { orgId: orgId } : "skip",
  );

  const files = useQuery(
    api.file.getFiles,
    orgId
      ? {
          orgId: orgId,
          query: query,
          favourite: favouritesOnly,
          deleted: deleted,
          type: fileType === "All" ? undefined : fileType,
        }
      : "skip",
  );

  const modifiedFiles = files?.map((file) => ({
    ...file,
    isFav: (getAllFavourites ?? []).some(
      (favourite) => favourite.fileId === file._id,
    ),
  }));

  const isLoading = files == undefined;
  return (
    <section className={"w-full ml-4 mb-5"}>
      <div className={"flex justify-between items-center -mt-16"}>
        <h1 className={"text-4xl font-bold w-[180px]"}>{title}</h1>
        <SearchBar query={query} setQuery={setQuery} />
        <UploadFilePopUpOrg />
      </div>
      <Tabs defaultValue="grid" className={"mt-8 scroll-m-2"}>
        <div className={"flex justify-between items-center"}>
          <TabsList>
            <TabsTrigger value="grid" className={"flex gap-2 items-center"}>
              <Grid3x3Icon />
              Grid View
            </TabsTrigger>
            <TabsTrigger value="table" className={"flex gap-2 items-center"}>
              <Table2 />
              Table View
            </TabsTrigger>
          </TabsList>
          <div className={"flex gap-2 items-center"}>
            <Label htmlFor={"type-select"}>Type Filter</Label>
            <Select
              value={fileType}
              onValueChange={(newType) => {
                setFileType(newType as Doc<"files">["fileType"] | "All");
              }}
            >
              <SelectTrigger
                id={"type-select"}
                className="w-[180px]"
                defaultValue={"All Files"}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Files</SelectItem>
                <SelectItem value="jpeg">Jpeg</SelectItem>
                <SelectItem value="csv">Csv</SelectItem>
                <SelectItem value="png">Png</SelectItem>
                <SelectItem value="pdf">Pdf</SelectItem>
                <SelectItem value="zip">Zip</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="svg">Svg</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {isLoading ? (
          <div className={"flex flex-col w-full items-center mt-36 mb-5"}>
            <Loader2 className={"h-28 w-28 animate-spin text-gray-400"} />
            <h1 className={"text-2xl"}>Loading your files...</h1>
          </div>
        ) : (
          <>
            <TabsContent value="grid" className={"mt-5"}>
              <div className={"grid grid-cols-3 gap-6"}>
                {modifiedFiles?.map((file) => (
                  <FileCards key={file._id} file={file} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="table" className={"mt-5"}>
              <FileTable columns={columns} data={modifiedFiles ?? []} />
            </TabsContent>
          </>
        )}
      </Tabs>

      {files?.length == 0 && (
        <>
          {favouritesOnly ? (
            <div className={"flex flex-col w-full items-center lg:mt-16 mb-5"}>
              <Image
                alt={"Empty file favourite image"}
                src={"/favourite.svg"}
                height={300}
                width={300}
              />
              <h1 className={"text-center text-lg text-gray-500 mt-5"}>
                No favourite files
              </h1>
            </div>
          ) : deleted ? (
            <div className={"flex flex-col w-full items-center lg:mt-16 mb-5"}>
              <Image
                alt={"Empty file trash image"}
                src={"/trash.svg"}
                height={300}
                width={300}
              />
              <h1 className={"text-center text-lg text-gray-500 mt-5"}>
                No deleted files
              </h1>
            </div>
          ) : query !== "" ? (
            <div className={"flex flex-col w-full items-center lg:mt-16 mb-5"}>
              <Image
                alt={"Empty file upload image"}
                src={"/nodata.svg"}
                height={200}
                width={200}
              />
              <h1 className={"text-center text-lg text-gray-500 mt-5"}>
                No files found
              </h1>
            </div>
          ) : (
            <div className={"flex flex-col w-full items-center lg:mt-16 mb-5"}>
              <Image
                alt={"Empty file upload image"}
                src={"/upload.svg"}
                height={300}
                width={300}
              />
              <h1 className={"text-center text-lg text-gray-500 mt-5"}>
                No files uploaded yet.
              </h1>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default RightSidebar;
