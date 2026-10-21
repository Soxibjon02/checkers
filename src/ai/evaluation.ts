import type { Board, Player } from '../types/game';
import { generateLegalMoves } from '../engine/moves';

const MAN_VALUE = 100;
const KING_VALUE = 320;
const CENTER_BONUS = 15;
const BACK_RANK_BONUS = 20;

// Central squares in 8x8 checkers
const CENTER_SQUARES = new Set([
  '3,2', '3,4', // row 3, col 2 & 4
  '4,3', '4,5', // row 4, col 3 & 5
  '2,3', '2,5',
  '5,2', '5,4',
]);

/**
 * Positive score favors 'player', negative score favors opponent.
 */
export function evaluateBoard(board: Board, player: Player): number {
  const opponent: Player = player === 'red' ? 'black' : 'red';

  let materialScore = 0;
  let positionalScore = 0;
  let backRankScore = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const isCurrent = piece.player === player;
      const sign = isCurrent ? 1 : -1;

      // 1. Material
      const value = piece.type === 'king' ? KING_VALUE : MAN_VALUE;
      materialScore += sign * value;

      // 2. Center control
      if (CENTER_SQUARES.has(`${r},${c}`)) {
        positionalScore += sign * CENTER_BONUS;
      }

      // 3. Men advancement towards promotion
      if (piece.type === 'man') {
        const advancement = piece.player === 'red' ? 7 - r : r;
        positionalScore += sign * (advancement * 5);

        // 4. Back rank anchor defense
        if (piece.player === 'red' && r === 7) {
          backRankScore += sign * BACK_RANK_BONUS;
        } else if (piece.player === 'black' && r === 0) {
          backRankScore += sign * BACK_RANK_BONUS;
        }
      }
    }
  }

  // 5. Mobility bonus
  const playerMoves = generateLegalMoves(board, player);
  const opponentMoves = generateLegalMoves(board, opponent);
  const mobilityScore = (playerMoves.length - opponentMoves.length) * 4;

  return materialScore + positionalScore + backRankScore + mobilityScore;
}
