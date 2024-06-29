import React from 'react';
import { ChevronRight } from "lucide-react"


interface PhotoEntryProps {
  time: string;
  photoCount: number;
}

const PhotoEntry: React.FC<PhotoEntryProps> = ({ time, photoCount }) => {
  return (
    <div className="shadow rounded-xl flex flex-row py-6 px-8 bg-white mb-12 text-black hover:bg-slate-200 items-center">
      <div className='flex flex-row justify-between flex-1 text-muted-foreground text-2xl'>
        <span>{time}</span>
        <span>{photoCount} photos</span>
      </div>
      <ChevronRight className='ml-6' />
    </div>
  );
};

export default PhotoEntry;
