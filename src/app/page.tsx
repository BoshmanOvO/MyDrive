"use client";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import UploadFilePopUpOrg from "@/components/UploadFilePopUpOrg";
import FileCards from "@/components/FileCards";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import React from "react";

export default function Home() {
  const user = useUser();
  const organization = useOrganization();
  let orgId: string | undefined = undefined;
  if (user.isLoaded && organization.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  const files = useQuery(api.file.getFiles, orgId ? { orgId: orgId } : "skip");
  const isLoading = files == undefined;

  return (
    <main className="container mx-auto pt-12">
      {isLoading && (
        <div className={"flex flex-col w-full items-center mt-16 mb-5"}>
          <Loader2 className={"h-32 w-32 animate-spin text-gray-400"} />
          <h1 className={'text-2xl'}>Loading your files...</h1>
        </div>
      )}
      {!isLoading && files.length > 0 && (
        <>
          <div className={"flex justify-between items-center mb-8"}>
            <h1 className={"text-4xl font-bold"}>Your Files</h1>
            <UploadFilePopUpOrg />
          </div>
          <div className={"grid grid-cols-4 gap-4"}>
            {files?.map((file) => <FileCards key={file._id} file={file} />)}
          </div>
        </>
      )}
      {!isLoading && files.length == 0 && (
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
    </main>
  );
}
