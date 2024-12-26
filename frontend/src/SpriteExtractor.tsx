import React, { useEffect, useRef } from "react";

interface SpriteExtractorProps {
  spriteSheetPath: string;
  rows: number;
  cols: number;
  pieceWidths: number[], // Incase we have different width sprites
  onExtract: (images: string[]) => void; // Callback to retrieve the images
}

const SpriteExtractor: React.FC<SpriteExtractorProps> = ({
  spriteSheetPath,
  rows,
  cols,
  pieceWidths = [],
  onExtract,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    console.log("Loading sprites...");
    const canvas = canvasRef.current;
    if (!canvas) return;
    console.log("Canvas found");

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    console.log("Canvas context loaded");

    console.log("File found... Loading the image");
    const spriteSheetImg = new Image();
    spriteSheetImg.src = spriteSheetPath;

    spriteSheetImg.onload = () => {
      console.log("Loading image...");
      let pieceWidth = spriteSheetImg.width / cols;
      const pieceHeight = spriteSheetImg.height / rows;


      const extractedImages: string[] = [];

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {

          if(pieceWidths.length > 0)
            pieceWidth = pieceWidths[j];

          canvas.width = pieceWidth;
          canvas.height = pieceHeight;


          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(
            spriteSheetImg,
            j * pieceWidth,
            i * pieceHeight,
            pieceWidth,
            pieceHeight,
            0,
            0,
            pieceWidth,
            pieceHeight
          );

          const imgData = canvas.toDataURL("image/png");
          console.log(imgData)
          extractedImages.push(imgData);
        }
      }
      onExtract(extractedImages);
    };

  }, [spriteSheetPath, rows, cols]);

  return <canvas ref={canvasRef} style={{ display: "none" }} />;
};

export default SpriteExtractor;
