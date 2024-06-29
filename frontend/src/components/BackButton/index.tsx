'use client'

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./styles/index.module.css";

export const BackButton = () => {
  const router = useRouter();

  return (
    <button onClick={() => router.back()} className={styles.backButton}>
      <Image src="/back-icon.png" alt="Back" width={20} height={20} />
      <span className="text-black" style={{ fontWeight: 600 }}>BACK</span>
    </button>
  );
};
