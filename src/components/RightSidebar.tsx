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
        }
      : "skip",
  );
  const isLoading = files == undefined;
  return (
    <div className={"w-full ml-4"}>
      <div className={"flex justify-between items-center -mt-10"}>
        <h1 className={"text-4xl font-bold w-[180px]"}>{title}</h1>
        <SearchBar query={query} setQuery={setQuery} />
        <UploadFilePopUpOrg />
      </div>
      <Tabs defaultValue="grid" className={"mt-8"}>
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
        {isLoading && (
          <div className={"flex flex-col w-full items-center mt-36 mb-5"}>
            <Loader2 className={"h-32 w-32 animate-spin text-gray-400"} />
            <h1 className={"text-2xl"}>Loading your files...</h1>
          </div>
        )}
        <TabsContent value="grid" className={"mt-5"}>
          <div className={"grid grid-cols-3 gap-7"}>
            {files?.map((file) => (
              <FileCards
                favourites={getAllFavourites ?? []}
                key={file._id}
                file={file}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="table" className={"mt-5"}>
          <FileTable columns={columns} data={files ?? []} />
        </TabsContent>
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
          ) : (
            <>
              {deleted ? (
                <div
                  className={"flex flex-col w-full items-center lg:mt-16 mb-5"}
                >
                  <Image
                    alt={"Empty file trash image"}
                    src={"/trash.svg"}
                    height={300}
                    width={300}
                  />
                  <h1 className={"text-center text-lg text-gray-500 mt-5"}>
                    {" "}
                    No deleted files{" "}
                  </h1>
                </div>
              ) : (
                <div
                  className={"flex flex-col w-full items-center lg:mt-16 mb-5"}
                >
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
        </>
      )}
    </div>
  );
};

export default RightSidebar;
