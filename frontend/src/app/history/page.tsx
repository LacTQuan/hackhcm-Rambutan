"use client";

import Layout from "@/app/layout";
import PhotoEntry from '@/components/entry';
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import Pagination from "@/components/Pagination";
import { axiosInstance } from "@/libs/axios";
import { useEffect, useState } from "react";
import { Entry } from "@/libs/types";
import { useAppDispatch } from "@/libs/redux/store";
import { setUploadedFiles } from "@/libs/redux/uploadedFilesSlice";
import { ImageCard } from "@/libs/types";
import { useRouter } from "next/navigation";

const History = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleOnClick = (id: string) => {
    // filter the entry with the id
    const entry = entries.filter((entry) => entry._id === id)[0];
    // dispatch the selected entry to the store
    let formattedList: ImageCard[] = entry.images.map((card: ImageCard) => ({
      imageUrl: card.imageUrl,          // Ensure this matches the field in your API response
      objects: card.objects,        // Ensure this matches the field in your API response
      reasoning: card.reasoning,    // Ensure this matches the field in your API response
    }));

    dispatch(setUploadedFiles(formattedList));

    // navigate to the results page
    router.push("/results");
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/history');
        console.log("entries", response.data.data);
        if (Array.isArray(response.data.data)) {
          setEntries(response.data.data);
        } else {
          console.error("Fetched data is not an array");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="flex flex-col flex-1 w-[60%]">
        {/* <div className="flex flex-row justify-end my-8">
          <DatePickerWithRange />
        </div> */}
        <div className="mt-12">
          {entries.map((entry, index) => (
            <PhotoEntry
              onClick={handleOnClick}
              key={index}
              id={entry._id}
              time={new Date(entry.createdAt).toDateString()} // Ensure correct date conversion
              photoCount={entry.images.length}
            />
          ))}
        </div>
        {/* <Pagination totalItems={entries.length} itemsPerPage={5} /> */}
      </div>
    </Layout>
  );
};

export default History;
