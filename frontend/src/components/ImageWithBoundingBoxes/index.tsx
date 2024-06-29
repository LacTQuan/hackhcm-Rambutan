import React, { LegacyRef, useEffect, useRef, useState } from 'react';
import stringToColor from '@/utils/StringToColor';
interface Props {
  imageUrl: string;
  objects: { [key: string]: number[][] }
  hoveredObject: string | null;
}

interface ImagePosition {
  top: number;
  left: number;
}

const ImageWithBoundingBoxes: React.FC<Props> = ({ imageUrl, objects, hoveredObject }) => {
  const [imgScale, setImgScale] = useState<number>(1.0);
  const [imgPos, setImgPos] = useState<ImagePosition>({ top: 0, left: 0 })
  const elementRef = useRef<HTMLImageElement>(null);

  const handleImageScaling = () => {
    // Create a new Image object
    const img = new Image();
    img.src = imageUrl;


    // Set up onload handler to get the image dimensions
    if (elementRef.current) {
      const naturalHeight = img.height;
      const naturalWidth = img.width;

      const { clientWidth, clientHeight } = elementRef.current;

      // calculate the scale
      const widthScale = clientWidth / naturalWidth;
      const heightScale = clientHeight / naturalHeight;

      // The final scale is the smaller of the two scale factors
      const scale = Math.min(widthScale, heightScale);
      setImgScale(scale);


      const rect = elementRef.current.getBoundingClientRect();
      setImgPos({ top: Math.abs(rect.height - naturalHeight * scale) / 2, left: Math.abs(rect.width - naturalWidth * scale) / 2 });

      console.log(rect.top, rect.left, naturalWidth * scale, naturalHeight * scale, imgScale)

      // get elementRef position

    }
  }


  useEffect(() => {
    handleImageScaling();

    window.addEventListener('resize', handleImageScaling);
  }, []);


  return (
    <div style={{ display: 'inline-block', width: '100%', height: '100%', position: 'relative' }} ref={elementRef} >
      <img src={imageUrl} alt="Detected objects" style={{ height: '100%', width: '100%', objectFit: 'contain' }} />
      {hoveredObject && objects[hoveredObject]?.map((box, index) => (
        <BoundingBox imgScale={imgScale} imgPos={imgPos} box={box} index={index} toColor={hoveredObject} />

      ))}
      {!hoveredObject && Object.keys(objects).map((key) => (
        objects[key]?.map((box, index) => (
          <BoundingBox imgScale={imgScale} imgPos={imgPos} box={box} index={index} toColor={key} />
        )
        )
      ))}
    </div>
  );
};

interface BoundingBoxProps {
  imgScale: number;
  imgPos: ImagePosition;
  box: number[];
  index: number;
  toColor: string;
}

const BoundingBox: React.FC<BoundingBoxProps> = ({ imgScale, imgPos, box, index, toColor }) => {
  const color = stringToColor(toColor);
  return (
    <div
      key={index}
      style={{
        position: 'absolute',
        border: '2px solid ' + color,
        left: `${Math.min(box[0], box[2]) * imgScale + imgPos.left}px`,
        top: `${Math.min(box[1], box[3]) * imgScale + imgPos.top}px`,
        width: `${Math.abs(box[2] - box[0]) * imgScale}px`,
        height: `${Math.abs(box[3] - box[1]) * imgScale}px`,
        pointerEvents: 'none', // Make sure the bounding box doesn't interfere with mouse events
        backgroundColor: color+ "80"
      }}
    />
  );
}

export default ImageWithBoundingBoxes;
