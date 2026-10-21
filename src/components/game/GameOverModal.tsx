import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Home, MinusCircle } from 'lucide-react';
import type { GameSettings, GameState, Player } from '../../types/game';

interface GameOverModalProps {
  status: GameState['status'];
  winner: Player | null;
  drawReason?: GameState['drawReason'];
  settings: GameSettings;
  onNewGame: () => void;
  onReturnToMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  status,
  winner,
  drawReason,
  settings,
  onNewGame,
  onReturnToMenu,
}) => {
  if (status === 'playing' || status === 'idle') return null;

  const isDraw = status === 'draw';
  const isHumanWinner =
    settings.gameMode === 'computer'
      ? winner === settings.playerSide
      : true;

  useEffect(() => {
    if (!isDraw && isHumanWinner) {
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e11d48', '#fbbf24', '#38bdf8', '#10b981'],
        });
      } catch {
        // Confetti optional
      }
    }
  }, [isDraw, isHumanWinner]);

  let title = '';
  let subtitle = '';

  if (isDraw) {
    title = 'Match Drawn';
    subtitle =
      drawReason === 'threefold-repetition'
        ? 'The identical board state occurred 3 times.'
        : drawReason === 'thirty-move-rule'
        ? '30 consecutive plies completed with kings without captures.'
        : 'The match concluded in a draw.';
  } else {
    const winnerName = winner === 'red' ? 'Red' : 'Black';
    if (settings.gameMode === 'computer') {
      title = isHumanWinner ? 'Victorious!' : 'Defeated';
      subtitle = isHumanWinner
        ? 'Congratulations! You outmaneuvered the computer.'
        : 'The computer outplayed your forces. Try another strategy!';
    } else {
      title = `${winnerName} Wins!`;
      subtitle = `${winnerName} player successfully eliminated all opponent threats.`;
    }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="game-over-title">
      <div className="modal-content">
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
          {isDraw ? (
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(148, 163, 184, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
              }}
            >
              <MinusCircle size={36} />
            </div>
          ) : (
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(251, 191, 36, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-gold)',
                boxShadow: '0 0 24px rgba(251, 191, 36, 0.3)',
              }}
            >
              <Trophy size={36} />
            </div>
          )}
        </div>

        <h2 id="game-over-title" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>
          {title}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '28px', lineHeight: 1.4 }}>
          {subtitle}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={onNewGame}
            className="btn-primary"
            style={{ width: '100%', padding: '14px' }}
          >
            <RotateCcw size={18} />
            <span>Play Again</span>
          </button>

          <button
            onClick={onReturnToMenu}
            className="btn-secondary"
            style={{ width: '100%', padding: '12px' }}
          >
            <Home size={18} />
            <span>Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
