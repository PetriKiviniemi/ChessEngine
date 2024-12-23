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
    setChessImages({...chessImages, chessPieces: pieceImages});
  };

  return (
    <div className="App">
      <SpriteExtractor
        spriteSheetPath="assets/chesspieces.png"
        rows={2}
        cols={6}
        onExtract={onExtractCallback}
      />
      <ChessBoard
        boardVariables={boardVariables}
        chessImages={chessImages}
      />
    </div>
  );
}

export default App;
