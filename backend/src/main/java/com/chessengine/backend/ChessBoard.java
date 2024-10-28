package com.chessengine.backend;

import java.util.List;

public class ChessBoard {

    // Current board state
    private int[][] board;
    private int colorToMove = WHITE;
    // NOTE:: Could be made into a bitmap in necessary
    private boolean castleWKS = false;
    private boolean castleWQS = false;
    private boolean castleBKS = false;
    private boolean castleBQS = false;

    private int enpassantRank = 0;
    private int enpassantFile = 0;

    private int halfMoveClock = 0; // NOTE:: Not implemented
    private int fullMoveClock = 0;

    static final int EMPTY = 0;
    static final int WHITE = 8;
    static final int BLACK = 16;
    static final int PAWN = 1;
    static final int KNIGHT = 2;
    static final int BISHOP = 3;
    static final int ROOK = 4;
    static final int QUEEN = 5;
    static final int KING = 6;

    public static int mapFenCharToPiece(char c) {
        int piece = switch (Character.toLowerCase(c)) {
            case 'p' -> ROOK;
            case 'n' -> KNIGHT;
            case 'b' -> BISHOP;
            case 'r' -> ROOK;
            case 'q' -> QUEEN;
            case 'k' -> KING;
            default -> EMPTY;
        };

        if (piece != 0)
            piece |= Character.isUpperCase(c) ? WHITE : BLACK;

        return piece;
    }

    public ChessBoard() {
        board = new int[8][8];
    }

    public ChessBoard(String fen) {
        board = new int[8][8];
        // We need board state representation
        parseFEN(fen);
    }

    public void parseFEN(String fen) {
        String[] fenParts = fen.split(" ");
        String position = fenParts[0];

        // Init empty board
        for (int i = 0; i < 8; i++) {
            for (int j = 0; j < 8; j++) {
                board[i][j] = 0;
            }
        }

        // Parse position
        int rank = 0; // Row
        int file = 0; // Tile/Column
        for (char c : position.toCharArray()) {
            if (c == '/') {
                rank++;
                file = 0;
            } else if (Character.isDigit(c)) {
                file += Character.getNumericValue(c);
            } else {
                board[rank][file] = mapFenCharToPiece(c);
                file++;
            }
        }

        // Parse active color
        colorToMove = fenParts[1].toCharArray()[0] == 'w' ? WHITE : BLACK;

        // Parse castling rights
        castleWKS = fenParts[2].contains("K");
        castleWQS = fenParts[2].contains("Q");
        castleBKS = fenParts[2].contains("k");
        castleBQS = fenParts[2].contains("q");

        // Enpassant
        if (!fenParts[3].equals("-")) {
            enpassantFile = fenParts[3].charAt(0) - 'a';
            enpassantRank = (fenParts[3].charAt(1) - '0');
        }

        // Number of full moves (Optional)
        if (fenParts.length == 6)
            fullMoveClock = Integer.parseInt(fenParts[5]);
    }

    /*
     * @rank current piece rank (row)
     * 
     * @file current piece file (column)
     * 
     * @moves List of moves, as FEN strings. Func should append to this list
     */
    private void addPawnMoves(int rank, int file, List<String> moves) {

    }

    /*
     * @rank current piece rank (row)
     * 
     * @file current piece file (column)
     * 
     * @directions 2d int array of the all possible directions the piece can slide
     * to (e.g., rook, bishop, queen are different)
     * 
     * @moves List of moves, as FEN strings. Func should append to this list
     */
    private void addSlidingMoves(int rank, int file, int[][] directions, List<String> moves) {

        // Iterate all the possible sliding directions for the piece
        for (int i = 0; i < directions.length; i++) {
            int x_dir = directions[i][0];
            int y_dir = directions[i][1];
            int cur_rank = rank;
            int cur_file = file;
            int piece = board[rank][file];
            int pieceColor = piece & (WHITE | BLACK);
            // While we are not out of ounds
            while (!isOutOfBounds(cur_rank, cur_file)) {
                cur_rank += x_dir;
                cur_file += y_dir;
                int targetSqr = board[cur_rank][cur_file];

                if(targetSqr == EMPTY)
                {
                    moves.add(squareToAlgebraic(cur_file, cur_rank));
                    continue;
                }

                // Check if enemy piece and capturable
                if (isEnemyPiece(piece, pieceColor)) {
                    moves.add(squareToAlgebraic(file, rank) + squareToAlgebraic(cur_file, cur_rank));
                    break;
                }
                break;
            }
        }
    }

private boolean isEnemyPiece(int piece, int attackerColor) {
    // First check if it's an opposing color piece
    boolean isEnemy = (piece != EMPTY) && 
                     ((piece & (WHITE | BLACK)) != attackerColor);
    
    // If it's an enemy piece, make sure it's not a king
    if (isEnemy) {
        return (piece & 7) != KING;  // & 7 gets piece type
    }
    return false;
}

    private String squareToAlgebraic(int file, int rank) {
        if (file < 0 || file > 7 || rank < 0 || rank > 7) {
            throw new IllegalArgumentException("Invalid square: " + file + "," + rank);
        }
        return "" + (char) ('a' + file) + (8 - rank);
    }

    /*
     * @rank current piece rank (row)
     * 
     * @file current piece file (column)
     * 
     * @moves List of moves, as FEN strings. Func should append to this list
     */
    private void addKnightMoves(int rank, int file, List<String> moves) {

    }

    private boolean isEnemyPiece(int piece) {
        // CHECK IF ITS WHITE MOVE
        // return piece != " " && Character.isUpperCase(piece) !=
        return false;
    }

    private boolean isOutOfBounds(int rank, int file) {
        return false;
    }

    public void hello() {
        System.out.println("Hello ChessBoard");
    }
}
