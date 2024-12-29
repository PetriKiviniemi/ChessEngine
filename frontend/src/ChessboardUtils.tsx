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

  if(color == WHITE)
    col += 6;

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
