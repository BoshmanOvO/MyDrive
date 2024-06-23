import React from "react";
import {
  OrganizationSwitcher,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button";

const Header = () => {
  return (
    <div className={"border-b py-3 bg-gray-100"}>
      <div className={"container flex mx-auto justify-between"}>
        <Link
          href={"/"}
          className={"flex gap-2 items-center text-xl font-extrabold"}
        >
          <Image src={"/logo.svg"} alt={"myLogo"} width={40} height={40} />
          File Keeper
        </Link>
        <Link href={"/dashboard"}>
            <Button variant={'link'}>Dashboard</Button>
        </Link>
        <div className={"flex gap-3"}>
          <OrganizationSwitcher />
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default Header;
