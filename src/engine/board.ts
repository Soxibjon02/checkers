import type { Board, Piece, Player, Position } from '../types/game';

let pieceCounter = 1;

export function generatePieceId(player: Player): string {
  return `${player}-${pieceCounter++}-${Math.random().toString(36).substring(2, 7)}`;
}

export function resetPieceCounter(): void {
  pieceCounter = 1;
}

export function isInsideBoard(row: number, col: number): boolean {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

export function isPlayableSquare(row: number, col: number): boolean {
  return isInsideBoard(row, col) && (row + col) % 2 === 1;
}

export function isKingPromotionRow(player: Player, row: number): boolean {
  return player === 'red' ? row === 0 : row === 7;
}

export function createEmptyBoard(): Board {
  const board: Board = [];
  for (let r = 0; r < 8; r++) {
    const row: (Piece | null)[] = [];
    for (let c = 0; c < 8; c++) {
      row.push(null);
    }
    board.push(row);
  }
  return board;
}

export function createInitialBoard(): Board {
  const board = createEmptyBoard();

  // Black pieces on rows 0, 1, 2
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 8; c++) {
      if (isPlayableSquare(r, c)) {
        board[r][c] = {
          id: generatePieceId('black'),
          player: 'black',
          type: 'man',
        };
      }
    }
  }

  // Red pieces on rows 5, 6, 7
  for (let r = 5; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (isPlayableSquare(r, c)) {
        board[r][c] = {
          id: generatePieceId('red'),
          player: 'red',
          type: 'man',
        };
      }
    }
  }

  return board;
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
}

export function countPieces(board: Board): {
  redMen: number;
  redKings: number;
  blackMen: number;
  blackKings: number;
  totalRed: number;
  totalBlack: number;
} {
  let redMen = 0;
  let redKings = 0;
  let blackMen = 0;
  let blackKings = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece) {
        if (piece.player === 'red') {
          if (piece.type === 'king') redKings++;
          else redMen++;
        } else {
          if (piece.type === 'king') blackKings++;
          else blackMen++;
        }
      }
    }
  }

  return {
    redMen,
    redKings,
    blackMen,
    blackKings,
    totalRed: redMen + redKings,
    totalBlack: blackMen + blackKings,
  };
}

export function hashBoard(board: Board, currentPlayer: Player): string {
  let hash = `${currentPlayer}:`;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (isPlayableSquare(r, c)) {
        const piece = board[r][c];
        if (!piece) {
          hash += '.';
        } else {
          const char = piece.player === 'red' ? 'r' : 'b';
          hash += piece.type === 'king' ? char.toUpperCase() : char;
        }
      }
    }
  }
  return hash;
}

export function getPieceAt(board: Board, pos: Position): Piece | null {
  if (!isInsideBoard(pos.row, pos.col)) return null;
  return board[pos.row][pos.col];
}
