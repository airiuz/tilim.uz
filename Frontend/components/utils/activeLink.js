import Link from "next/link";
import { useRouter } from "next/router";

function ActiveLink({ href, content, active }) {
  const { asPath } = useRouter();

  return (
    <Link href={href}>
      <a
        className={`flex items-center text-[16px] ${
          asPath === href ? active : "text-[#273A5D] "
        }`}
      >
        {content}
      </a>
    </Link>
  );
}

export default ActiveLink;
