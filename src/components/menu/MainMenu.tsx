import React from 'react';
import { Bot, Users, Volume2, VolumeX, HelpCircle, Play, Crown } from 'lucide-react';
import type { GameSettings } from '../../types/game';
import { DifficultySelector } from './DifficultySelector';

interface MainMenuProps {
  settings: GameSettings;
  onUpdateSettings: (settings: Partial<GameSettings>) => void;
  onStartGame: () => void;
  onOpenRules: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  settings,
  onUpdateSettings,
  onStartGame,
  onOpenRules,
}) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'radial-gradient(circle at 50% 30%, #152244 0%, var(--bg-deep) 75%)',
      }}
    >
      <div
        className="glass-panel"
        style={{
          maxWidth: '560px',
          width: '100%',
          padding: '36px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)',
        }}
      >
        {/* Header Branding */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #e11d48, #9f1239)',
              color: 'var(--accent-gold)',
              boxShadow: '0 8px 24px rgba(225, 29, 72, 0.4)',
              marginBottom: '14px',
            }}
          >
            <Crown size={28} />
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            CHECKERS <span style={{ color: 'var(--accent-rose)' }}>PRO</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '6px' }}>
            Russian Draughts · Flying Kings · Alpha-Beta AI
          </p>
        </div>

        {/* Game Mode Selection */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-dim)',
              marginBottom: '10px',
            }}
          >
            Select Game Mode
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button
              type="button"
              onClick={() => onUpdateSettings({ gameMode: 'computer' })}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                border:
                  settings.gameMode === 'computer'
                    ? '2px solid var(--accent-rose)'
                    : '1px solid var(--border-subtle)',
                background:
                  settings.gameMode === 'computer'
                    ? 'rgba(225, 29, 72, 0.12)'
                    : 'rgba(255, 255, 255, 0.03)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(225, 29, 72, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-rose)',
                }}
              >
                <Bot size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>vs Computer</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Solo match</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onUpdateSettings({ gameMode: 'two-player' })}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                border:
                  settings.gameMode === 'two-player'
                    ? '2px solid var(--accent-cyan)'
                    : '1px solid var(--border-subtle)',
                background:
                  settings.gameMode === 'two-player'
                    ? 'rgba(56, 189, 248, 0.12)'
                    : 'rgba(255, 255, 255, 0.03)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(56, 189, 248, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-cyan)',
                }}
              >
                <Users size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>2 Players</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pass & play</div>
              </div>
            </button>
          </div>
        </div>

        {/* AI Difficulty Selector (if computer mode) */}
        {settings.gameMode === 'computer' && (
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text-dim)',
                marginBottom: '10px',
              }}
            >
              Computer Difficulty
            </label>
            <DifficultySelector
              difficulty={settings.difficulty}
              onChange={(difficulty) => onUpdateSettings({ difficulty })}
            />
          </div>
        )}

        {/* Board Visual Theme */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-dim)',
              marginBottom: '10px',
            }}
          >
            Board Theme
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {(['classic', 'wood', 'slate'] as const).map((thm) => {
              const active = settings.boardTheme === thm;
              return (
                <button
                  key={thm}
                  type="button"
                  onClick={() => onUpdateSettings({ boardTheme: thm })}
                  style={{
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: active ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                    background: active ? 'rgba(251, 191, 36, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    textTransform: 'capitalize',
                    color: active ? 'var(--accent-gold)' : 'var(--text-muted)',
                  }}
                >
                  {thm}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sound and Rules Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
          <button
            type="button"
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            {settings.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>Sound: {settings.soundEnabled ? 'On' : 'Off'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenRules}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <HelpCircle size={16} />
            <span>Rules Guide</span>
          </button>
        </div>

        {/* Start Game Action */}
        <button
          type="button"
          onClick={onStartGame}
          className="btn-primary"
          style={{ width: '100%', padding: '16px', fontSize: '1.05rem', marginTop: '6px' }}
        >
          <Play size={20} fill="currentColor" />
          <span>START GAME</span>
        </button>
      </div>
    </div>
  );
};
