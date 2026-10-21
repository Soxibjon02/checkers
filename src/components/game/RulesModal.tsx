import React from 'react';
import { X } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rules-title"
      onClick={onClose}
    >
      <div
        className="modal-content"
        style={{ maxWidth: '640px', textAlign: 'left', maxHeight: '85vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 id="rules-title" style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              Russian Checkers Rules (Shashki)
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Official 8×8 rules engine implemented in Checkers Pro
            </p>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Close Rules Dialog">
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
          <section>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '6px' }}>
              1. Board Setup & Ordinary Movement
            </h3>
            <p>
              Played on an 8×8 board using the 32 dark squares. Each player commands 12 pieces.
              Ordinary men move diagonally forward one empty square towards the opponent's back rank.
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-rose)', marginBottom: '6px' }}>
              2. Mandatory & Backward Captures
            </h3>
            <p>
              <strong>Captures are mandatory:</strong> If a capture exists on your turn, you are strictly required to execute it.
              Unlike standard American checkers, <em>ordinary men can capture both forward AND backward</em>.
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '6px' }}>
              3. Flying Kings & Distant Captures
            </h3>
            <p>
              When a piece reaches the opponent's back rank, it is crowned a <strong>Flying King (Dame)</strong>.
              Kings move diagonally across any distance of unoccupied squares.
              A King can jump an enemy piece from any distance along a diagonal and land on any vacant square beyond it.
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '6px' }}>
              4. In-Flight King Promotion ("Flying Promotion")
            </h3>
            <p>
              If an ordinary man enters the promotion rank <em>during a multi-jump sequence</em>, it promotes to a King immediately and must continue capturing on that same turn as a flying king!
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-emerald)', marginBottom: '6px' }}>
              5. Multi-Capture Continuity & Turkish Strike
            </h3>
            <p>
              If another capture is available upon landing, the piece must continue capturing.
              A piece cannot jump over the same enemy piece twice in a single turn.
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
              6. Victory & Supported Draw Conditions
            </h3>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>
                <strong>Victory:</strong> You win by capturing all opponent pieces OR by blocking all legal moves of the opponent (stalemate is a loss for the blocked player).
              </li>
              <li>
                <strong>Threefold Repetition Draw:</strong> Occurs when the exact same board configuration occurs three times.
              </li>
              <li>
                <strong>30-Ply Kings Rule Draw:</strong> Occurs when 30 consecutive half-moves are made with kings without any captures or ordinary piece moves.
              </li>
            </ul>
          </section>
        </div>

        <div style={{ marginTop: '28px', textAlign: 'right' }}>
          <button onClick={onClose} className="btn-primary" style={{ padding: '10px 24px' }}>
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
