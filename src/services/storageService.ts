import type { Difficulty, GameMode, GameSettings, GameState, Player } from '../types/game';

const SETTINGS_KEY = 'checkers_settings_v1';
const SAVED_GAME_KEY = 'checkers_saved_game_v1';

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  difficulty: 'medium',
  gameMode: 'computer',
  boardTheme: 'classic',
  playerSide: 'red',
};

export function loadSettings(): GameSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);

    const validModes: GameMode[] = ['two-player', 'computer'];
    const validDifficulties: Difficulty[] = ['easy', 'medium', 'hard'];
    const validThemes = ['classic', 'wood', 'slate'];
    const validPlayers: Player[] = ['red', 'black'];

    return {
      soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : DEFAULT_SETTINGS.soundEnabled,
      difficulty: validDifficulties.includes(parsed.difficulty) ? parsed.difficulty : DEFAULT_SETTINGS.difficulty,
      gameMode: validModes.includes(parsed.gameMode) ? parsed.gameMode : DEFAULT_SETTINGS.gameMode,
      boardTheme: validThemes.includes(parsed.boardTheme) ? parsed.boardTheme : DEFAULT_SETTINGS.boardTheme,
      playerSide: validPlayers.includes(parsed.playerSide) ? parsed.playerSide : DEFAULT_SETTINGS.playerSide,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: GameSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // LocalStorage quota or access denied - fail silently
  }
}

export function saveGameState(state: GameState): void {
  if (typeof window === 'undefined') return;
  try {
    if (state.status !== 'playing') {
      localStorage.removeItem(SAVED_GAME_KEY);
      return;
    }
    const serialized = JSON.stringify({
      board: state.board,
      currentPlayer: state.currentPlayer,
      status: state.status,
      winner: state.winner,
      halfMoveClock: state.halfMoveClock,
      positionCounts: state.positionCounts,
      moveHistory: state.moveHistory,
      lastMove: state.lastMove,
      settings: state.settings,
    });
    localStorage.setItem(SAVED_GAME_KEY, serialized);
  } catch {
    // Ignore storage errors
  }
}

export function loadSavedGameState(): Partial<GameState> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SAVED_GAME_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);

    if (
      !parsed.board ||
      !Array.isArray(parsed.board) ||
      parsed.board.length !== 8 ||
      !parsed.currentPlayer
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function clearSavedGameState(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SAVED_GAME_KEY);
  } catch {
    // Ignore
  }
}
