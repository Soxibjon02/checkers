import React from 'react';
import { Home, Settings, History, Undo2, RotateCcw } from 'lucide-react';
import type { GameSettings } from '../../types/game';

interface GameHeaderProps {
  settings: GameSettings;
  canUndo: boolean;
  historyCount: number;
  isThinking: boolean;
  onReturnToMenu: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onUndo: () => void;
  onNewGame: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  settings,
  canUndo,
  historyCount,
  isThinking,
  onReturnToMenu,
  onOpenSettings,
  onOpenHistory,
  onUndo,
  onNewGame,
}) => {
  return (
    <header className="game-top-header">
      <div className="header-inner">
        {/* Left: Home & Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onReturnToMenu}
            className="btn-icon header-btn"
            title="Bosh Menyu"
            aria-label="Return to Main Menu"
          >
            <Home size={17} />
          </button>
          <div className="header-brand">
            <span style={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: '1.05rem' }}>
              CHECKERS <span style={{ color: 'var(--accent-rose)' }}>PRO</span>
            </span>
            <span className="mode-badge">
              {settings.gameMode === 'computer' ? `AI · ${settings.difficulty}` : '2P'}
            </span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onUndo}
            disabled={!canUndo || isThinking}
            className="btn-secondary header-action-btn"
            style={{
              opacity: !canUndo || isThinking ? 0.45 : 1,
              cursor: !canUndo || isThinking ? 'not-allowed' : 'pointer',
            }}
            title="Oxirgi yurishni qaytarish (Undo)"
          >
            <Undo2 size={15} />
            <span className="hide-on-small">Orqaga</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="btn-secondary header-action-btn"
            title="Yurishlar tarixi"
          >
            <History size={15} />
            <span className="hide-on-small">Tarix</span>
            {historyCount > 0 && <span className="counter-badge">{historyCount}</span>}
          </button>

          <button
            onClick={onNewGame}
            className="btn-secondary header-action-btn"
            title="Qayta boshlash"
          >
            <RotateCcw size={15} />
            <span className="hide-on-small">Qayta</span>
          </button>

          {/* Primary Settings Button */}
          <button
            onClick={onOpenSettings}
            className="btn-primary header-action-btn header-settings-btn"
            title="O'yin Sozlamalari"
          >
            <Settings size={16} />
            <span>Sozlamalar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
