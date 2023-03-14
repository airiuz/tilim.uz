import Link from "next/link";
import { useCallback, useState } from "react";
import ActiveLink from "../utils/activeLink";
import {
  closeMenu,
  facebook,
  github,
  hamburger,
  instagram,
  logo,
  telegram,
} from "../utils/icons";
import Mode from "./mode";

function Header() {
  const [menu, setMenu] = useState(false);

  const handleMenu = useCallback(() => {
    setMenu(!menu);
  }, [menu]);
  return (
    <>
      <header className="bg-white dark:bg-darkSecondary">
        <div className="container mx-auto py-[26px]">
          <div className="flex items-center justify-between pb-[43px] px-[20px]">
            <button
              onClick={handleMenu}
              className="fill-[#273A5D] dark:fill-[#DBDBDB]"
            >
              {hamburger}
            </button>

            <Link href={"/"} className="flex items-center space-x-[6px]">
              <span className="h-[32px] w-[19px] fill-primary dark:fill-darkPrimary">
                {logo}
              </span>
              <p className="text-primary dark:text-darkPrimary text-[18px] font-semibold">
                TILIM.UZ
              </p>
            </Link>
            <Mode />
          </div>
          <div className="flex justify-between space-x-2 sm:space-x-4 px-4">
            <ActiveLink
              content={"Matn"}
              href={"/"}
              active={
                "text-primary  border-primary  dark:text-darkPrimary dark:border-darkPrimary"
              }
            />
            <ActiveLink
              content={"Xujjat"}
              href={"/document/"}
              active={
                "text-primary  border-primary  dark:text-darkPrimary dark:border-darkPrimary"
              }
            />
            {/* <ActiveLink
              content={"Tez yozish"}
              href={"/ff"}
              active={"text-primary  border-primary  dark:text-darkPrimary dark:border-darkPrimary"}
            /> */}
          </div>
        </div>
      </header>
      <div
        className={` ${
          menu ? "block" : " hidden"
        } fixed inset-0 z-[99] bg-black/30`}
        onClick={handleMenu}
      ></div>
      <div
        className={`${
          menu ? "translate-x-0 visible" : "-translate-x-full invisible`"
        } transition-all duration-1000 ease-out fixed top-0 z-[100]  flex flex-col justify-between inset-y-0 bg-white dark:bg-darkSecondary pl-[30px] pr-[21px] py-[35px] left-0 right-8`}
      >
        <div>
          <div className="flex itemscenter justify-between">
            <div className="flex items-center space-x-[10px]">
              <span className="h-[70px] w-[41px] fill-primary dark:fill-darkPrimary">
                {logo}
              </span>
              <p className="text-primary dark:text-darkPrimary text-[18px] font-semibold">
                TILIM.UZ
              </p>
            </div>
            <button onClick={handleMenu} className="dark:fill-white">
              {closeMenu}
            </button>
          </div>
          <div className="flex flex-col space-y-[30px] font-medium text-[18px]  text-[#273A5D] mt-[45px] dark:text-[#DBDBDB]">
            <Link href={"/about"}>Loyiha haqida</Link>
            <Link href={"/contact"}>Bog&lsquo;lanish</Link>
            <Link href={"#"}>Xavfsizlik siyosat</Link>
            <Link href={"#"}>Foydalanuvchi siyosati </Link>
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-[30px] fill-primary dark:fill-darkPrimary">
            <Link
              href={"https://m.facebook.com/ai.uzbekistan"}
              target={"_blank"}
            >
              {facebook}
            </Link>
            <Link href={"https://www.instagram.com/airi.uz/"} target={"_blank"}>
              {instagram}
            </Link>
            <Link href={"https://t.me/tilim_uz"} target={"_blank"}>
              {telegram}
            </Link>
            <Link href={"https://github.com/airiuz"} target={"_blank"}>
              {github}
            </Link>
          </div>
          <p className="text-[#828696] dark:text-darkTernary text-[12px] max-w-[200px] mt-[23px]">
            2022 © Tilim uz
          </p>
          <p className="text-[7px] text-[#828696] dark:text-darkTernary mt-[7px]">
            Barcha huquqlar himoyalangan
          </p>
        </div>
      </div>
    </>
  );
}

export default Header;
