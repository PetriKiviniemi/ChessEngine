import React, { useEffect, useState } from "react";
import "./App.css";
import ChessBoard from "./Chessboard";
import SpriteExtractor from "./SpriteExtractor";
import { ChessImages, ChessBoardVariables, parseFEN } from "./ChessboardUtils";

//const defaultFEN: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

function App() {
  const [chessImages, setChessImages] = React.useState<ChessImages>({
    chessPieces: [],
  });

  const onExtractCallback = (pieceImages: string[]) => {
    setChessImages((prev) => ({ ...prev, chessPieces: pieceImages }));
  };

  return (
    <div className="App">
      <SpriteExtractor
        spriteSheetPath="assets/spritesheet.png"
        rows={1}
        cols={12}
        pieceWidths={[
          254, 254, 229, 208, 281, 231, 254, 254, 229, 208, 281, 231,
        ]}
        onExtract={onExtractCallback}
      />
      {
        // Do not render until chess images are loaded
        chessImages.chessPieces.length > 0 ? (
          <ChessBoard
            chessImages={chessImages}
          />
        ) : (
          <div />
        )
      }
      <div>Chess icons by https://opengameart.org/users/johnpablok</div>
    </div>
  );
}

export default App;
