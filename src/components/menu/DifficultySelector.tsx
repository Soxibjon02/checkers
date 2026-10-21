import React from 'react';
import type { Difficulty } from '../../types/game';

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  difficulty,
  onChange,
}) => {
  const options: { id: Difficulty; label: string; desc: string }[] = [
    {
      id: 'easy',
      label: 'Easy',
      desc: 'Simple strategy, ideal for beginners',
    },
    {
      id: 'medium',
      label: 'Medium',
      desc: 'Evaluates center & material, shallow search',
    },
    {
      id: 'hard',
      label: 'Hard',
      desc: 'Deep Alpha-Beta Minimax with positional heuristics',
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
      {options.map((opt) => {
        const isSelected = difficulty === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '12px 10px',
              borderRadius: 'var(--radius-md)',
              border: isSelected
                ? '2px solid var(--accent-cyan)'
                : '1px solid var(--border-subtle)',
              background: isSelected
                ? 'rgba(56, 189, 248, 0.15)'
                : 'rgba(255, 255, 255, 0.03)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <span
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: isSelected ? 'var(--accent-cyan)' : 'var(--text-main)',
                marginBottom: '4px',
              }}
            >
              {opt.label}
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                lineHeight: 1.25,
                textAlign: 'center',
              }}
            >
              {opt.desc}
            </span>
          </button>
        );
      })}
    </div>
  );
};
