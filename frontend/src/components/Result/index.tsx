"use client";

import Layout from "@/app/layout";
import { Card } from "@/components";
import styles from "./styles/index.module.css";
// import { useRouter } from "next/router";

export const Result = ({ uploadedFiles }: { uploadedFiles: string[] }) => {
  console.log("Result: ", uploadedFiles);

  return (
    <div className={styles.container}>
      {/* <SearchBar onSearch={handleSearch} />
        <BackButton /> */}
      <div className={styles.grid}>
        {uploadedFiles.map((item, index) => (
          <Card key={index} imageSrc={item} context={""} />
        ))}
      </div>
    </div>
  );
};
