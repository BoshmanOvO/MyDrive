"use client";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useOrganization,
  useUser,
} from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const user = useUser();
  const organization = useOrganization();
  // console.log(user.user?.id);
  // console.log(organization?.organization?.id);
  
  let token: string | undefined = undefined;
  if (user.isLoaded && organization?.isLoaded) {
    token = organization?.organization?.id || user.user?.id;
  }
    console.log(token)
  const createFile = useMutation(api.file.createFile);
  const files = useQuery(api.file.getFiles, token ? { orgId: token } : "skip");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {files?.map((f) => (
        <div key={f._id}>{f.name}</div>
      ))}
      <Button
        onClick={() => {
          if (!token) return;
          console.log(token);
          createFile({
            name: "file_name",
            orgId: token || "",
          }).then((r) => {
            console.log(r);
          });
        }}
      >
        create file
      </Button>
    </main>
  );
}
