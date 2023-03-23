"use client";
import {usePathname} from "next/navigation";

export const useActiveLink = () => {
    const pathname = usePathname()
    return  (page: string, className: string) => (pathname === page ? className : "")
}
