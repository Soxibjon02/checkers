import React from 'react';
import { Volume2, VolumeX, HelpCircle, Home, RotateCcw } from 'lucide-react';
import type { GameSettings } from '../../types/game';

interface GameHeaderProps {
  settings: GameSettings;
  onToggleSound: () => void;
  onOpenRules: () => void;
  onReturnToMenu: () => void;
  onNewGame: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  settings,
  onToggleSound,
  onOpenRules,
  onReturnToMenu,
  onNewGame,
}) => {
  return (
    <header className="glass-panel" style={{ padding: '14px 24px', margin: '16px 24px 0 24px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1250px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={onReturnToMenu}
            className="btn-icon"
            title="Return to Menu"
            aria-label="Return to Main Menu"
          >
            <Home size={18} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                CHECKERS <span style={{ color: 'var(--accent-rose)', fontWeight: 800 }}>PRO</span>
              </h1>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                {settings.gameMode === 'computer'
                  ? `AI · ${settings.difficulty}`
                  : '2 Players'}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Russian Draughts (Flying Kings & In-Flight Promotion)
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onNewGame}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            title="Restart Game"
          >
            <RotateCcw size={15} />
            <span>Restart</span>
          </button>

          <button
            onClick={onToggleSound}
            className="btn-icon"
            title={settings.soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            aria-label={settings.soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {settings.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          <button
            onClick={onOpenRules}
            className="btn-icon"
            title="Game Rules"
            aria-label="View Checkers Rules"
          >
            <HelpCircle size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
