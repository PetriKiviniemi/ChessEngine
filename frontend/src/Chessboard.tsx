import React, { useRef, useEffect } from "react";

interface PiecePosition {
  piece: number;
  x: number;
  y: number;
}

const EMPTY = 0;
const WHITE = 8;
const BLACK = 16;
const PAWN = 1;
const KNIGHT = 2;
const BISHOP = 3;
const ROOK = 4;
const QUEEN = 5;
const KING = 6;

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

const mapPieceToSpriteSheetIndex = (piece: number): number[] => {
  let color = piece & (WHITE | BLACK);
  let row = 0;
  let col = 0;
  if (color == BLACK) row = 1;

  switch (piece & 0b111) {
    case PAWN:
      col = 0;
      break;
    case QUEEN:
      col = 1;
      break;
    case KING:
      col = 2;
      break;
    case BISHOP:
      col = 3;
      break;
    case KNIGHT:
      col = 4;
      break;
    case ROOK:
      col = 5;
      break;
    default:
      col = 0;
      break;
  }

  return [row, col]
};

const ChessBoard: React.FC<ChessBoardProps> = ({
  boardVariables,
  chessImages,
}) => {
  useEffect(() => {
    console.log(boardVariables);
  });
  return (
    <div>
      <img src={"assets/chessboard.png"} style={{ height: "40em" }}></img>
      {
        boardVariables.boardState.map((row) => {
          return row.map((piece) => {
            let idx = mapPieceToSpriteSheetIndex(piece);
            return <div>{idx[0]}</div>
            return <img src={chessImages.chessPieces[idx[0]][idx[1]]} style={{height: 100, aspectRatio: 1}}/>
          })
        })
      }
    </div>
  );
};

const mapFenCharToPiece = (c: string): number => {
  let piece = EMPTY;
  switch (c.toLowerCase()) {
    case "p":
      piece = PAWN;
      break;
    case "n":
      piece = KNIGHT;
      break;
    case "b":
      piece = BISHOP;
      break;
    case "r":
      piece = ROOK;
      break;
    case "q":
      piece = QUEEN;
      break;
    case "k":
      piece = KING;
      break;
    default:
      piece = EMPTY;
      break;
  }

  if (piece !== 0) {
    piece |= c.toUpperCase() === c ? WHITE : BLACK;
  }

  return piece;
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
