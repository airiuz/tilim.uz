import React from "react";
import { keyboard, document, info_icon, logo } from "../utils/icons";
import Link from "next/link";
import ActiveLink from "../utils/activeLink";

function Header() {
  return (
    <header>
      <div className="max-w-[1366px] px-4 mx-auto flex justify-between items-center text-white py-[10px]">
        <div className="flex items-center space-x-2 select-none">
          <span>{logo}</span>
          <p className="text-lg font-semibold text-primary ">TILIM.UZ</p>
        </div>
        <div className="flex space-x-10">
          <ActiveLink
            children="Lotin-Kirill"
            href="/"
            active={"text-primary"}
          />
          <ActiveLink
            children="Dokumentlar bilan ishlash"
            href="/documents/"
            active={"text-primary"}
          />
          <ActiveLink
            children="Tez yozishni sinash"
            href="#"
            active={"text-primary"}
          />
          <ActiveLink
            children="Loyiha haqida"
            href="/about/"
            active={"text-primary"}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
