import React from 'react';
import { X, History } from 'lucide-react';
import type { GameHistoryEntry } from '../../types/game';

interface HistoryModalProps {
  isOpen: boolean;
  history: GameHistoryEntry[];
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  history,
  onClose,
}) => {
  if (!isOpen) return null;

  // Group moves into pairs
  const movePairs: { turnNumber: number; red?: GameHistoryEntry; black?: GameHistoryEntry }[] = [];
  for (let i = 0; i < history.length; i++) {
    const entry = history[i];
    const turnIndex = Math.floor(i / 2);
    if (!movePairs[turnIndex]) {
      movePairs[turnIndex] = { turnNumber: turnIndex + 1 };
    }
    if (entry.player === 'red') {
      movePairs[turnIndex].red = entry;
    } else {
      movePairs[turnIndex].black = entry;
    }
  }

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-title"
      onClick={onClose}
    >
      <div
        className="modal-content"
        style={{
          maxWidth: '460px',
          textAlign: 'left',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={18} color="var(--accent-cyan)" />
            <h2 id="history-title" style={{ fontSize: '1.2rem', fontWeight: 800 }}>
              Yurishlar Tarixi (Move History)
            </h2>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Yopish">
            <X size={18} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', maxHeight: '55vh', paddingRight: '4px' }}>
          {movePairs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
              Hozircha birorta yurish amalga oshirilmadi.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {movePairs.map((pair) => (
                <div key={pair.turnNumber} className="history-row">
                  <span className="history-number">{pair.turnNumber}.</span>
                  <span className={pair.red === history[history.length - 1] ? 'history-move-active' : ''}>
                    {pair.red?.notation ?? '-'}
                  </span>
                  <span className={pair.black === history[history.length - 1] ? 'history-move-active' : ''}>
                    {pair.black?.notation ?? ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
