import React, { useRef, useEffect } from "react";
import {
  mapPieceToSpriteSheetIndex,
  mapFenCharToPiece,
} from "./ChessboardUtils";
import {
  EMPTY,
  WHITE,
  BLACK,
  ROOK,
  PAWN,
  KNIGHT,
  BISHOP,
  QUEEN,
  KING,
} from "./ChessboardUtils";

// We can add more things here if needed
export interface ChessImages {
  chessPieces: string[];
}

export interface BoardState {
  boardState: number[][];
}

interface ChessBoardProps {
  boardVariables: ChessBoardVariables;
  chessImages: ChessImages;
}

export interface ChessBoardVariables {
  boardState: number[][];
  colorToMove: number;
  castleWKS: boolean;
  castleWQS: boolean;
  castleBKS: boolean;
  castleBQS: boolean;
  enPassantFile: number;
  enPassantRank: number;
  fullMoveClock: number;
}

const ChessBoard: React.FC<ChessBoardProps> = ({
  boardVariables,
  chessImages,
}) => {
  useEffect(() => {
    console.log(boardVariables);
  });

  return (
    <div style={{ alignItems: "center", justifyContent: "center", flexWrap: 'wrap' }}>
      <img
        src={"assets/chessboard.png"}
        style={{
          height: "40em",
          position: "absolute",
          zIndex: -1,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      ></img>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 0fr)",
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
        }}
      >
        {boardVariables.boardState.map((row) => {
          return row.map((piece) => {
            let idx = mapPieceToSpriteSheetIndex(piece);
            console.log(idx);
            return (
              <div>
                {idx >= 0 ? 
                <img
                  src={chessImages.chessPieces[idx]}
                  style={{
                    height: 70,
                    alignItems: 'center',
                    justifyContent: 'center',
                    aspectRatio: 1,
                    border: '2px solid black'
                  }}
                /> : <div style={{height: 70, aspectRatio: 1}}/>
                }
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};

export const parseFEN = (fenString: string): ChessBoardVariables => {
  let boardState: number[][] = Array.from({ length: 8 }, () =>
    Array(8).fill(0)
  );
  let fenParts: string[] = fenString.split(" ");
  let pos: string = fenParts[0];

  // Parse position
  let rank: number = 0;
  let file: number = 0;

  for (var char of pos) {
    if (char == "/") {
      rank++;
      file = 0;
    } else if (Number(char)) {
      file += Number(char);
    } else {
      boardState[rank][file] = mapFenCharToPiece(char);
      file++;
    }
  }

  let colorToMove: number = fenParts[1][0] == "w" ? WHITE : BLACK;
  let castleWKS: boolean = fenParts[2].includes("K");
  let castleWQS: boolean = fenParts[2].includes("K");
  let castleBKS: boolean = fenParts[2].includes("K");
  let castleBQS: boolean = fenParts[2].includes("K");
  let fullMoveClock = 0;
  let enPassantFile = 0;
  let enPassantRank = 0;
  if (fenParts[3] != "-") {
    enPassantFile = fenParts[3].charAt(0).charCodeAt(0) - "a".charCodeAt(0);
    enPassantRank = fenParts[3].charAt(1).charCodeAt(0) - "0".charCodeAt(0);
  }
  if (fenParts.length == 6) {
    fullMoveClock = Number(fenParts[5]);
  }

  return {
    boardState: boardState,
    colorToMove: colorToMove,
    castleWKS: castleWKS,
    castleWQS: castleWQS,
    castleBKS: castleBKS,
    castleBQS: castleBQS,
    enPassantFile: enPassantFile,
    enPassantRank: enPassantRank,
    fullMoveClock: fullMoveClock,
  };
};

export default ChessBoard;
