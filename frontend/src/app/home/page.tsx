"use client";

import Layout from "@/app/layout";
import { useRef, useState } from "react";
import styles from "./styles/index.module.css";
import { useAppDispatch, useAppSelector } from "@/libs/redux/hooks";
import { setUploadedFiles } from "@/libs/redux/uploadedFilesSlice";
import { axiosInstance } from "@/libs/axios";
import { setLoading } from "@/libs/redux/loadingSlice";
import { Loader } from "@/components/Loader";
import { Card } from "@/components";
import { useRouter } from "next/navigation";
import { ImageCard } from "@/libs/types";

const Home = () => {
  const [uploadCount, setUploadCount] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();
  const [images, setImages] = useState<File[]>([]);
  const loading = useAppSelector((state) => state.loading);
  const [filePaths, setFilePaths] = useState<string[]>([]);
  const router = useRouter();

  let paths = [] as string[];

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleCookClick = async () => {
    try {
      const formData = new FormData();
      images.forEach((file) => {
        formData.append("images", file);
      });

      dispatch(setLoading(true));

      const response = await axiosInstance.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 100000,
      });

      
      if (response.status !== 200) {
        dispatch(setUploadedFiles([]));
      } else {
        const listResponse = response.data.data;
        
        console.log("response: ", response);

        console.log("list response: ", listResponse)

        let formattedList: ImageCard[] = listResponse.map((card: ImageCard) => ({
          imageUrl: card.imageUrl,          // Ensure this matches the field in your API response
          objects: card.objects,        // Ensure this matches the field in your API response
          reasoning: card.reasoning,    // Ensure this matches the field in your API response
        }));

        console.log("formatted list: ", formattedList);

        console.log("Success: ", response.data.data);
        // response.data.data.forEach((data: any) => {
        //   paths.push(data.imageUrl as string);
        // });

        // setFilePaths(paths);
        
        console.log(formattedList);
        
        dispatch(setUploadedFiles(formattedList));
      }
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
    }
    // navigate to results page
    router.push("/results");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setImages(files);
      setUploadCount(uploadCount + files.length);
    }
  };

  return loading.isLoading ? (
    <Loader />
  ) : (
    <Layout>
      <div className={styles.container}>
        <div>
          <input
            type="file"
            multiple
            ref={inputRef}
            style={{ display: "none" }}
            onChange={handleChange}
          />
          <button className={styles.upload + "  transform transition-transform duration-300 hover:-translate-y-1"} onClick={handleUploadClick}>
            Upload{" "}
            {uploadCount > 0 && (
              <span className={styles.badge}>{uploadCount}</span>
            )}
          </button>
        </div>
        <button className={styles.cook + "  transform transition-transform duration-300 hover:-translate-y-1"} onClick={handleCookClick}>
          Analyze
        </button>
        {/* {filePaths.length > 0 && (
          <div className={styles.result}>
            <div className={styles.grid}>
              {filePaths.map((item, index) => (
                <Card key={index} imageSrc={item} context={""} />
              ))}
              
            </div>
          </div>
        )} */}
      </div>
    </Layout>
  );
};

export default Home;
