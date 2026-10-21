import React from 'react';
import { motion } from 'motion/react';
import { Crown } from 'lucide-react';
import type { Piece } from '../../types/game';

interface CheckerPieceProps {
  piece: Piece;
  isSelected: boolean;
  canBeCaptured?: boolean;
}

export const CheckerPiece: React.FC<CheckerPieceProps> = ({
  piece,
  isSelected,
}) => {
  const isRed = piece.player === 'red';
  const isKing = piece.type === 'king';

  return (
    <motion.div
      layoutId={piece.id}
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{
        scale: isSelected ? 1.1 : 1,
        opacity: 1,
      }}
      exit={{ scale: 0.2, opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 420,
        damping: 28,
        mass: 0.8,
      }}
      className={`checker-piece ${isRed ? 'piece-red' : 'piece-black'} ${
        isSelected ? 'piece-selected' : ''
      }`}
      aria-label={`${piece.player} ${piece.type}`}
    >
      <div className="piece-inner-ring">
        {isKing && (
          <motion.div
            initial={{ scale: 0, rotate: -25 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          >
            <Crown className="crown-icon" size={20} strokeWidth={2.4} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
