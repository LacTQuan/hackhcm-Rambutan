import React from "react";
import Layout from "@/app/layout";
import Image from "next/image";

const Loader = () => {
  return (
    <Layout>
      <Image src="/loader.svg" alt="Loading" width={50} height={50} />
      <div>Loading...</div>
    </Layout>
  );
};

export default Loader;
