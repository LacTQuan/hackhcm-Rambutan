"use client";

import Layout from "@/app/layout";
import { Card } from "@/components";
import styles from "./styles/index.module.css";
import { useAppSelector, useAppDispatch } from "@/libs/redux/hooks";

const Results = () => {
  const results = useAppSelector((state) => state.uploadedFiles);

  console.log("results: ", results)

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.grid}>
          {results.map((result, index) => (
            <Card key={index} imageUrl={result.imageUrl} objects={result.objects} reasoning={result.reasoning} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Results;
