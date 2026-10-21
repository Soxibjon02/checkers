import React, { useState } from 'react';
import { useGame } from './hooks/useGame';
import { MainMenu } from './components/menu/MainMenu';
import { GameHeader } from './components/game/GameHeader';
import { GameBoard } from './components/board/GameBoard';
import { GameStatusBanner } from './components/game/GameStatusBanner';
import { MoveHistory } from './components/game/MoveHistory';
import { GameControls } from './components/game/GameControls';
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

  return (
    <div className="game-container">
      {/* Top Header */}
      <GameHeader
        settings={settings}
        onToggleSound={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
        onOpenRules={() => setIsRulesOpen(true)}
        onReturnToMenu={returnToMenu}
        onNewGame={() => startNewGame()}
      />

      {/* Main Game Content */}
      <main className="game-main">
        {/* Board Column */}
        <section className="board-section">
          <GameStatusBanner
            currentPlayer={currentPlayer}
            status={status}
            winner={winner}
            drawReason={drawReason}
            mustCapture={mustCapture}
            isThinking={isThinking}
            settings={settings}
          />

          <GameBoard
            board={board}
            theme={settings.boardTheme}
            selectedPos={selectedPos}
            validMoves={validMovesForSelected}
            lastMove={lastMove}
            mustCapture={mustCapture}
            onSquareClick={handleSquareClick}
          />
        </section>

        {/* Sidebar Column */}
        <aside className="game-sidebar">
          <MoveHistory
            board={board}
            currentPlayer={currentPlayer}
            history={moveHistory}
            settings={settings}
          />

          <GameControls
            canUndo={moveHistory.length > 0}
            isThinking={isThinking}
            settings={settings}
            onUndo={undoMove}
            onNewGame={() => startNewGame()}
            onUpdateSettings={updateSettings}
          />
        </aside>
      </main>

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
