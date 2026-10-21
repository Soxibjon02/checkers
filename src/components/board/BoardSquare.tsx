import React from 'react';
import type { Move, Piece, Position } from '../../types/game';
import { isPlayableSquare } from '../../engine/board';
import { posToNotation } from '../../engine/notation';
import { CheckerPiece } from './CheckerPiece';

interface BoardSquareProps {
  row: number;
  col: number;
  piece: Piece | null;
  isSelected: boolean;
  isValidTarget: boolean;
  isLastMove: boolean;
  isCaptureWarning: boolean;
  targetMove?: Move;
  onSquareClick: (pos: Position) => void;
}

export const BoardSquare: React.FC<BoardSquareProps> = ({
  row,
  col,
  piece,
  isSelected,
  isValidTarget,
  isLastMove,
  isCaptureWarning,
  targetMove,
  onSquareClick,
}) => {
  const isDark = isPlayableSquare(row, col);
  const notation = posToNotation({ row, col });

  const handleClick = () => {
    if (isDark) {
      onSquareClick({ row, col });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && isDark) {
      e.preventDefault();
      onSquareClick({ row, col });
    }
  };

  const squareClasses = [
    'board-square',
    isDark ? 'square-dark' : 'square-light',
    isSelected ? 'square-selected' : '',
    isLastMove ? 'square-last-move' : '',
    isCaptureWarning ? 'square-capture-warning' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      role="gridcell"
      tabIndex={isDark ? 0 : -1}
      aria-label={`Square ${notation}${piece ? `, occupied by ${piece.player} ${piece.type}` : ''}`}
      className={squareClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* Target indicator for valid moves */}
      {isValidTarget && (
        <div
          className={targetMove?.isCapture ? 'target-ring' : 'target-dot'}
          aria-hidden="true"
        />
      )}

      {/* Piece */}
      {piece && (
        <CheckerPiece
          piece={piece}
          isSelected={isSelected}
        />
      )}
    </div>
  );
};
