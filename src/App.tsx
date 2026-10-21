import React, { useState } from 'react';
import { useGame } from './hooks/useGame';
import { countPieces } from './engine/board';
import { MainMenu } from './components/menu/MainMenu';
import { GameHeader } from './components/game/GameHeader';
import { GameBoard } from './components/board/GameBoard';
import { GameStatusBanner } from './components/game/GameStatusBanner';
import { PlayerStrip } from './components/game/PlayerStrip';
import { SettingsModal } from './components/game/SettingsModal';
import { HistoryModal } from './components/game/HistoryModal';
import { GameOverModal } from './components/game/GameOverModal';
import { RulesModal } from './components/game/RulesModal';
import './styles/index.css';
import './styles/board.css';

export const App: React.FC = () => {
  const {
    board,
    currentPlayer,
    status,
    winner,
    drawReason,
    selectedPos,
    validMovesForSelected,
    mustCapture,
    moveHistory,
    lastMove,
    isThinking,
    settings,
    handleSquareClick,
    undoMove,
    startNewGame,
    updateSettings,
    returnToMenu,
  } = useGame();

  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // If in idle state, show the Main Menu
  if (status === 'idle') {
    return (
      <>
        <MainMenu
          settings={settings}
          onUpdateSettings={updateSettings}
          onStartGame={() => startNewGame()}
          onOpenRules={() => setIsRulesOpen(true)}
        />
        <RulesModal
          isOpen={isRulesOpen}
          onClose={() => setIsRulesOpen(false)}
        />
      </>
    );
  }

  const counts = countPieces(board);

  return (
    <div className="game-container">
      {/* Top Header */}
      <GameHeader
        settings={settings}
        canUndo={moveHistory.length > 0}
        historyCount={moveHistory.length}
        isThinking={isThinking}
        onReturnToMenu={returnToMenu}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onUndo={undoMove}
        onNewGame={() => startNewGame()}
      />

      {/* Main Game Screen - Maximized Board */}
      <main className="game-main">
        <section className="board-section">
          {/* Status Alert Banner */}
          <GameStatusBanner
            currentPlayer={currentPlayer}
            status={status}
            winner={winner}
            drawReason={drawReason}
            mustCapture={mustCapture}
            isThinking={isThinking}
            settings={settings}
          />

          {/* Top Player Strip (Black / Opponent) */}
          <PlayerStrip
            player="black"
            isCurrentTurn={currentPlayer === 'black'}
            totalPieces={counts.totalBlack}
            kingsCount={counts.blackKings}
            capturedCount={12 - counts.totalRed}
            settings={settings}
          />

          {/* Maximized 8x8 Board */}
          <GameBoard
            board={board}
            theme={settings.boardTheme}
            selectedPos={selectedPos}
            validMoves={validMovesForSelected}
            lastMove={lastMove}
            mustCapture={mustCapture}
            onSquareClick={handleSquareClick}
          />

          {/* Bottom Player Strip (Red / Player) */}
          <PlayerStrip
            player="red"
            isCurrentTurn={currentPlayer === 'red'}
            totalPieces={counts.totalRed}
            kingsCount={counts.redKings}
            capturedCount={12 - counts.totalBlack}
            settings={settings}
          />
        </section>
      </main>

      {/* Settings Modal (Opens when Sozlamalar button is clicked) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateSettings={updateSettings}
        onNewGame={() => startNewGame()}
        onOpenRules={() => setIsRulesOpen(true)}
        onReturnToMenu={returnToMenu}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        history={moveHistory}
        onClose={() => setIsHistoryOpen(false)}
      />

      {/* Victory / Defeat / Draw Modal */}
      <GameOverModal
        status={status}
        winner={winner}
        drawReason={drawReason}
        settings={settings}
        onNewGame={() => startNewGame()}
        onReturnToMenu={returnToMenu}
      />

      {/* Rules Modal */}
      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />
    </div>
  );
};

export default App;
