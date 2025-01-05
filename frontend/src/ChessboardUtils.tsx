export const EMPTY = 0;
export const WHITE = 8;
export const BLACK = 16;
export const PAWN = 1;
export const KNIGHT = 2;
export const BISHOP = 3;
export const ROOK = 4;
export const QUEEN = 5;
export const KING = 6;

export const mapPieceToSpriteSheetIndex = (piece: number): number => {
  let color = piece & (WHITE | BLACK);
  let col = 0;

  switch (piece & 0b111) {
    case PAWN:
      col = 3;
      break;
    case QUEEN:
      col = 4;
      break;
    case KING:
      col = 1;
      break;
    case BISHOP:
      col = 0;
      break;
    case KNIGHT:
      col = 2;
      break;
    case ROOK:
      col = 5;
      break;
    default:
      col = -1;
      break;
  }

  if (color == WHITE) col += 6;

  return col;
};

export const mapFenCharToPiece = (c: string): number => {
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

// We can add more things here if needed
export interface ChessImages {
  chessPieces: string[];
}

export interface BoardState {
  boardState: number[][];
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
  halfMoveClock: number;
  fullMoveClock: number;
}

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
  let halfMoveClock = 0;
  let enPassantFile = 0;
  let enPassantRank = 0;

  if (fenParts[3] != "-") {
    enPassantFile = fenParts[3].charAt(0).charCodeAt(0) - "a".charCodeAt(0);
    enPassantRank = fenParts[3].charAt(1).charCodeAt(0) - "0".charCodeAt(0);
  }

  halfMoveClock = Number(fenParts[4]);
  fullMoveClock = Number(fenParts[5]);

  return {
    boardState: boardState,
    colorToMove: colorToMove,
    castleWKS: castleWKS,
    castleWQS: castleWQS,
    castleBKS: castleBKS,
    castleBQS: castleBQS,
    enPassantFile: enPassantFile,
    enPassantRank: enPassantRank,
    halfMoveClock: halfMoveClock,
    fullMoveClock: fullMoveClock,
  };
};

export const mapPieceToFenChar = (piece: number): string => {
  const pieceType = piece & 0b111;
  const pieceColor = piece & (WHITE | BLACK);
  if (pieceColor == WHITE) {
    return "PNBRQK".charAt(pieceType - 1);
  } else {
    return "pnbrqk".charAt(pieceType - 1);
  }
};

export const boardToFenString = (bv: ChessBoardVariables): string => {
  let boardStateFenStr = "";
  for (let i = 0; i < 8; i++) {
    let emptyTiles = 0;
    for (let j = 0; j < 8; j++) {
      if (bv.boardState[i][j] != EMPTY) {
        if (emptyTiles > 0) boardStateFenStr += emptyTiles;
        emptyTiles = 0;
        boardStateFenStr += mapPieceToFenChar(bv.boardState[i][j]);
      } else if (j == 7) {
        emptyTiles += 1;
        boardStateFenStr += emptyTiles;
      } else {
        emptyTiles += 1;
      }
      // Increment the emptyTiles counter
    }
    if (i < 7) boardStateFenStr += "/";
  }

  boardStateFenStr += " ";
  boardStateFenStr += bv.colorToMove == 8 ? "w" : "b";
  boardStateFenStr += " ";
  if (!bv.castleWQS && !bv.castleWKS) boardStateFenStr += "-";
  boardStateFenStr += bv.castleWKS ? "K" : "";
  boardStateFenStr += bv.castleWQS ? "Q" : "";

  if (!bv.castleBQS && !bv.castleBKS) boardStateFenStr += "-";
  boardStateFenStr += bv.castleBKS ? "k" : "";
  boardStateFenStr += bv.castleBQS ? "q" : "";

  boardStateFenStr += " ";
  if (!bv.enPassantRank) boardStateFenStr += "-";
  else
    boardStateFenStr += mapPieceToFenChar(
      bv.boardState[bv.enPassantRank][bv.enPassantFile]
    );

  boardStateFenStr += " ";
  boardStateFenStr += bv.halfMoveClock;
  boardStateFenStr += " ";
  boardStateFenStr += bv.fullMoveClock;

  return boardStateFenStr;
};

export const legalMovesToMap = (
  legalMoves: string[]
): Map<number, number[]> => {
  let map = new Map<number, number[]>();

  const moveToCoordinates = (strCoords: string): number[] => {
    // Column (file) is based on 'a' to 'h'
    const fromCol = strCoords.charAt(0).charCodeAt(0) - "a".charCodeAt(0);
    const fromRow = 8 - parseInt(strCoords.charAt(1), 10);

    const toCol = strCoords.charAt(2).charCodeAt(0) - "a".charCodeAt(0);
    const toRow = 8 - parseInt(strCoords.charAt(3), 10);

    console.log(strCoords, fromRow, fromCol, toRow, toCol);

    return [fromRow * 8 + fromCol, toRow * 8 + toCol];
  };

  for (const move of legalMoves) {
    const coords = moveToCoordinates(move);

    if (!map.get(coords[0])) {
      map.set(coords[0], []);
    }
    map.get(coords[0])?.push(coords[1]);
  }

  return map;
};
