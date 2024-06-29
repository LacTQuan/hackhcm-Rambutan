import React from "react";
import Layout from "@/app/layout";
import Image from "next/image";

const Loader = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <Image src="/loader.svg" alt="Loading" width={70} height={70} />
        <div className="mt-4 text-lg text-white">
          Your images are being processed...
        </div>
      </div>
    </Layout>
  );
};

export default Loader;
