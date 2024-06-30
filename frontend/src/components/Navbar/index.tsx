'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./styles/index.module.css";

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="flex justify-between items-center bg-white h-[4rem] px-6 shadow-md">
      <div className="flex space-x-8">
        <Link href="/home" passHref>
          <p
            className={`text-black text-lg cursor-pointer  transform transition-transform duration-300 hover:-translate-y-1 ${pathname === "/home" || pathname === "/results" ? "font-bold border-b-2 border-orange-400" : ""}`}
          >
            Home
          </p>
        </Link>
        <Link href="/history" passHref>
          <p
            className={`text-black text-lg cursor-pointer  transform transition-transform duration-300 hover:-translate-y-1 ${pathname === "/history" ? "font-bold border-b-2 border-orange-400" : ""}`}
          >
            History
          </p>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
