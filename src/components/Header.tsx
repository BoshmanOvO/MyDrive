import React from "react";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

const Header = () => {
  return (
    <div className={"border-b py-3 bg-gray-50"}>
      <div className={"container flex mx-auto justify-between"}>
        <div className={"text-lg font-extrabold"}>File Keeper</div>
        <div className={'flex gap-3'}>
          <OrganizationSwitcher />
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default Header;
