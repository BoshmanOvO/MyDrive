"use client";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useOrganization,
} from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const { organization } = useOrganization();
  console.log(organization?.id);
  const createFile = useMutation(api.file.createFile);
  const files = useQuery(
    api.file.getFiles,
    organization?.id ? { orgId: organization?.id } : "skip",
  );
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignedIn>
        <SignOutButton>
          <Button>Sign Out</Button>
        </SignOutButton>
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <Button>Sign In</Button>
        </SignInButton>
      </SignedOut>
      {files?.map((f) => <div>{f.name}</div>)}
      <Button
        onClick={() => {
          if (!organization) return;
          createFile({
            name: "file_name",
            orgId: organization?.id,
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
