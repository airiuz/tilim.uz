import Link from "next/link";
import React from "react";
import ActiveLink from "../utils/activeLink";
import { facebook, github, instagram, logo, telegram } from "../utils/icons";

function Footer() {
  return (
    <footer>
      <div className="max-w-[1366px] px-4 mx-auto flex justify-between items-center border-b py-[17px]">
        <div className="flex items-center space-x-2 select-none">
          <span>{logo}</span>
          <p className="text-[16px] font-semibold text-primary ">TILIM.UZ</p>
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
        <div className="flex space-x-6">
          <Link href={"#"}>
            <a>{facebook}</a>
          </Link>
          <Link href={"#"}>
            <a>{instagram}</a>
          </Link>
          <Link href={"#"}>
            <a>{telegram}</a>
          </Link>
          <Link href={"#"}>
            <a>{github}</a>
          </Link>
        </div>
      </div>
      <div className="flex items-center py-[24px] max-w-[1366px] mx-auto justify-between">
        <div>
          <p className="text-[#828696] text-xs">
            Copyright © 2022 AIRI Group Co., Ltd. All rights reserved.
          </p>
          <p className="text-[#828696] text-[7px]">
            Protected by reCAPTCHA - Privacy Policy and Terms of Service
          </p>
        </div>
        <div className="flex space-x-[32px]">
          <Link href={"#"}>
            <a className="text-[#273A5D] text-[15px]">Kontaktlar</a>
          </Link>
          <Link href={"#"}>
            <a className="text-[#273A5D] text-[15px]">Maxfiylik</a>
          </Link>
          <Link href={"#"}>
            <a className="text-[#273A5D] text-[15px]">Foydalanish shartlari</a>
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
