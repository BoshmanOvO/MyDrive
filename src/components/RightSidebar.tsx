"use client";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import UploadFilePopUpOrg from "@/components/UploadFilePopUpOrg";
import Image from "next/image";
import FileCards from "@/components/FileCards";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";

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
      {isLoading && (
        <div className={"flex flex-col w-full items-center mt-36 mb-5"}>
          <Loader2 className={"h-32 w-32 animate-spin text-gray-400"} />
          <h1 className={"text-2xl"}>Loading your files...</h1>
        </div>
      )}
      {!isLoading && files.length >= 0 && (
        <>
          <div className={"flex justify-between items-center -mt-10"}>
            <h1 className={"text-4xl font-bold w-[180px]"}>{title}</h1>
            <SearchBar query={query} setQuery={setQuery} />
            <UploadFilePopUpOrg />
          </div>
          {isLoading && (
            <>
              <div
                className={"flex flex-col w-full items-center lg:mt-16 mb-5"}
              >
                <Image
                  alt={"Search"}
                  src={"/upload.svg"}
                  height={300}
                  width={300}
                />
              </div>
              <div className={"text-center text-lg text-gray-500"}>
                No files matched your search.
              </div>
            </>
          )}
          <div className={"grid grid-cols-3 gap-7 mt-10"}>
            {files?.map((file) => (
              <FileCards
                favourites={getAllFavourites ?? []}
                key={file._id}
                file={file}
              />
            ))}
          </div>
        </>
      )}
      {!isLoading && files.length == 0 && !query && (
        <>
          <div className={"flex flex-col w-full items-center lg:mt-16 mb-5"}>
            <Image
              alt={"Empty file upload image"}
              src={"/upload.svg"}
              height={300}
              width={300}
            />
          </div>
          <div className={"text-center text-lg text-gray-500"}>
            No files uploaded yet.
            <div className={"mt-5 items-center"}>
              <UploadFilePopUpOrg />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RightSidebar;
