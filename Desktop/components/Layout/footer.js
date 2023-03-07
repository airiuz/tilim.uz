import Link from "next/link";
import React from "react";
import ActiveLink from "../utils/activeLink";
import {
  facebook,
  github,
  instagram,
  logo,
  straightLine,
  telegram,
} from "../utils/icons";

function Footer() {
  return (
    <footer className="px-4 bg-white dark:bg-darkSecondary">
      <div className="max-w-[1366px] mx-auto flex justify-between items-center border-b dark:border-[#495054] py-[15px]">
        <div className="flex items-center space-x-3">
          <Link href={"/"}>
            <a className="flex items-center space-x-2 select-none">
              <span className="fill-primary dark:fill-darkPrimary">{logo}</span>
              <p className="text-[16px] font-semibold text-primary dark:text-darkPrimary">
                TILIM.UZ
              </p>
            </a>
          </Link>
          <span className="text-[#828696]">{straightLine}</span>
          <span className="text-[#828696]">Beta v1.0</span>
        </div>
        <div className="flex space-x-10">
          <ActiveLink
            content="Lotin-Kirill"
            href="/"
            active={"text-primary text-darkPrimary"}
          />
          <ActiveLink
            content={"Hujjatlar bilan ishlash"}
            href={"/documents/"}
            active={"text-primary text-darkPrimary"}
          />
          {/* <ActiveLink
            content={"Tez yozishni sinash"}
            href={"tezYoz"}
            active={"text-primary text-darkPrimary"}
          /> */}
          <ActiveLink
            content={"Loyiha haqida"}
            href={"/about/"}
            active={"text-primary text-darkPrimary"}
          />
        </div>
        <div className="flex space-x-6 fill-primary dark:fill-darkPrimary">
          <Link href={"https://www.facebook.com/ai.uzbekistan"}>
            <a target={"_blank"}>{facebook}</a>
          </Link>
          <Link href={"https://www.instagram.com/airi.uz/"}>
            <a target={"_blank"}>{instagram}</a>
          </Link>
          <Link href={"https://t.me/tilim_uz"}>
            <a target={"_blank"}>{telegram}</a>
          </Link>
          <Link href={"https://github.com/airiuz"}>
            <a target={"_blank"}>{github}</a>
          </Link>
        </div>
      </div>
      <div className="flex items-center py-[24px] max-w-[1366px] mx-auto justify-between">
        <div>
          <p className="text-[#828696] dark:text-darkTernary text-xs">
            2022 © Tilim uz
          </p>
          <p className="text-[#828696] dark:text-darkTernary text-[8px]">
            Barcha huquqlar himoyalangan
          </p>
        </div>
        <div className="flex space-x-[32px]">
          <Link href={"/contact"}>
            <a className="text-[#273A5D] dark:text-darkTernary text-[15px]">
              Bog&lsquo;lanish
            </a>
          </Link>
          <Link href={"/security"}>
            <a className="text-[#273A5D] dark:text-darkTernary text-[15px] pointer-events-none">
              Xavfsizlik siyosati
            </a>
          </Link>
          <Link href={"/politics"}>
            <a className="text-[#273A5D] dark:text-darkTernary text-[15px] pointer-events-none">
              Foydalanuvchi siyosati
            </a>
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
