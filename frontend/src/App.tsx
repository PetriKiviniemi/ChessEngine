import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import ChessBoard, { ChessBoardVariables, parseFEN } from "./Chessboard";
import SpriteExtractor from "./SpriteExtractor";
import { ChessImages } from "./Chessboard";

const defaultFEN: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

function App() {
  const [chessImages, setChessImages] = React.useState<ChessImages>({
    chessPieces: [],
  });

  const [boardVariables, setBoardVariables] = React.useState<ChessBoardVariables>(() => parseFEN(defaultFEN));

  useEffect(() => {
    // Load the chessboard image first
  })

  const onExtractCallback = (pieceImages: string[]) => {
    console.log(pieceImages)
    setChessImages({...chessImages, chessPieces: pieceImages});
  };

  return (
    <div className="App">
      <SpriteExtractor
        spriteSheetPath="assets/spritesheet.png"
        rows={1}
        cols={12}
        pieceWidths={[254, 254, 229, 208, 281, 231, 254, 254, 229, 208, 281, 231]}
        onExtract={onExtractCallback}
      />
      <ChessBoard
        boardVariables={boardVariables}
        chessImages={chessImages}
      />
      <div>
        Chess icons by https://opengameart.org/users/johnpablok
      </div>
    </div>
  );
}

export default App;
