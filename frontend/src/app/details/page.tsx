"use client";
import React, { useEffect, useState, useRef } from "react";
import ImageWithBoundingBoxes from "@/components/ImageWithBoundingBoxes";
import ObjectButtons from "@/components/ObjectButton";
import ReactMarkdown from 'react-markdown';
import { useAppSelector } from "@/libs/redux/store";
import Layout from '@/app/layout'
import { BackButton } from "@/components";

const Details: React.FC = () => {
  const { imageUrl, objects, reasoning } = useAppSelector((state) => state.selectedImage);
  
  console.log("details ", imageUrl, objects, reasoning);

  const [hoveredObject, setHoveredObject] = useState<string | null>(null);


  return (
    <Layout>
      <div className="flex flex-row w-[80%] ">
        <BackButton />
      </div>
      <div className="flex flex-row w-[80%] p-8 bg-slate-200 my-12 rounded-xl shadow-lg justify-around h-[800px]">
        <div className="imageSection flex flex-col max-w-[52%] flex-1 justify-between">
          <div className="imageWrapper w-full h-[80%] flex flex-col justify-center content-center bg-white rounded-xl shadow">
            <ImageWithBoundingBoxes
              imageUrl={imageUrl}
              objects={objects}
              hoveredObject={hoveredObject}
            />
          </div>
          <ObjectButtons
            objects={objects}
            onHover={setHoveredObject}
            className="flex flex-row shadow-inner w-full h-[17%] bg-white rounded-xl p-3 overflow-auto flex-wrap "
          />
        </div>
        <div className="markdown-container bg-white p-8 text-lg text-black rounded-xl w-[45%] overflow-scroll h-full">
          <h1 className="font-bold text-3xl mb-4">Analysis</h1>
          <ReactMarkdown>{reasoning}</ReactMarkdown>
        </div>
      </div>
    </Layout>
  );
};

export default Details;
