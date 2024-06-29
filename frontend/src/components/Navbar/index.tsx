'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./styles/index.module.css";

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <div>
      <div className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.flexContainer}>
            <ul className={styles.navLinks}>
              <li>
                <Link href="/home" passHref>
                  <p className={pathname === "/home" || pathname === "/results" ? styles.active : ""}>
                    Home
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/history" passHref>
                  <p className={pathname === "/history" ? styles.active : ""}>
                    History
                  </p>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
