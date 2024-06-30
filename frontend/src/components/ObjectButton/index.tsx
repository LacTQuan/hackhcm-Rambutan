import stringToColor from '@/utils/StringToColor';
import React from 'react';

interface Props {
  objects: { [key: string]: any[] };
  className?: string | undefined;
  onHover: (objectName: string | null) => void;
}

const ObjectButtons: React.FC<Props> = ({ objects, className, onHover }) => {
  return (
    <div className={className}>
      {Object.keys(objects).map((objectName) => (
        <button
          className='h-[50px] m-2 rounded-3xl bg-black p-4 flex flex-col justify-center  transform transition-transform duration-300 hover:-translate-y-1'
          key={objectName}
          onMouseEnter={() => onHover(objectName)}
          onMouseLeave={() => onHover(null)}
          style={{backgroundColor: `${stringToColor(objectName)}`}}
        >
          {objectName}
        </button>
      ))}
    </div>
  );
};

export default ObjectButtons;
