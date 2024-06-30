import React from 'react';
import { ChevronRight } from "lucide-react"


interface PhotoEntryProps {
  time: string;
  photoCount: number;
  id: string;
  onClick: (id: string) => void;
}

const PhotoEntry: React.FC<PhotoEntryProps> = ({ time, photoCount, onClick, id }) => {
  return (
    <div className="shadow rounded-xl flex flex-row py-4 px-8 bg-white mb-12 text-black hover:bg-slate-200 hover:cursor-pointer items-center  transform transition-transform duration-300 hover:-translate-y-1" onClick={() => onClick(id)}>
      <div className='flex flex-row justify-between flex-1 text-muted-foreground text-xl'>
        <span>{time}</span>
        <span>{photoCount} photos</span>
      </div>
      <ChevronRight className='ml-6' />
    </div>
  );
};

export default PhotoEntry;
