import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  Board,
  GameHistoryEntry,
  GameSettings,
  GameState,
  Move,
  Player,
  Position,
} from '../types/game';
import { applyMove } from '../engine/applyMove';
import { createInitialBoard, hashBoard } from '../engine/board';
import { evaluateGameStatus } from '../engine/gameStatus';
import { generateLegalMoves, getLegalMovesForPiece } from '../engine/moves';
import { getComputerMoveAsync } from '../ai/computerPlayer';
import { soundService } from '../services/soundService';
import {
  clearSavedGameState,
  loadSavedGameState,
  loadSettings,
  saveGameState,
  saveSettings,
} from '../services/storageService';

export function useGame() {
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());
  const [board, setBoard] = useState<Board>(() => createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('red');
  const [status, setStatus] = useState<GameState['status']>('idle');
  const [winner, setWinner] = useState<Player | null>(null);
  const [drawReason, setDrawReason] = useState<GameState['drawReason']>();
  const [selectedPos, setSelectedPos] = useState<Position | null>(null);
  const [moveHistory, setMoveHistory] = useState<GameHistoryEntry[]>([]);
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const [positionCounts, setPositionCounts] = useState<Record<string, number>>({});
  const [halfMoveClock, setHalfMoveClock] = useState<number>(0);
  const [isThinking, setIsThinking] = useState<boolean>(false);

  // Sound sync
  useEffect(() => {
    soundService.setEnabled(settings.soundEnabled);
    saveSettings(settings);
  }, [settings]);

  // Compute all legal moves for current player
  const availableMoves = useCallback(() => {
    if (status !== 'playing') return [];
    return generateLegalMoves(board, currentPlayer);
  }, [board, currentPlayer, status]);

  const currentAvailableMoves = availableMoves();
  const mustCapture = currentAvailableMoves.length > 0 && currentAvailableMoves[0].isCapture;

  // Moves available for currently selected square
  const validMovesForSelected = selectedPos
    ? getLegalMovesForPiece(board, selectedPos, currentAvailableMoves)
    : [];

  // Ref to cancel pending AI moves if game resets or undos
  const aiCancelRef = useRef<boolean>(false);

  // Start new match
  const startNewGame = useCallback(
    (customSettings?: Partial<GameSettings>) => {
      aiCancelRef.current = true;
      setIsThinking(false);

      const newSettings = { ...settings, ...customSettings };
      setSettings(newSettings);

      const newBoard = createInitialBoard();
      const initialPlayer: Player = 'red';
      const initialHash = hashBoard(newBoard, initialPlayer);

      setBoard(newBoard);
      setCurrentPlayer(initialPlayer);
      setStatus('playing');
      setWinner(null);
      setDrawReason(undefined);
      setSelectedPos(null);
      setMoveHistory([]);
      setLastMove(null);
      setPositionCounts({ [initialHash]: 1 });
      setHalfMoveClock(0);

      clearSavedGameState();
    },
    [settings]
  );

  // Resume or load saved game if present
  useEffect(() => {
    const saved = loadSavedGameState();
    if (saved && saved.board && saved.currentPlayer && saved.status === 'playing') {
      setBoard(saved.board);
      setCurrentPlayer(saved.currentPlayer);
      setStatus('playing');
      setWinner(saved.winner ?? null);
      setMoveHistory(saved.moveHistory ?? []);
      setLastMove(saved.lastMove ?? null);
      setPositionCounts(saved.positionCounts ?? {});
      setHalfMoveClock(saved.halfMoveClock ?? 0);
      if (saved.settings) {
        setSettings(saved.settings);
      }
    }
  }, []);

  // Play a move and update state
  const executeMove = useCallback(
    (move: Move) => {
      const { newBoard } = applyMove(board, move);
      const nextPlayer: Player = currentPlayer === 'red' ? 'black' : 'red';

      // Play sound
      if (move.promotedToKing) {
        soundService.playPromotion();
      } else if (move.isCapture) {
        soundService.playCapture();
      } else {
        soundService.playMove();
      }

      // Half-move clock: resets on capture or when a man moves; increments on king simple moves
      const pieceBefore = board[move.from.row][move.from.col];
      const isKingSimpleMove = !move.isCapture && pieceBefore?.type === 'king';
      const newHalfMoveClock = isKingSimpleMove ? halfMoveClock + 1 : 0;

      // Position hash and counts for 3-fold repetition
      const newHash = hashBoard(newBoard, nextPlayer);
      const newCounts = {
        ...positionCounts,
        [newHash]: (positionCounts[newHash] ?? 0) + 1,
      };

      // Record move history
      const historyEntry: GameHistoryEntry = {
        move,
        boardBefore: board,
        boardAfter: newBoard,
        player: currentPlayer,
        notation: move.notation,
        positionHash: newHash,
      };
      const newHistory = [...moveHistory, historyEntry];

      // Evaluate new game status
      const evaluation = evaluateGameStatus(newBoard, nextPlayer, newCounts, newHalfMoveClock);

      setBoard(newBoard);
      setCurrentPlayer(nextPlayer);
      setSelectedPos(null);
      setLastMove(move);
      setMoveHistory(newHistory);
      setPositionCounts(newCounts);
      setHalfMoveClock(newHalfMoveClock);

      if (evaluation.status !== 'playing') {
        setStatus(evaluation.status);
        setWinner(evaluation.winner);
        setDrawReason(evaluation.drawReason);

        if (evaluation.status === 'draw') {
          soundService.playDraw();
        } else {
          soundService.playWin();
        }
        clearSavedGameState();
      } else {
        saveGameState({
          board: newBoard,
          currentPlayer: nextPlayer,
          status: 'playing',
          winner: null,
          selectedPos: null,
          validMovesForSelected: [],
          availableMoves: [],
          mustCapture: false,
          moveHistory: newHistory,
          lastMove: move,
          positionCounts: newCounts,
          halfMoveClock: newHalfMoveClock,
          isThinking: false,
          settings,
        });
      }
    },
    [board, currentPlayer, halfMoveClock, moveHistory, positionCounts, settings]
  );

  // Trigger computer AI turn when appropriate
  useEffect(() => {
    if (status !== 'playing') return;
    if (settings.gameMode !== 'computer') return;

    const computerSide: Player = settings.playerSide === 'red' ? 'black' : 'red';
    if (currentPlayer !== computerSide) return;

    aiCancelRef.current = false;
    setIsThinking(true);

    getComputerMoveAsync(board, currentPlayer, settings.difficulty)
      .then((aiMove) => {
        if (aiCancelRef.current) return;
        setIsThinking(false);

        if (aiMove) {
          executeMove(aiMove);
        } else {
          // No legal moves for computer -> Human wins!
          const humanWinner: Player = settings.playerSide;
          setStatus(humanWinner === 'red' ? 'red-won' : 'black-won');
          setWinner(humanWinner);
          soundService.playWin();
        }
      })
      .catch(() => {
        setIsThinking(false);
      });

    return () => {
      aiCancelRef.current = true;
    };
  }, [board, currentPlayer, executeMove, settings.difficulty, settings.gameMode, settings.playerSide, status]);

  // Handle square clicks by human player
  const handleSquareClick = useCallback(
    (pos: Position) => {
      if (status !== 'playing') return;
      if (isThinking) return;

      // In vs-computer mode, only allow human player's pieces to be clicked
      if (settings.gameMode === 'computer' && currentPlayer !== settings.playerSide) {
        return;
      }

      const clickedPiece = board[pos.row][pos.col];

      // 1. If clicking an already selected square, deselect it
      if (selectedPos && selectedPos.row === pos.row && selectedPos.col === pos.col) {
        setSelectedPos(null);
        return;
      }

      // 2. If already have a selected piece and clicked a valid move destination:
      if (selectedPos) {
        const matchingMove = validMovesForSelected.find(
          (m) => m.to.row === pos.row && m.to.col === pos.col
        );
        if (matchingMove) {
          executeMove(matchingMove);
          return;
        }
      }

      // 3. Selecting a friendly piece
      if (clickedPiece && clickedPiece.player === currentPlayer) {
        const movesForThis = getLegalMovesForPiece(board, pos, currentAvailableMoves);

        // If mandatory captures exist, clicking a piece with no capture moves should not select
        if (mustCapture && movesForThis.length === 0) {
          soundService.playSelect();
          return;
        }

        if (movesForThis.length > 0) {
          setSelectedPos(pos);
          soundService.playSelect();
        }
      } else {
        // Clicked outside or empty non-destination square
        setSelectedPos(null);
      }
    },
    [
      board,
      currentAvailableMoves,
      currentPlayer,
      executeMove,
      isThinking,
      mustCapture,
      selectedPos,
      settings.gameMode,
      settings.playerSide,
      status,
      validMovesForSelected,
    ]
  );

  // Undo functionality
  const undoMove = useCallback(() => {
    if (moveHistory.length === 0) return;
    if (isThinking) return;

    aiCancelRef.current = true;
    setIsThinking(false);

    let targetHistoryLength = moveHistory.length - 1;

    // In computer mode, undo both the computer move and the player's move so it's the human's turn again
    if (settings.gameMode === 'computer') {
      const computerSide: Player = settings.playerSide === 'red' ? 'black' : 'red';
      // If last move was by computer, undo 2 plies
      if (currentPlayer === settings.playerSide && moveHistory.length >= 2) {
        targetHistoryLength = moveHistory.length - 2;
      } else if (moveHistory[moveHistory.length - 1].player === computerSide) {
        targetHistoryLength = Math.max(0, moveHistory.length - 2);
      }
    }

    if (targetHistoryLength <= 0) {
      // Revert to game start
      const freshBoard = createInitialBoard();
      setBoard(freshBoard);
      setCurrentPlayer('red');
      setStatus('playing');
      setWinner(null);
      setDrawReason(undefined);
      setSelectedPos(null);
      setMoveHistory([]);
      setLastMove(null);
      setPositionCounts({ [hashBoard(freshBoard, 'red')]: 1 });
      setHalfMoveClock(0);
      clearSavedGameState();
      return;
    }

    const targetEntry = moveHistory[targetHistoryLength - 1];
    const restoredBoard = targetEntry.boardAfter;
    const restoredPlayer: Player = targetEntry.player === 'red' ? 'black' : 'red';
    const slicedHistory = moveHistory.slice(0, targetHistoryLength);

    // Reconstruct position counts
    const counts: Record<string, number> = {};
    for (const entry of slicedHistory) {
      counts[entry.positionHash] = (counts[entry.positionHash] ?? 0) + 1;
    }

    setBoard(restoredBoard);
    setCurrentPlayer(restoredPlayer);
    setStatus('playing');
    setWinner(null);
    setDrawReason(undefined);
    setSelectedPos(null);
    setMoveHistory(slicedHistory);
    setLastMove(targetEntry.move);
    setPositionCounts(counts);
    // Recalculate half-move clock approximation
    setHalfMoveClock(0);

    saveGameState({
      board: restoredBoard,
      currentPlayer: restoredPlayer,
      status: 'playing',
      winner: null,
      selectedPos: null,
      validMovesForSelected: [],
      availableMoves: [],
      mustCapture: false,
      moveHistory: slicedHistory,
      lastMove: targetEntry.move,
      positionCounts: counts,
      halfMoveClock: 0,
      isThinking: false,
      settings,
    });
  }, [currentPlayer, isThinking, moveHistory, settings]);

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      return updated;
    });
  }, []);

  const returnToMenu = useCallback(() => {
    aiCancelRef.current = true;
    setIsThinking(false);
    setStatus('idle');
    clearSavedGameState();
  }, []);

  return {
    board,
    currentPlayer,
    status,
    winner,
    drawReason,
    selectedPos,
    validMovesForSelected,
    availableMoves: currentAvailableMoves,
    mustCapture,
    moveHistory,
    lastMove,
    isThinking,
    settings,
    handleSquareClick,
    executeMove,
    undoMove,
    startNewGame,
    updateSettings,
    returnToMenu,
  };
}
