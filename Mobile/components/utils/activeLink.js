import Link from "next/link";
import { useRouter } from "next/router";

function ActiveLink({ href, content, active }) {
  const { asPath } = useRouter();

  return (
    <Link
      href={href}
      className={`flex flex-1 min-w-fit items-center justify-center border px-1 text-sm sm:text-base py-[10px] font-medium  rounded-xl   ${
        asPath === href
          ? active
          : "text-[#273A5D] dark:text-darkTernary border-[#E8EBF2] dark:border-opacity-10"
      }`}
    >
      {content}
    </Link>
  );
}

export default ActiveLink;
