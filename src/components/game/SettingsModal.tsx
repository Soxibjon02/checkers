import React from 'react';
import { X, Volume2, VolumeX, Palette, RotateCcw, HelpCircle, Bot, Users, Home } from 'lucide-react';
import type { GameSettings } from '../../types/game';
import { DifficultySelector } from '../menu/DifficultySelector';

interface SettingsModalProps {
  isOpen: boolean;
  settings: GameSettings;
  onClose: () => void;
  onUpdateSettings: (settings: Partial<GameSettings>) => void;
  onNewGame: () => void;
  onOpenRules: () => void;
  onReturnToMenu: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onUpdateSettings,
  onNewGame,
  onOpenRules,
  onReturnToMenu,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      onClick={onClose}
    >
      <div
        className="modal-content"
        style={{
          maxWidth: '540px',
          textAlign: 'left',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px 26px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            paddingBottom: '12px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)',
              }}
            >
              <Palette size={20} />
            </div>
            <div>
              <h2 id="settings-title" style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                O'yin Sozlamalari (Settings)
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Tashqi ko'rinish va o'yin parametrlari
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-icon"
            aria-label="Sozlamalarni yopish"
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Board Theme */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-dim)',
                marginBottom: '10px',
              }}
            >
              Doska Ko'rinishi (Board Theme)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {(
                [
                  { id: 'classic', name: 'Classic', color1: '#cbd5e1', color2: '#1e293b' },
                  { id: 'wood', name: 'Royal Wood', color1: '#dfc19c', color2: '#4a2c1d' },
                  { id: 'slate', name: 'Obsidian Slate', color1: '#94a3b8', color2: '#182234' },
                ] as const
              ).map((thm) => {
                const isSelected = settings.boardTheme === thm.id;
                return (
                  <button
                    key={thm.id}
                    type="button"
                    onClick={() => onUpdateSettings({ boardTheme: thm.id })}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '12px 8px',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected
                        ? '2px solid var(--accent-gold)'
                        : '1px solid var(--border-subtle)',
                      background: isSelected
                        ? 'rgba(251, 191, 36, 0.12)'
                        : 'rgba(255, 255, 255, 0.03)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {/* Swatch */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        width: '38px',
                        height: '38px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        marginBottom: '8px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                      }}
                    >
                      <div style={{ background: thm.color1 }} />
                      <div style={{ background: thm.color2 }} />
                      <div style={{ background: thm.color2 }} />
                      <div style={{ background: thm.color1 }} />
                    </div>
                    <span
                      style={{
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        color: isSelected ? 'var(--accent-gold)' : 'var(--text-main)',
                      }}
                    >
                      {thm.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sound Toggle */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-dim)',
                marginBottom: '10px',
              }}
            >
              Tovush Effektlari (Sound)
            </label>
            <button
              type="button"
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className="btn-secondary"
              style={{
                width: '100%',
                justifyContent: 'space-between',
                padding: '12px 18px',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {settings.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                <span>O'yin Tovushlari</span>
              </span>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  background: settings.soundEnabled
                    ? 'rgba(16, 185, 129, 0.2)'
                    : 'rgba(244, 63, 94, 0.2)',
                  color: settings.soundEnabled ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                }}
              >
                {settings.soundEnabled ? 'Yoniq (ON)' : "O'chiq (OFF)"}
              </span>
            </button>
          </div>

          {/* Game Mode */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-dim)',
                marginBottom: '10px',
              }}
            >
              O'yin Rejimi (Game Mode)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  onUpdateSettings({ gameMode: 'computer' });
                  onNewGame();
                }}
                className="btn-secondary"
                style={{
                  padding: '12px',
                  border:
                    settings.gameMode === 'computer'
                      ? '2px solid var(--accent-rose)'
                      : '1px solid var(--border-subtle)',
                  background:
                    settings.gameMode === 'computer'
                      ? 'rgba(225, 29, 72, 0.14)'
                      : 'rgba(255, 255, 255, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Bot size={18} color="var(--accent-rose)" />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>vs Computer</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onUpdateSettings({ gameMode: 'two-player' });
                  onNewGame();
                }}
                className="btn-secondary"
                style={{
                  padding: '12px',
                  border:
                    settings.gameMode === 'two-player'
                      ? '2px solid var(--accent-cyan)'
                      : '1px solid var(--border-subtle)',
                  background:
                    settings.gameMode === 'two-player'
                      ? 'rgba(56, 189, 248, 0.14)'
                      : 'rgba(255, 255, 255, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Users size={18} color="var(--accent-cyan)" />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>2 Players</span>
              </button>
            </div>
          </div>

          {/* AI Difficulty (if computer mode) */}
          {settings.gameMode === 'computer' && (
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text-dim)',
                  marginBottom: '10px',
                }}
              >
                AI Qiyinchilik Darajasi (Difficulty)
              </label>
              <DifficultySelector
                difficulty={settings.difficulty}
                onChange={(difficulty) => onUpdateSettings({ difficulty })}
              />
            </div>
          )}

          {/* Action buttons */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              paddingTop: '10px',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <button
              type="button"
              onClick={() => {
                onClose();
                onNewGame();
              }}
              className="btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              <RotateCcw size={16} />
              <span>Yangi O'yin Boshlash (New Game)</span>
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRules();
                }}
                className="btn-secondary"
                style={{ padding: '10px', fontSize: '0.85rem' }}
              >
                <HelpCircle size={15} />
                <span>Qoidalar</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onReturnToMenu();
                }}
                className="btn-secondary"
                style={{ padding: '10px', fontSize: '0.85rem' }}
              >
                <Home size={15} />
                <span>Bosh Menyu</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
