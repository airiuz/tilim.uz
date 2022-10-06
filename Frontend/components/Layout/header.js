import React from "react";
import { keyboard, document, info_icon } from "../utils/icons";
import Link from "next/link";
import ActiveLink from "../utils/activeLink";

function Header() {
  return (
    <header className=" bg-cyan-900">
      <div className="max-w-7xl p-4 mt-0 mx-auto flex justify-between items-center  text-white ">
        <div>
          <p className="text-3xl font-mono">CYRIL</p>
        </div>
        <div>
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center ">
            <li className="mr-2">
              <ActiveLink
                children="Matn ustida ishlash"
                icon={keyboard}
                href="/"
                active={"text-green-500"}
              />
            </li>
            <li className="mr-2">
              <ActiveLink
                children="Hujjatlar bilan ishlash"
                icon={document}
                href="/documents/"
                active={"text-green-500"}
              />
            </li>
          </ul>
        </div>
        <ActiveLink
          children="Loyiha haqida"
          icon={info_icon}
          href="/about/"
          active={"text-green-500"}
        />
      </div>
    </header>
  );
}

export default Header;
