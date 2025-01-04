import React, { useEffect, useState } from "react";
import {
  boardToFenString,
  ChessBoardVariables,
  ChessImages,
  legalMovesToMap,
  mapPieceToSpriteSheetIndex
} from "./ChessboardUtils";
import { fetchMoveData } from "./Api";

interface ChessBoardProps {
  boardVariables: ChessBoardVariables;
  chessImages: ChessImages;
}

const ChessPieceStyle = {
  width: 70,
  height: 70,
  aspectRatio: 1,
  margin: 0,
  marginTop: 3,
  padding: 0,
};

const ChessPieceContainerStyle = {
  width: 80,
  height: 80,
  aspectRatio: 1,
  margin: 0,
  padding: 0,
  justifyContent: 'center',
  alignContent: 'center',
};

const ChessBoard: React.FC<ChessBoardProps> = ({
  boardVariables,
  chessImages,
}) => {
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [bestMove, setBestMove] = useState<string>("");

  useEffect(() => {
    console.log(boardVariables);
  });

  useEffect(() => {
    const boardFen = boardToFenString(boardVariables);
    fetchMoveData(boardFen).then((res) => {
      if(res)
      {
        setBestMove(res.bestMove);
        setLegalMoves(res.legalMoves);
        console.log(legalMovesToMap(res.legalMoves))
      }
    });
  }, [])

  return (
    <div
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          position: "absolute",
          display: "grid",
          height: "40em",
          width: "40em",
          gridTemplateColumns: "repeat(8, 0fr)",
          gridTemplateRows: "repeat(8, 0fr)",
          gap: 0,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {boardVariables.boardState.map((row, rowIdx) => {
          return row.map((piece, index) => {
            let idx = mapPieceToSpriteSheetIndex(piece);
            return (
              <div
                style={
                  (index + rowIdx) % 2 == 0
                    ? { ...ChessPieceContainerStyle, backgroundColor: "rgb(117, 149, 85)" }
                    : { ...ChessPieceContainerStyle, backgroundColor: "rgb(237, 237, 209)" }
                }
              >
                {idx >= 0 ? (
                  <img
                    src={chessImages.chessPieces[idx]}
                    style={ChessPieceStyle}
                    onMouseDown={() => console.log(idx)}
                  />
                ) : (
                  <div style={ChessPieceStyle} />
                )}
              </div>
            );
          });
        })}
      </div>
      <p style={{fontSize: 24}}>{boardToFenString(boardVariables)}</p>
    </div>
  );
};

export default ChessBoard;

// TODO:: 
// Game logic
// - Assign player to black or white
// - Always move the opponent as server says (Best move), and go to next player's turn
// Mouse handling.
// - Click to drag an image, which then draws the legal moves as dots for that board index
// - Remove the image after mouseDown and clue it to the cursor (Prevent default or then absolute pos with zIndex == 100)
// - onMouseDrop, check if legal position, if not, reset the position, if it is, update boardState
// - On succesful move, send the board as FEN string to server after boardState is updated