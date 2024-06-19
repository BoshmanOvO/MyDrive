"use client";
import {
  useOrganization,
  useUser,
} from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import UploadFilePopUpOrg from "@/components/UploadFilePopUpOrg";

export default function Home() {
  const user = useUser();
  const organization = useOrganization();
  let token: string | undefined = undefined;
  if (user.isLoaded && organization?.isLoaded) {
    token = organization?.organization?.id || user.user?.id;
  }
  const createFile = useMutation(api.file.createFile);
  const files = useQuery(api.file.getFiles, token ? { orgId: token } : "skip");

  return (
    <main className="container mx-auto pt-12">
      <div className={"flex justify-between items-center"}>
        <h1 className={"text-4xl font-bold"}>Your Files</h1>
        <UploadFilePopUpOrg />
      </div>
    </main>
  );
}
