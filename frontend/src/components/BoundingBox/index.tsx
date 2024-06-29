import React, { useRef, useEffect } from 'react';

interface BoundingBox {
  top: number;
  left: number;
  bottom: number;
  right: number;
  label: string;
}

interface CanvasProps {
  imageUrl: string;
  boundingBoxes: BoundingBox[];
}

const Canvas: React.FC<CanvasProps> = ({ imageUrl, boundingBoxes }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas?.getContext('2d');
    if (!context) return;

    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      const maxWidth = 800;
      const maxHeight = 600;

      let scale = Math.min(maxWidth / image.width, maxHeight / image.height);
      let width = image.width * scale;
      let height = image.height * scale;

      canvas.width = width;
      canvas.height = height;

      context.drawImage(image, 0, 0, width, height);

      const colors: { [key: string]: string } = {
        'beer carton boxes': 'red',
        'signboard': 'blue',
        'billboard': 'green',
        'standee': 'yellow',
        'beer cans': 'purple',
        'parasol': 'orange',
        'beer bottles': 'pink',
        'point of sales materials': 'cyan',
      };

      boundingBoxes.forEach(box => {
        const x = box.left * scale;
        const y = box.top * scale;
        const width = (box.right - box.left) * scale;
        const height = (box.bottom - box.top) * scale;

        context.strokeStyle = colors[box.label] || 'white';
        context.lineWidth = 2;
        context.strokeRect(x, y, width, height);
        context.font = '16px Arial';
        context.fillStyle = colors[box.label] || 'white';
        context.fillText(box.label, x, y - 5);
      });
    };
  }, [imageUrl, boundingBoxes]);

  return <canvas ref={canvasRef} />
};

export default Canvas;
