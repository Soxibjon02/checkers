import React from 'react';
import type { Board, Move, Position } from '../../types/game';
import { BoardSquare } from './BoardSquare';

interface GameBoardProps {
  board: Board;
  theme: 'classic' | 'wood' | 'slate';
  selectedPos: Position | null;
  validMoves: Move[];
  lastMove: Move | null;
  mustCapture: boolean;
  onSquareClick: (pos: Position) => void;
}

const COL_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const ROW_NUMBERS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  theme,
  selectedPos,
  validMoves,
  lastMove,
  mustCapture,
  onSquareClick,
}) => {
  return (
    <div className={`board-wrapper board-theme-${theme}`}>
      {/* Top Coordinates */}
      <div className="coord-h-top">
        {COL_LETTERS.map((col) => (
          <span key={`top-${col}`}>{col}</span>
        ))}
      </div>

      {/* Left Coordinates */}
      <div className="coord-v-left">
        {ROW_NUMBERS.map((row) => (
          <span key={`left-${row}`}>{row}</span>
        ))}
      </div>

      {/* 8x8 Grid */}
      <div className="checker-board" role="grid" aria-label="8 by 8 Checkers Board">
        {board.map((rowArr, r) =>
          rowArr.map((piece, c) => {
            const isSelected = selectedPos?.row === r && selectedPos?.col === c;
            const targetMove = validMoves.find((m) => m.to.row === r && m.to.col === c);
            const isValidTarget = Boolean(targetMove);

            const isLastMove = Boolean(
              lastMove &&
                ((lastMove.from.row === r && lastMove.from.col === c) ||
                  (lastMove.to.row === r && lastMove.to.col === c))
            );

            // Piece that has mandatory captures available
            const isCaptureWarning = Boolean(
              mustCapture &&
                piece &&
                !isSelected &&
                validMoves.length === 0 &&
                piece.player === piece.player
            );

            return (
              <BoardSquare
                key={`${r}-${c}`}
                row={r}
                col={c}
                piece={piece}
                isSelected={isSelected}
                isValidTarget={isValidTarget}
                isLastMove={isLastMove}
                isCaptureWarning={isCaptureWarning}
                targetMove={targetMove}
                onSquareClick={onSquareClick}
              />
            );
          })
        )}
      </div>

      {/* Right Coordinates */}
      <div className="coord-v-right">
        {ROW_NUMBERS.map((row) => (
          <span key={`right-${row}`}>{row}</span>
        ))}
      </div>

      {/* Bottom Coordinates */}
      <div className="coord-h-bottom">
        {COL_LETTERS.map((col) => (
          <span key={`bottom-${col}`}>{col}</span>
        ))}
      </div>
    </div>
  );
};
