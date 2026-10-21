import React from 'react';
import { Undo2, RotateCcw, Palette } from 'lucide-react';
import type { GameSettings } from '../../types/game';

interface GameControlsProps {
  canUndo: boolean;
  isThinking: boolean;
  settings: GameSettings;
  onUndo: () => void;
  onNewGame: () => void;
  onUpdateSettings: (settings: Partial<GameSettings>) => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  canUndo,
  isThinking,
  settings,
  onUndo,
  onNewGame,
  onUpdateSettings,
}) => {
  const nextTheme =
    settings.boardTheme === 'classic'
      ? 'wood'
      : settings.boardTheme === 'wood'
      ? 'slate'
      : 'classic';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div className="controls-bar">
        <button
          onClick={onUndo}
          disabled={!canUndo || isThinking}
          className="btn-secondary"
          style={{ opacity: !canUndo || isThinking ? 0.45 : 1, cursor: !canUndo || isThinking ? 'not-allowed' : 'pointer' }}
          title="Undo Last Move"
        >
          <Undo2 size={16} />
          <span>Undo</span>
        </button>

        <button
          onClick={onNewGame}
          className="btn-primary"
          title="Start Fresh Game"
        >
          <RotateCcw size={16} />
          <span>New Game</span>
        </button>
      </div>

      <button
        onClick={() => onUpdateSettings({ boardTheme: nextTheme })}
        className="btn-secondary"
        style={{ fontSize: '0.85rem', padding: '8px 14px', width: '100%', justifyContent: 'space-between' }}
        title="Switch Board Visual Theme"
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Palette size={15} />
          <span>Board Theme</span>
        </span>
        <span style={{ textTransform: 'capitalize', color: 'var(--accent-cyan)', fontWeight: 600 }}>
          {settings.boardTheme}
        </span>
      </button>
    </div>
  );
};
