import type { Board, Move, Piece } from '../types/game';
import { cloneBoard } from './board';

export interface ApplyMoveResult {
  newBoard: Board;
  movedPiece: Piece;
}

export function applyMove(board: Board, move: Move): ApplyMoveResult {
  const newBoard = cloneBoard(board);
  const originalPiece = newBoard[move.from.row][move.from.col];

  if (!originalPiece) {
    throw new Error(`applyMove error: No piece found at (${move.from.row}, ${move.from.col})`);
  }

  // Remove all captured pieces
  for (const captured of move.capturedPieces) {
    newBoard[captured.position.row][captured.position.col] = null;
  }

  // Remove the piece from the starting position
  newBoard[move.from.row][move.from.col] = null;

  // Place the piece at the destination
  const finalPiece: Piece = {
    ...originalPiece,
    type: move.promotedToKing ? 'king' : originalPiece.type,
  };

  newBoard[move.to.row][move.to.col] = finalPiece;

  return {
    newBoard,
    movedPiece: finalPiece,
  };
}
