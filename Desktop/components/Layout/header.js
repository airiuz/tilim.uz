import React from "react";
import { logo } from "../utils/icons";
import Link from "next/link";
import ActiveLink from "../utils/activeLink";
import Mode from "./mode";

function Header() {
  return (
    <header className="bg-white dark:bg-darkSecondary">
      <div className="max-w-[1366px] px-4 mx-auto flex justify-between items-center py-[10px]">
        <Link href={"/"}>
          <a className="flex items-center space-x-2 select-none">
            <span className="fill-primary dark:fill-darkPrimary">{logo}</span>
            <p className="text-lg font-semibold text-primary dark:text-darkPrimary">
              TILIM.UZ
            </p>
          </a>
        </Link>
        <div className="flex space-x-10">
          <ActiveLink
            content={"Lotin-Kirill"}
            href={"/"}
            active={"text-primary dark:text-darkPrimary"}
          />
          <ActiveLink
            content={"Hujjatlar bilan ishlash"}
            href={"/documents/"}
            active={"text-primary dark:text-darkPrimary"}
          />
          {/* <ActiveLink
            content="Tez yozishni sinash"
            href={"/tezYoz/"}
            active={"text-primary dark:text-darkPrimary"}
          /> */}
          <ActiveLink
            content={"Loyiha haqida"}
            href={"/about/"}
            active={"text-primary dark:text-darkPrimary"}
          />
          <Mode />
        </div>
      </div>
    </header>
  );
}

export default Header;
