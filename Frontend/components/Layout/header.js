import React from "react";
import { keyboard, document, info_icon, logo } from "../utils/icons";
import Link from "next/link";
import ActiveLink from "../utils/activeLink";

function Header() {
  return (
    <header>
      <div className="max-w-[1366px] px-4 mx-auto flex justify-between items-center text-white py-[10px]">
        <Link href={"/"}>
          <a className="flex items-center space-x-2 select-none">
            <span>{logo}</span>
            <p className="text-lg font-semibold text-primary ">TILIM.UZ</p>
          </a>
        </Link>
        <div className="flex space-x-10">
          <ActiveLink
            content={"Lotin-Kirill"}
            href={"/"}
            active={"text-primary"}
          />
          <ActiveLink
            content={"Hujjatlar bilan ishlash"}
            href={"/documents/"}
            active={"text-primary"}
          />
          <ActiveLink
            content="Tez yozishni sinash"
            href={"/tezYoz/"}
            active={"text-primary"}
          />
          <ActiveLink
            content={"Loyiha haqida"}
            href={"/about/"}
            active={"text-primary"}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
