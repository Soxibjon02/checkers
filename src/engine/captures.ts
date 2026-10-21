import type { Board, Move, MoveStep, Piece, Player, Position } from '../types/game';
import { isInsideBoard, isKingPromotionRow, isPlayableSquare } from './board';
import { formatMoveNotation } from './notation';

interface CaptureContext {
  board: Board;
  player: Player;
  startPos: Position;
  initialPiece: Piece;
}

const DIRECTIONS = [
  { dr: -1, dc: -1 },
  { dr: -1, dc: 1 },
  { dr: 1, dc: -1 },
  { dr: 1, dc: 1 },
];

function isPosEqual(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}

function isAlreadyCaptured(captured: { position: Position; piece: Piece }[], pos: Position): boolean {
  return captured.some((c) => isPosEqual(c.position, pos));
}

// Check if a square is effectively empty during a multi-jump sequence
function isSquareEmpty(
  board: Board,
  pos: Position,
  startPos: Position,
  captured: { position: Position; piece: Piece }[]
): boolean {
  if (!isPlayableSquare(pos.row, pos.col)) return false;
  // If it's the starting square of this move, it is empty because the piece has moved
  if (isPosEqual(pos, startPos)) return true;
  // If there's an already captured piece, the square is NOT empty according to Turkish strike
  if (isAlreadyCaptured(captured, pos)) return false;
  return board[pos.row][pos.col] === null;
}

// Find all capture steps possible from a given position
function findNextCaptureSteps(
  ctx: CaptureContext,
  currentPos: Position,
  isKing: boolean,
  capturedSoFar: { position: Position; piece: Piece }[]
): { step: MoveStep; nextIsKing: boolean }[] {
  const steps: { step: MoveStep; nextIsKing: boolean }[] = [];
  const opponent: Player = ctx.player === 'red' ? 'black' : 'red';

  if (!isKing) {
    // Man capture: 1 step diagonally in any of the 4 directions
    for (const { dr, dc } of DIRECTIONS) {
      const midRow = currentPos.row + dr;
      const midCol = currentPos.col + dc;
      const destRow = currentPos.row + 2 * dr;
      const destCol = currentPos.col + 2 * dc;

      if (!isInsideBoard(destRow, destCol)) continue;

      const midPiece = ctx.board[midRow][midCol];
      if (
        midPiece &&
        midPiece.player === opponent &&
        !isAlreadyCaptured(capturedSoFar, { row: midRow, col: midCol })
      ) {
        const destPos = { row: destRow, col: destCol };
        if (isSquareEmpty(ctx.board, destPos, ctx.startPos, capturedSoFar)) {
          const promoted = isKingPromotionRow(ctx.player, destRow);
          steps.push({
            step: {
              from: currentPos,
              to: destPos,
              captured: {
                position: { row: midRow, col: midCol },
                piece: midPiece,
              },
              promotedToKing: promoted,
            },
            nextIsKing: promoted,
          });
        }
      }
    }
  } else {
    // King capture: Flying king
    for (const { dr, dc } of DIRECTIONS) {
      let r = currentPos.row + dr;
      let c = currentPos.col + dc;
      let jumpedEnemy: { position: Position; piece: Piece } | null = null;

      while (isInsideBoard(r, c)) {
        const pos = { row: r, col: c };
        const piece = isPosEqual(pos, ctx.startPos) ? null : ctx.board[r][c];

        if (!jumpedEnemy) {
          if (!piece) {
            // Empty square before finding an enemy piece - keep looking
            r += dr;
            c += dc;
            continue;
          } else if (piece.player === ctx.player) {
            // Blocked by friendly piece
            break;
          } else {
            // Found enemy piece
            if (isAlreadyCaptured(capturedSoFar, pos)) {
              // Cannot jump the same piece twice
              break;
            }
            jumpedEnemy = { position: pos, piece };
            r += dr;
            c += dc;
            continue;
          }
        } else {
          // We have jumped an enemy piece; now looking for valid landing squares
          if (piece !== null) {
            // Blocked by another piece beyond the jumped enemy
            break;
          }
          // Empty landing square
          if (isSquareEmpty(ctx.board, pos, ctx.startPos, capturedSoFar)) {
            steps.push({
              step: {
                from: currentPos,
                to: pos,
                captured: jumpedEnemy,
                promotedToKing: false,
              },
              nextIsKing: true,
            });
          }
          r += dr;
          c += dc;
        }
      }
    }
  }

  return steps;
}

// Depth-first search to find all complete capture paths
function searchCapturePaths(
  ctx: CaptureContext,
  currentPos: Position,
  isKing: boolean,
  stepsSoFar: MoveStep[],
  capturedSoFar: { position: Position; piece: Piece }[],
  promotedEver: boolean,
  results: Move[]
): void {
  const nextSteps = findNextCaptureSteps(ctx, currentPos, isKing, capturedSoFar);

  if (nextSteps.length === 0) {
    // No further captures possible from this position
    if (stepsSoFar.length > 0) {
      const path = stepsSoFar.map((s) => s.to);
      const move: Move = {
        from: ctx.startPos,
        to: currentPos,
        steps: [...stepsSoFar],
        capturedPieces: [...capturedSoFar],
        isCapture: true,
        promotedToKing: promotedEver,
        notation: formatMoveNotation(ctx.startPos, currentPos, path, true),
      };
      results.push(move);
    }
    return;
  }

  // If there are capture steps, the piece MUST continue capturing!
  for (const { step, nextIsKing } of nextSteps) {
    const nextCaptured = [...capturedSoFar, step.captured!];
    const nextStepsSoFar = [...stepsSoFar, step];
    const willBeKing = isKing || nextIsKing;
    const promoted = promotedEver || (step.promotedToKing ?? false);

    searchCapturePaths(
      ctx,
      step.to,
      willBeKing,
      nextStepsSoFar,
      nextCaptured,
      promoted,
      results
    );
  }
}

export function generateCapturesForPiece(
  board: Board,
  pos: Position
): Move[] {
  const piece = board[pos.row][pos.col];
  if (!piece) return [];

  const ctx: CaptureContext = {
    board,
    player: piece.player,
    startPos: pos,
    initialPiece: piece,
  };

  const results: Move[] = [];
  searchCapturePaths(
    ctx,
    pos,
    piece.type === 'king',
    [],
    [],
    false,
    results
  );

  return results;
}

export function generateAllCaptures(board: Board, player: Player): Move[] {
  const allCaptures: Move[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.player === player) {
        const pieceCaptures = generateCapturesForPiece(board, { row: r, col: c });
        allCaptures.push(...pieceCaptures);
      }
    }
  }
  return allCaptures;
}
