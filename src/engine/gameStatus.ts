import type { Board, DrawReason, GameStatus, Player } from '../types/game';
import { countPieces, hashBoard } from './board';
import { generateLegalMoves } from './moves';

export interface GameStatusResult {
  status: GameStatus;
  winner: Player | null;
  drawReason?: DrawReason;
}

export const MAX_HALF_MOVES_WITHOUT_CAPTURE_OR_MAN = 30; // 15 full moves by each player with kings only

/**
 * Checks if the current state satisfies any draw conditions:
 * 1. Threefold repetition: The same position occurred 3 times.
 * 2. 30-ply rule: 30 consecutive half-moves without captures or man moves (only kings moving).
 */
export function checkDraw(
  board: Board,
  currentPlayer: Player,
  positionCounts: Record<string, number>,
  halfMoveClock: number
): { isDraw: boolean; reason?: DrawReason } {
  const currentHash = hashBoard(board, currentPlayer);
  if ((positionCounts[currentHash] ?? 0) >= 3) {
    return {
      isDraw: true,
      reason: 'threefold-repetition',
    };
  }

  if (halfMoveClock >= MAX_HALF_MOVES_WITHOUT_CAPTURE_OR_MAN) {
    return {
      isDraw: true,
      reason: 'thirty-move-rule',
    };
  }

  return { isDraw: false };
}

/**
 * Determines the game status for the player whose turn it currently is.
 */
export function evaluateGameStatus(
  board: Board,
  currentPlayer: Player,
  positionCounts: Record<string, number> = {},
  halfMoveClock = 0
): GameStatusResult {
  const counts = countPieces(board);
  const opponent: Player = currentPlayer === 'red' ? 'black' : 'red';

  // 1. Victory by eliminating all opponent pieces
  if (counts.totalBlack === 0) {
    return { status: 'red-won', winner: 'red' };
  }
  if (counts.totalRed === 0) {
    return { status: 'black-won', winner: 'black' };
  }

  // 2. Victory if current player has no legal moves (loss by blockade)
  const legalMoves = generateLegalMoves(board, currentPlayer);
  if (legalMoves.length === 0) {
    return {
      status: opponent === 'red' ? 'red-won' : 'black-won',
      winner: opponent,
    };
  }

  // 3. Draw evaluation
  const drawCheck = checkDraw(board, currentPlayer, positionCounts, halfMoveClock);
  if (drawCheck.isDraw) {
    return {
      status: 'draw',
      winner: null,
      drawReason: drawCheck.reason,
    };
  }

  return {
    status: 'playing',
    winner: null,
  };
}
