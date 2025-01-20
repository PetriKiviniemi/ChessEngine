import React, { useEffect, useRef, useState } from "react";
import {
  BLACK,
  boardToFenString,
  ChessBoardVariables,
  ChessImages,
  EMPTY,
  legalMovesToMap,
  mapPieceToSpriteSheetIndex,
  moveToCoordinates,
  parseFEN,
  WHITE,
} from "./ChessboardUtils";
import { fetchMoveData } from "./Api";

interface ChessBoardProps {
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
  justifyContent: "center",
  alignContent: "center",
};

interface Position {
  x: number;
  y: number;
}

const defaultFEN: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";


const ChessBoard: React.FC<ChessBoardProps> = ({
  chessImages,
}) => {
  const [legalMoves, setLegalMoves] = useState<Map<number, number[]>>();
  const [legalMovesToRender, setLegalMovesToRender] = useState<
    Map<number, boolean> | undefined
  >(undefined);
  const [bestMove, setBestMove] = useState<string>("");
  const [draggedPiece, setDraggedPiece] = useState<number | null>();
  const [dragPosition, setDragPosition] = useState<Position>({ x: 0, y: 0 });
  const [boardVariables, setBoardVariables] =
    React.useState<ChessBoardVariables>(() => parseFEN(defaultFEN));
  const boardRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggedPiece) {
        const boardRect = boardRef.current?.getBoundingClientRect();
        if (boardRect) {
          const x = e.clientX - boardRect.left;
          const y = e.clientY - boardRect.top;
          setDragPosition({
            x: x,
            y: y,
          });
        }
      }
    };

    if (draggedPiece) {
      document.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [draggedPiece]);


  // Game logic
  useEffect(() => {
    console.log(boardVariables)
    const boardFen = boardToFenString(boardVariables);
    fetchMoveData(boardFen).then((res) => {
      if (res) {
        setBestMove(res.bestMove);
        setLegalMoves(legalMovesToMap(res.legalMoves));
      }
      console.log("HERE")

      // Game logic here
      if(boardVariables.colorToMove == BLACK && res?.bestMove)
      {
        // Move piece
        const coords = moveToCoordinates(res.bestMove)
        const oldRow = Math.floor(coords[0] / 8);
        const oldCol = coords[0] % 8;
        const newRow = Math.floor(coords[1] / 8);
        const newCol = coords[1] % 8;

        const oldPieceType = boardVariables.boardState[oldRow][oldCol];
        let updatedBoard = boardVariables.boardState;
        updatedBoard[newRow][newCol] = oldPieceType;
        updatedBoard[oldRow][oldCol] = EMPTY;
        setBoardVariables({...boardVariables, boardState: updatedBoard, colorToMove: WHITE})
      }
    });


    // If black to move, move the piece NN has suggested
  }, [boardVariables]);

  const handleDragStart =
    (row: number, col: number) => (e: React.MouseEvent) => {
      e.preventDefault();
      setDraggedPiece(row * 8 + col);

      // Set initial drag position
      const boardRect = boardRef.current?.getBoundingClientRect();
      if (boardRect) {
        setDragPosition({
          x: e.clientX - boardRect.left,
          y: e.clientY - boardRect.top,
        });
      }

      const movesToRender = new Map<number, boolean>();
      const moves = legalMoves?.get(row * 8 + col);
      if (moves) {
        for (const move of moves) {
          movesToRender.set(move, true);
        }
      }
      setLegalMovesToRender(movesToRender);
    };

  const handleDrop = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if(!draggedPiece) return;

    const boardRect = boardRef.current?.getBoundingClientRect();
    if(boardRect)
    {
      const x = e.clientX - boardRect.left;
      const y = e.clientY - boardRect.top;

      const squareSize = boardRect.width / 8;
      const row = Math.floor(y / squareSize);
      const col = Math.floor(x / squareSize)

      const targetSquare = row * 8 + col;
      if(legalMoves?.get(draggedPiece)?.includes(targetSquare))
      {
        const oldRow = Math.floor(draggedPiece / 8);
        const oldCol = draggedPiece % 8;
        const draggedPieceType = boardVariables.boardState[oldRow][oldCol];
        let updatedBoard = boardVariables.boardState;
        updatedBoard[row][col] = draggedPieceType;
        updatedBoard[oldRow][oldCol] = EMPTY;
        setBoardVariables({...boardVariables, boardState: updatedBoard, colorToMove: BLACK})
      }
    }
    setDraggedPiece(undefined);
    setLegalMovesToRender(undefined);
  };

  const renderChessPieces = (
    spriteIdx: number,
    rowIdx: number,
    colIdx: number
  ) => {
    const isPieceDragged =
      draggedPiece &&
      Math.floor(draggedPiece / 8) == rowIdx &&
      draggedPiece % 8 == colIdx;

    if (spriteIdx >= 0) {
      return (
        <div style={{ position: "relative" }}>
          {legalMovesToRender?.get(rowIdx * 8 + colIdx) ? (
            <div
              style={{
                position: "absolute",
                zIndex: 0,
                top: "50%",
                left: "50%",
                width: "auto", // Adjust the size of the circle
                height: "100%", // Same size as width for a perfect circle
                aspectRatio: 1,
                borderRadius: "50%", // Makes it circular
                border: "8px solid rgba(0,0,0,0.25)",
                boxSizing: "border-box",
                borderColor: "rgba(0,0,0,0.25)",
                transform: "translate(-50%, -50%)", // Centers the circle around the image
              }}
            />
          ) : undefined}
          <img
            src={chessImages.chessPieces[spriteIdx]}
            className={`select-none cursor-grab ${
              isPieceDragged ? "cursor-grabbing fixed" : ""
            }`}
            style={{
              ...ChessPieceStyle,
              position: isPieceDragged ? "fixed" : "static",
              left: isPieceDragged ? `${dragPosition.x}px` : "auto",
              top: isPieceDragged ? `${dragPosition.y}px` : "auto",
              zIndex: isPieceDragged ? 1000 : "auto",
              transform: isPieceDragged ? "translate(-50%, -50%)" : "none", // Center to cursor
              pointerEvents: "auto",
              userSelect: "none",
            }}
            onMouseDown={handleDragStart(rowIdx, colIdx)}
            onMouseUp={handleDrop}
            draggable={false}
          />
        </div>
      );
    } else if (legalMovesToRender?.get(rowIdx * 8 + colIdx)) {
      return (
        <div
          style={{
            width: 25,
            height: 25,
            borderRadius: "50%",
            backgroundColor: "rgba(0,0,0,0.25)",
          }}
        />
      );
    } else {
      return (
        <div style={ChessPieceStyle}/>
      );
    }
  };

  return (
    <div
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <div
        ref={boardRef}
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
          return row.map((piece, colIdx) => {
            let spriteIdx = mapPieceToSpriteSheetIndex(piece);
            return (
              <div
                style={
                  (colIdx + rowIdx) % 2 == 0
                    ? {
                        ...ChessPieceContainerStyle,
                        backgroundColor: "rgb(117, 149, 85)",
                      }
                    : {
                        ...ChessPieceContainerStyle,
                        backgroundColor: "rgb(237, 237, 209)",
                      }
                }
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
                  {renderChessPieces(spriteIdx, rowIdx, colIdx)}
                </div>
              </div>
            );
          });
        })}
      </div>
      <p style={{ fontSize: 24 }}>{boardToFenString(boardVariables)}</p>
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
