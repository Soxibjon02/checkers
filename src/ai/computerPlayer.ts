import type { Board, Difficulty, Move, Player } from '../types/game';
import { generateLegalMoves } from '../engine/moves';
import { findBestMove } from './minimax';

export function chooseEasyMove(board: Board, player: Player): Move | null {
  const legalMoves = generateLegalMoves(board, player);
  if (legalMoves.length === 0) return null;

  // If there are captures, prefer moves that capture more pieces
  const captures = legalMoves.filter((m) => m.isCapture);
  if (captures.length > 0) {
    captures.sort((a, b) => b.capturedPieces.length - a.capturedPieces.length);
    // 75% choose the best capture, 25% choose any capture
    if (Math.random() < 0.75) {
      return captures[0];
    }
    return captures[Math.floor(Math.random() * captures.length)];
  }

  // For simple moves, 65% pick random, 35% pick move advancing towards center
  if (Math.random() < 0.65) {
    return legalMoves[Math.floor(Math.random() * legalMoves.length)];
  }

  // Slight preference for moves towards the center columns (2, 3, 4, 5)
  legalMoves.sort((a, b) => {
    const distA = Math.abs(a.to.col - 3.5);
    const distB = Math.abs(b.to.col - 3.5);
    return distA - distB;
  });

  return legalMoves[0];
}

export function chooseMediumMove(board: Board, player: Player): Move | null {
  // Medium uses minimax depth 2
  const result = findBestMove(board, player, 2, 300);
  return result.bestMove;
}

export function chooseHardMove(board: Board, player: Player): Move | null {
  // Hard uses minimax depth 5 with alpha-beta pruning and 700ms budget
  const result = findBestMove(board, player, 5, 700);
  return result.bestMove;
}

export function computeComputerMove(
  board: Board,
  player: Player,
  difficulty: Difficulty
): Move | null {
  switch (difficulty) {
    case 'easy':
      return chooseEasyMove(board, player);
    case 'medium':
      return chooseMediumMove(board, player);
    case 'hard':
    default:
      return chooseHardMove(board, player);
  }
}

/**
 * Asynchronous computer move execution with a realistic thinking delay
 * and UI responsiveness.
 */
export async function getComputerMoveAsync(
  board: Board,
  player: Player,
  difficulty: Difficulty,
  minDelayMs = 400
): Promise<Move | null> {
  const start = performance.now();
  // Allow UI to render the "Computer is thinking" state first
  await new Promise((resolve) => setTimeout(resolve, 50));

  const move = computeComputerMove(board, player, difficulty);

  const elapsed = performance.now() - start;
  const remaining = Math.max(0, minDelayMs - elapsed);
  if (remaining > 0) {
    await new Promise((resolve) => setTimeout(resolve, remaining));
  }

  return move;
}
