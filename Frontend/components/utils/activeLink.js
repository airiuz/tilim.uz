import Link from "next/link";
import { useRouter } from "next/router";

function ActiveLink({ href, children, active, icon }) {
  const { asPath } = useRouter();

  return (
    <Link href={href}>
      <a
        className={`px-3 flex items-center gap-[2px] ${
          asPath === href && active
        }`}
      >
        {icon} {children}
      </a>
    </Link>
  );
}

export default ActiveLink;
