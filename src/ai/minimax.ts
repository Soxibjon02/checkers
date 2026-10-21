import type { Board, Move, Player } from '../types/game';
import { applyMove } from '../engine/applyMove';
import { generateLegalMoves } from '../engine/moves';
import { evaluateBoard } from './evaluation';

export interface MinimaxResult {
  bestMove: Move | null;
  score: number;
  nodesEvaluated: number;
}

// Order moves to evaluate captures and promotions first for maximum alpha-beta pruning
function orderMoves(moves: Move[]): Move[] {
  return [...moves].sort((a, b) => {
    if (a.isCapture && !b.isCapture) return -1;
    if (!a.isCapture && b.isCapture) return 1;
    if (a.capturedPieces.length !== b.capturedPieces.length) {
      return b.capturedPieces.length - a.capturedPieces.length;
    }
    if (a.promotedToKing && !b.promotedToKing) return -1;
    if (!a.promotedToKing && b.promotedToKing) return 1;
    return 0;
  });
}

function minimaxInternal(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  rootPlayer: Player,
  activePlayer: Player,
  startTime: number,
  timeLimitMs: number,
  counter: { nodes: number }
): number {
  counter.nodes++;

  // Check timeout occasionally
  if (counter.nodes % 256 === 0 && performance.now() - startTime > timeLimitMs) {
    return evaluateBoard(board, rootPlayer);
  }

  const legalMoves = generateLegalMoves(board, activePlayer);

  // Terminal state: No moves available -> Loss for activePlayer
  if (legalMoves.length === 0) {
    return isMaximizing ? -20000 + (10 - depth) : 20000 - (10 - depth);
  }

  // Base depth reached
  if (depth <= 0) {
    return evaluateBoard(board, rootPlayer);
  }

  const nextPlayer: Player = activePlayer === 'red' ? 'black' : 'red';
  const orderedMoves = orderMoves(legalMoves);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of orderedMoves) {
      const { newBoard } = applyMove(board, move);
      const evaluation = minimaxInternal(
        newBoard,
        depth - 1,
        alpha,
        beta,
        false,
        rootPlayer,
        nextPlayer,
        startTime,
        timeLimitMs,
        counter
      );
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) {
        break; // Beta cutoff
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of orderedMoves) {
      const { newBoard } = applyMove(board, move);
      const evaluation = minimaxInternal(
        newBoard,
        depth - 1,
        alpha,
        beta,
        true,
        rootPlayer,
        nextPlayer,
        startTime,
        timeLimitMs,
        counter
      );
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) {
        break; // Alpha cutoff
      }
    }
    return minEval;
  }
}

export function findBestMove(
  board: Board,
  player: Player,
  depth: number,
  timeLimitMs = 800
): MinimaxResult {
  const legalMoves = generateLegalMoves(board, player);
  if (legalMoves.length === 0) {
    return { bestMove: null, score: -20000, nodesEvaluated: 0 };
  }

  if (legalMoves.length === 1) {
    return { bestMove: legalMoves[0], score: 0, nodesEvaluated: 1 };
  }

  const orderedMoves = orderMoves(legalMoves);
  const startTime = performance.now();
  const counter = { nodes: 0 };
  let bestMove: Move = orderedMoves[0];
  let bestScore = -Infinity;
  let alpha = -Infinity;
  const beta = Infinity;
  const nextPlayer: Player = player === 'red' ? 'black' : 'red';

  for (const move of orderedMoves) {
    const { newBoard } = applyMove(board, move);
    const score = minimaxInternal(
      newBoard,
      depth - 1,
      alpha,
      beta,
      false,
      player,
      nextPlayer,
      startTime,
      timeLimitMs,
      counter
    );

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
    alpha = Math.max(alpha, score);

    if (performance.now() - startTime > timeLimitMs) {
      break;
    }
  }

  return {
    bestMove,
    score: bestScore,
    nodesEvaluated: counter.nodes,
  };
}
