"use client"

import { ImageCard } from "@/libs/types";
import { useRouter } from 'next/navigation';
import React from "react";
import styles from "./styles/index.module.css";
import { useAppDispatch } from "@/libs/redux/store";
import { setSelectedImage } from "@/libs/redux/selectedImageSlice";


export const Card: React.FC<ImageCard> = ({ imageUrl, objects,reasoning }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  console.log("card image: ", imageUrl)

  const handleViewDetailsClick = () => {
    const img: ImageCard = { imageUrl, objects, reasoning };
    dispatch(setSelectedImage(img));
    router.push("/details");
  }

  return (
    <div className={styles.card}>
      <div className="w-full h-[80%] bg-slate-200 rounded-lg">
        <img
          src={imageUrl}
          alt="Context image"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
      <div className={styles.content}>
        <button className={styles.detailButton} onClick={handleViewDetailsClick}>View Details</button>
      </div>
    </div>
  );
};
