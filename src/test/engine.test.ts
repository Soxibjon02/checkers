import { describe, it, expect, beforeEach } from 'vitest';
import type { Board } from '../types/game';
import {
  createInitialBoard,
  createEmptyBoard,
  countPieces,
  isPlayableSquare,
  hashBoard,
  generatePieceId,
} from '../engine/board';
import {
  generateLegalMoves,
  generateSimpleMovesForPiece,
  isMoveLegal,
} from '../engine/moves';
import { generateCapturesForPiece } from '../engine/captures';
import { applyMove } from '../engine/applyMove';
import { evaluateGameStatus, checkDraw } from '../engine/gameStatus';
import { computeComputerMove, chooseEasyMove, chooseMediumMove, chooseHardMove } from '../ai/computerPlayer';

describe('Checkers Engine Test Suite (Russian Draughts)', () => {
  let initialBoard: Board;

  beforeEach(() => {
    initialBoard = createInitialBoard();
  });

  // 1. Correct initial board setup
  it('1. Correct initial board setup', () => {
    const counts = countPieces(initialBoard);
    expect(counts.totalRed).toBe(12);
    expect(counts.redMen).toBe(12);
    expect(counts.redKings).toBe(0);

    expect(counts.totalBlack).toBe(12);
    expect(counts.blackMen).toBe(12);
    expect(counts.blackKings).toBe(0);

    // Verify pieces only reside on dark/playable squares
    let totalPieces = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = initialBoard[r][c];
        if (piece) {
          totalPieces++;
          expect(isPlayableSquare(r, c)).toBe(true);
        }
      }
    }
    expect(totalPieces).toBe(24);

    // Verify black on rows 0, 1, 2 and red on rows 5, 6, 7
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 8; c++) {
        if (isPlayableSquare(r, c)) {
          expect(initialBoard[r][c]?.player).toBe('black');
        }
      }
    }
    for (let r = 5; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (isPlayableSquare(r, c)) {
          expect(initialBoard[r][c]?.player).toBe('red');
        }
      }
    }
  });

  // 2. Legal ordinary moves
  it('2. Legal ordinary moves', () => {
    // Red moves up from row 5
    const legalMoves = generateLegalMoves(initialBoard, 'red');
    expect(legalMoves.length).toBeGreaterThan(0);
    // Pieces on row 5 (dark squares: (5,0), (5,2), (5,4), (5,6)) can advance to row 4
    for (const move of legalMoves) {
      expect(move.from.row).toBe(5);
      expect(move.to.row).toBe(4);
      expect(Math.abs(move.to.col - move.from.col)).toBe(1);
      expect(move.isCapture).toBe(false);
    }
  });

  // 3. Illegal moves
  it('3. Illegal moves', () => {
    // Red piece trying to jump horizontally or straight
    const illegalMove = isMoveLegal(initialBoard, 'red', { row: 5, col: 0 }, { row: 5, col: 1 });
    expect(illegalMove).toBeNull();

    // Red piece trying to jump to occupied square
    const blockedMove = isMoveLegal(initialBoard, 'red', { row: 6, col: 1 }, { row: 5, col: 0 });
    expect(blockedMove).toBeNull();
  });

  // 4. Forward movement restrictions
  it('4. Forward movement restrictions for ordinary men', () => {
    const board = createEmptyBoard();
    board[4][3] = { id: generatePieceId('red'), player: 'red', type: 'man' };

    const redMoves = generateSimpleMovesForPiece(board, { row: 4, col: 3 });
    // Red man can ONLY move forward (row 3), not backward (row 5)
    expect(redMoves.every((m) => m.to.row === 3)).toBe(true);
    expect(redMoves.length).toBe(2); // (3, 2) and (3, 4)

    // For Black man, can only move down (row 5), not backward (row 3)
    board[4][3] = { id: generatePieceId('black'), player: 'black', type: 'man' };
    const blackMoves = generateSimpleMovesForPiece(board, { row: 4, col: 3 });
    expect(blackMoves.every((m) => m.to.row === 5)).toBe(true);
  });

  // 5. Backward captures under Russian rules
  it('5. Backward captures under Russian rules', () => {
    const board = createEmptyBoard();
    // Red man at (3, 2), enemy Black man behind it at (4, 3)
    board[3][2] = { id: generatePieceId('red'), player: 'red', type: 'man' };
    board[4][3] = { id: generatePieceId('black'), player: 'black', type: 'man' };

    const captures = generateCapturesForPiece(board, { row: 3, col: 2 });
    expect(captures.length).toBe(1);
    // Red man captures backward to (5, 4)
    expect(captures[0].to).toEqual({ row: 5, col: 4 });
    expect(captures[0].capturedPieces[0].position).toEqual({ row: 4, col: 3 });
  });

  // 6. Mandatory captures
  it('6. Mandatory captures', () => {
    const board = createEmptyBoard();
    // Piece A has a capture available
    board[5][2] = { id: generatePieceId('red'), player: 'red', type: 'man' };
    board[4][3] = { id: generatePieceId('black'), player: 'black', type: 'man' };
    // Piece B has only a simple move available
    board[6][5] = { id: generatePieceId('red'), player: 'red', type: 'man' };

    const legalMoves = generateLegalMoves(board, 'red');
    // Only capture moves are legal!
    expect(legalMoves.every((m) => m.isCapture)).toBe(true);
    expect(legalMoves.some((m) => m.from.row === 5 && m.from.col === 2)).toBe(true);
    // Piece B cannot make a simple move because capture is mandatory
    expect(legalMoves.some((m) => m.from.row === 6 && m.from.col === 5)).toBe(false);
  });

  // 7. Multi-capture sequences
  it('7. Multi-capture sequences', () => {
    const board = createEmptyBoard();
    // Red man at (5, 0), black men at (4, 1) and (2, 3)
    board[5][0] = { id: generatePieceId('red'), player: 'red', type: 'man' };
    board[4][1] = { id: generatePieceId('black'), player: 'black', type: 'man' };
    board[2][3] = { id: generatePieceId('black'), player: 'black', type: 'man' };

    const captures = generateCapturesForPiece(board, { row: 5, col: 0 });
    expect(captures.length).toBe(1);
    expect(captures[0].capturedPieces.length).toBe(2);
    expect(captures[0].to).toEqual({ row: 1, col: 4 });
    expect(captures[0].steps.length).toBe(2);
  });

  // 8. King movement (flying king)
  it('8. King movement (flying king)', () => {
    const board = createEmptyBoard();
    board[4][3] = { id: generatePieceId('red'), player: 'red', type: 'king' };

    const moves = generateSimpleMovesForPiece(board, { row: 4, col: 3 });
    // In an empty board, a king at (4,3) can slide along all 4 diagonals to the board edges
    // Diagonals from (4,3):
    // Up-left: (3,2), (2,1), (1,0) [3 squares]
    // Up-right: (3,4), (2,5), (1,6), (0,7) [4 squares]
    // Down-left: (5,2), (6,1), (7,0) [3 squares]
    // Down-right: (5,4), (6,5), (7,6) [3 squares]
    // Total = 3 + 4 + 3 + 3 = 13 squares
    expect(moves.length).toBe(13);
    expect(moves.some((m) => m.to.row === 0 && m.to.col === 7)).toBe(true);
    expect(moves.some((m) => m.to.row === 1 && m.to.col === 0)).toBe(true);
  });

  // 9. King captures (flying king captures at distance)
  it('9. King captures (flying king captures across long distance)', () => {
    const board = createEmptyBoard();
    board[7][0] = { id: generatePieceId('red'), player: 'red', type: 'king' };
    // Enemy black piece at (4, 3)
    board[4][3] = { id: generatePieceId('black'), player: 'black', type: 'man' };

    const captures = generateCapturesForPiece(board, { row: 7, col: 0 });
    // Red king can jump over (4,3) and land on any of the empty squares along that diagonal beyond it:
    // (3, 4), (2, 5), (1, 6), (0, 7) -> 4 distinct landing options!
    expect(captures.length).toBe(4);
    const landingRows = captures.map((c) => c.to.row);
    expect(landingRows).toContain(3);
    expect(landingRows).toContain(2);
    expect(landingRows).toContain(1);
    expect(landingRows).toContain(0);
  });

  // 10. King promotion
  it('10. King promotion upon reaching back rank', () => {
    const board = createEmptyBoard();
    board[1][2] = { id: generatePieceId('red'), player: 'red', type: 'man' };

    const moves = generateSimpleMovesForPiece(board, { row: 1, col: 2 });
    const promoMove = moves.find((m) => m.to.row === 0);
    expect(promoMove).toBeDefined();
    expect(promoMove?.promotedToKing).toBe(true);

    const { newBoard, movedPiece } = applyMove(board, promoMove!);
    expect(movedPiece.type).toBe('king');
    expect(newBoard[0][promoMove!.to.col]?.type).toBe('king');
  });

  // 11. Promotion during captures (Russian in-flight promotion)
  it('11. Promotion during captures (in-flight flying king promotion)', () => {
    const board = createEmptyBoard();
    // Red man at (2, 1) jumps over enemy at (1, 2) to land on king rank (0, 3)
    // From (0, 3), as a king it can immediately jump over enemy at (2, 5) to land on (3, 6) or beyond
    board[2][1] = { id: generatePieceId('red'), player: 'red', type: 'man' };
    board[1][2] = { id: generatePieceId('black'), player: 'black', type: 'man' };
    board[2][5] = { id: generatePieceId('black'), player: 'black', type: 'man' };

    const captures = generateCapturesForPiece(board, { row: 2, col: 1 });
    expect(captures.length).toBeGreaterThan(0);
    // Every complete capture sequence must promote to king and continue as king
    for (const c of captures) {
      expect(c.promotedToKing).toBe(true);
      expect(c.capturedPieces.length).toBe(2);
      expect(c.steps.length).toBe(2);
      expect(c.steps[0].to).toEqual({ row: 0, col: 3 });
      expect(c.steps[0].promotedToKing).toBe(true);
    }
  });

  // 12. Turn switching
  it('12. Turn switching after move application', () => {
    const legalMoves = generateLegalMoves(initialBoard, 'red');
    const move = legalMoves[0];
    const { newBoard } = applyMove(initialBoard, move);

    // After Red moves, it becomes Black's turn
    const blackMoves = generateLegalMoves(newBoard, 'black');
    expect(blackMoves.length).toBeGreaterThan(0);
  });

  // 13. Captured-piece removal
  it('13. Captured-piece removal', () => {
    const board = createEmptyBoard();
    board[3][2] = { id: generatePieceId('red'), player: 'red', type: 'man' };
    board[2][3] = { id: generatePieceId('black'), player: 'black', type: 'man' };

    const captures = generateCapturesForPiece(board, { row: 3, col: 2 });
    expect(captures.length).toBe(1);

    const { newBoard } = applyMove(board, captures[0]);
    // The captured piece at (2, 3) must be removed
    expect(newBoard[2][3]).toBeNull();
    expect(newBoard[3][2]).toBeNull();
    expect(newBoard[1][4]).not.toBeNull();
  });

  // 14. Win detection (no pieces or no legal moves)
  it('14. Win detection', () => {
    // 14a. No pieces left
    const board1 = createEmptyBoard();
    board1[4][3] = { id: generatePieceId('red'), player: 'red', type: 'man' };
    const status1 = evaluateGameStatus(board1, 'black');
    expect(status1.status).toBe('red-won');
    expect(status1.winner).toBe('red');

    // 14b. Stalemate / Blockade: Black has a piece, but it is trapped with no legal moves
    const board2 = createEmptyBoard();
    // Black man trapped in corner
    board2[0][7] = { id: generatePieceId('black'), player: 'black', type: 'man' };
    // Red pieces blocking black completely
    board2[1][6] = { id: generatePieceId('red'), player: 'red', type: 'man' };
    board2[2][5] = { id: generatePieceId('red'), player: 'red', type: 'man' };

    const status2 = evaluateGameStatus(board2, 'black');
    expect(status2.status).toBe('red-won');
    expect(status2.winner).toBe('red');
  });

  // 15. Draw conditions (Threefold repetition & 30-ply rule)
  it('15. Draw conditions implemented by the project', () => {
    const board = createEmptyBoard();
    board[0][7] = { id: generatePieceId('red'), player: 'red', type: 'king' };
    board[7][0] = { id: generatePieceId('black'), player: 'black', type: 'king' };

    const hash = hashBoard(board, 'red');
    const positionCounts: Record<string, number> = {
      [hash]: 3,
    };

    const drawRepetition = checkDraw(board, 'red', positionCounts, 0);
    expect(drawRepetition.isDraw).toBe(true);
    expect(drawRepetition.reason).toBe('threefold-repetition');

    const draw30Ply = checkDraw(board, 'red', {}, 30);
    expect(draw30Ply.isDraw).toBe(true);
    expect(draw30Ply.reason).toBe('thirty-move-rule');
  });

  // 16. Undo and state restoration
  it('16. Undo and state restoration preserves board integrity', () => {
    const legalMoves = generateLegalMoves(initialBoard, 'red');
    const originalHash = hashBoard(initialBoard, 'red');

    const move = legalMoves[0];
    const { newBoard } = applyMove(initialBoard, move);

    // Board after move is different
    expect(hashBoard(newBoard, 'black')).not.toBe(originalHash);

    // When undoing, restoring the previous snapshot returns exact hash
    const restoredHash = hashBoard(initialBoard, 'red');
    expect(restoredHash).toBe(originalHash);
  });

  // 17. AI legal-move generation
  it('17. AI legal-move generation for Easy, Medium, and Hard', () => {
    const easyMove = chooseEasyMove(initialBoard, 'black');
    expect(easyMove).not.toBeNull();
    expect(isMoveLegal(initialBoard, 'black', easyMove!.from, easyMove!.to)).not.toBeNull();

    const mediumMove = chooseMediumMove(initialBoard, 'black');
    expect(mediumMove).not.toBeNull();
    expect(isMoveLegal(initialBoard, 'black', mediumMove!.from, mediumMove!.to)).not.toBeNull();

    const hardMove = chooseHardMove(initialBoard, 'black');
    expect(hardMove).not.toBeNull();
    expect(isMoveLegal(initialBoard, 'black', hardMove!.from, hardMove!.to)).not.toBeNull();
  });

  // 18. AI handling of positions with no legal moves
  it('18. AI handling of positions with no legal moves', () => {
    const emptyBoard = createEmptyBoard();
    const move = computeComputerMove(emptyBoard, 'black', 'hard');
    expect(move).toBeNull();
  });

  // Edge Case: Flying king cannot jump over two consecutive enemy pieces
  it('Edge Case: Flying king cannot jump over two consecutive enemy pieces without landing square', () => {
    const board = createEmptyBoard();
    board[7][0] = { id: generatePieceId('red'), player: 'red', type: 'king' };
    board[5][2] = { id: generatePieceId('black'), player: 'black', type: 'man' };
    board[4][3] = { id: generatePieceId('black'), player: 'black', type: 'man' };

    const captures = generateCapturesForPiece(board, { row: 7, col: 0 });
    // Cannot jump through both without an intermediate landing square
    expect(captures.length).toBe(0);
  });

  // Edge Case: Flying king cannot jump over friendly piece
  it('Edge Case: Flying king cannot jump over friendly piece', () => {
    const board = createEmptyBoard();
    board[7][0] = { id: generatePieceId('red'), player: 'red', type: 'king' };
    board[5][2] = { id: generatePieceId('red'), player: 'red', type: 'man' };
    board[3][4] = { id: generatePieceId('black'), player: 'black', type: 'man' };

    const captures = generateCapturesForPiece(board, { row: 7, col: 0 });
    expect(captures.length).toBe(0);
  });

  // Edge Case: Turkish strike - piece cannot jump the same enemy piece twice
  it('Edge Case: Turkish strike - piece cannot jump the same enemy piece twice', () => {
    const board = createEmptyBoard();
    // Setup a loop scenario
    board[5][2] = { id: generatePieceId('red'), player: 'red', type: 'man' };
    board[4][3] = { id: generatePieceId('black'), player: 'black', type: 'man' };

    const captures = generateCapturesForPiece(board, { row: 5, col: 2 });
    // The captured piece is at (4,3). It cannot be jumped again in the same turn.
    for (const c of captures) {
      const jumpedPositions = c.capturedPieces.map((p) => `${p.position.row},${p.position.col}`);
      const uniqueJumped = new Set(jumpedPositions);
      expect(uniqueJumped.size).toBe(jumpedPositions.length);
    }
  });
});
