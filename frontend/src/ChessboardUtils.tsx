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
      color == BLACK ? col = 3 : col = 3 + 6;
      break;
    case QUEEN:
      color == BLACK ? col = 4 : col = 4 + 7;
      break;
    case KING:
      color == BLACK ? col = 1 : col = 1 + 7;
      break;
    case BISHOP:
      color == BLACK ? col = 0 : col = 7;
      break;
    case KNIGHT:
      color == BLACK ? col = 2 : col = 2 + 7;
      break;
    case ROOK:
      color == BLACK ? col = 5 : col = 5 + 7;
      break;
    default:
      col = -1;
      break;
  }

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
