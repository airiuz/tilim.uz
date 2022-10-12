import Link from "next/link";
import { useRouter } from "next/router";

function ActiveLink({ href, children, active }) {
  const { asPath } = useRouter();

  return (
    <Link href={href}>
      <a
        className={`flex items-center text-lg ${
          asPath === href ? active : "text-[#273A5D] "
        }`}
      >
        {children}
      </a>
    </Link>
  );
}

export default ActiveLink;
