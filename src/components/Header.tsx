import React from "react";
import {
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <div className={"sticky top-0 right-0 z-10 border-b py-3 bg-gray-100 max-lg:w-[1330px]"}>
      <div className={"container flex mx-auto justify-between"}>
        <Link
          href={"/"}
          className={"flex gap-2 items-center text-xl font-extrabold"}
        >
          <Image src={"/logo.svg"} alt={"myLogo"} width={40} height={40} />
          File Keeper
        </Link>

        <SignedIn>
          <Link href={"/dashboard/files"}>
            <Button variant={"link"}>
              Your Files
            </Button>
          </Link>
        </SignedIn>

        <div className={"flex gap-3"}>
          <OrganizationSwitcher />
          <UserButton />
          <SignedOut>
            <SignInButton mode={"modal"}>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
};

export default Header;
