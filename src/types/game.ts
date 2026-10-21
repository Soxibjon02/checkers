export type Player = 'red' | 'black';

export type PieceType = 'man' | 'king';

export interface Piece {
  id: string;
  player: Player;
  type: PieceType;
}

export interface Position {
  row: number; // 0 to 7 (0 is row 8 at top, 7 is row 1 at bottom)
  col: number; // 0 to 7 (0 is col a, 7 is col h)
}

export type Board = (Piece | null)[][];

export interface MoveStep {
  from: Position;
  to: Position;
  captured?: {
    position: Position;
    piece: Piece;
  };
  promotedToKing?: boolean; // Whether promotion happened during this step
}

export interface Move {
  from: Position;
  to: Position;
  steps: MoveStep[]; // Allows multi-capture step breakdown
  capturedPieces: {
    position: Position;
    piece: Piece;
  }[];
  isCapture: boolean;
  promotedToKing: boolean;
  notation: string;
}

export type GameMode = 'two-player' | 'computer';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameStatus =
  | 'idle'
  | 'playing'
  | 'red-won'
  | 'black-won'
  | 'draw';

export type DrawReason =
  | 'threefold-repetition'
  | 'thirty-move-rule'
  | 'mutual-agreement'
  | 'insufficient-material';

export interface GameHistoryEntry {
  move: Move;
  boardBefore: Board;
  boardAfter: Board;
  player: Player;
  notation: string;
  positionHash: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  difficulty: Difficulty;
  gameMode: GameMode;
  boardTheme: 'classic' | 'wood' | 'slate';
  playerSide: Player; // Which side human plays in vs-computer mode
}

export interface GameState {
  board: Board;
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
  drawReason?: DrawReason;
  selectedPos: Position | null;
  validMovesForSelected: Move[];
  availableMoves: Move[]; // All legal moves for the current player
  mustCapture: boolean;
  moveHistory: GameHistoryEntry[];
  lastMove: Move | null;
  positionCounts: Record<string, number>; // For 3-fold repetition
  halfMoveClock: number; // For draw rule (turns without capture or man moves)
  isThinking: boolean; // Computer thinking state
  settings: GameSettings;
}
