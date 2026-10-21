import type { Board, Move, Player, Position } from '../types/game';
import { isInsideBoard, isKingPromotionRow, isPlayableSquare } from './board';
import { generateAllCaptures } from './captures';
import { formatMoveNotation } from './notation';

const KING_DIRECTIONS = [
  { dr: -1, dc: -1 },
  { dr: -1, dc: 1 },
  { dr: 1, dc: -1 },
  { dr: 1, dc: 1 },
];

export function generateSimpleMovesForPiece(board: Board, pos: Position): Move[] {
  const piece = board[pos.row][pos.col];
  if (!piece) return [];

  const moves: Move[] = [];

  if (piece.type === 'man') {
    // Red moves forward (dr = -1), Black moves forward (dr = +1)
    const forwardDr = piece.player === 'red' ? -1 : 1;
    for (const dc of [-1, 1]) {
      const destRow = pos.row + forwardDr;
      const destCol = pos.col + dc;

      if (isPlayableSquare(destRow, destCol) && board[destRow][destCol] === null) {
        const destPos = { row: destRow, col: destCol };
        const promoted = isKingPromotionRow(piece.player, destRow);
        moves.push({
          from: pos,
          to: destPos,
          steps: [
            {
              from: pos,
              to: destPos,
              promotedToKing: promoted,
            },
          ],
          capturedPieces: [],
          isCapture: false,
          promotedToKing: promoted,
          notation: formatMoveNotation(pos, destPos, [destPos], false),
        });
      }
    }
  } else {
    // King moves: Flying king slides along any diagonal
    for (const { dr, dc } of KING_DIRECTIONS) {
      let r = pos.row + dr;
      let c = pos.col + dc;

      while (isInsideBoard(r, c) && board[r][c] === null) {
        const destPos = { row: r, col: c };
        moves.push({
          from: pos,
          to: destPos,
          steps: [
            {
              from: pos,
              to: destPos,
              promotedToKing: false,
            },
          ],
          capturedPieces: [],
          isCapture: false,
          promotedToKing: false,
          notation: formatMoveNotation(pos, destPos, [destPos], false),
        });
        r += dr;
        c += dc;
      }
    }
  }

  return moves;
}

export function generateAllSimpleMoves(board: Board, player: Player): Move[] {
  const moves: Move[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.player === player) {
        moves.push(...generateSimpleMovesForPiece(board, { row: r, col: c }));
      }
    }
  }
  return moves;
}

// Generate all strictly legal moves for the current player
// Mandatory captures rule: If any capture exists, only captures are allowed.
export function generateLegalMoves(board: Board, player: Player): Move[] {
  const captures = generateAllCaptures(board, player);
  if (captures.length > 0) {
    return captures;
  }
  return generateAllSimpleMoves(board, player);
}

// Generate legal moves for a specific piece, honoring mandatory captures
export function getLegalMovesForPiece(
  board: Board,
  pos: Position,
  allLegalMoves?: Move[]
): Move[] {
  const piece = board[pos.row][pos.col];
  if (!piece) return [];

  const legalMoves = allLegalMoves ?? generateLegalMoves(board, piece.player);
  return legalMoves.filter(
    (m) => m.from.row === pos.row && m.from.col === pos.col
  );
}

// Check if a move is legal
export function isMoveLegal(
  board: Board,
  player: Player,
  from: Position,
  to: Position
): Move | null {
  const legalMoves = generateLegalMoves(board, player);
  return (
    legalMoves.find(
      (m) =>
        m.from.row === from.row &&
        m.from.col === from.col &&
        m.to.row === to.row &&
        m.to.col === to.col
    ) ?? null
  );
}
