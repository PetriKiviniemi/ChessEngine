import React, { useEffect, useState } from "react";
import "./App.css";
import ChessBoard from "./Chessboard";
import SpriteExtractor from "./SpriteExtractor";
import { ChessImages, ChessBoardVariables, parseFEN } from "./ChessboardUtils";

//const defaultFEN: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const defaultFEN: string =
  "2r3k1/pp1q1ppp/4pn2/3p2b1/2PP4/2N2N2/PP2QPPP/R4RK1 w - - 3 18";

function App() {
  const [chessImages, setChessImages] = React.useState<ChessImages>({
    chessPieces: [],
  });
  const [boardVariables, setBoardVariables] =
    React.useState<ChessBoardVariables>(() => parseFEN(defaultFEN));

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
            boardVariables={boardVariables}
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
