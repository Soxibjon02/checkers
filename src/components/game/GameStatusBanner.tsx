import React from 'react';
import { AlertTriangle, Bot, Sparkles, User } from 'lucide-react';
import type { GameSettings, GameState, Player } from '../../types/game';

interface GameStatusBannerProps {
  currentPlayer: Player;
  status: GameState['status'];
  winner: Player | null;
  drawReason?: GameState['drawReason'];
  mustCapture: boolean;
  isThinking: boolean;
  settings: GameSettings;
}

export const GameStatusBanner: React.FC<GameStatusBannerProps> = ({
  currentPlayer,
  status,
  winner,
  drawReason,
  mustCapture,
  isThinking,
  settings,
}) => {
  if (status !== 'playing') {
    let message = '';
    if (status === 'draw') {
      message =
        drawReason === 'threefold-repetition'
          ? 'Draw by Threefold Repetition'
          : drawReason === 'thirty-move-rule'
          ? 'Draw by 30-Ply Peaceful Kings Rule'
          : 'Game ended in a Draw';
    } else {
      const winnerName = winner === 'red' ? 'Red' : 'Black';
      message = `${winnerName} is Victorious!`;
    }

    return (
      <div className="status-banner" style={{ background: 'rgba(251, 191, 36, 0.15)', borderColor: 'rgba(251, 191, 36, 0.4)', color: '#fde047' }}>
        <Sparkles size={18} />
        <span>{message}</span>
      </div>
    );
  }

  if (isThinking) {
    return (
      <div className="status-banner status-thinking">
        <Bot size={18} className="spin-slow" />
        <span>Computer is calculating optimal move...</span>
      </div>
    );
  }

  if (mustCapture) {
    return (
      <div className="status-banner status-capture-alert">
        <AlertTriangle size={18} />
        <span>Mandatory capture! You must execute an available capture.</span>
      </div>
    );
  }

  const isComputerPlayer = settings.gameMode === 'computer' && currentPlayer !== settings.playerSide;
  const playerName = currentPlayer === 'red' ? 'Red' : 'Black';

  return (
    <div className="status-banner">
      {isComputerPlayer ? <Bot size={18} /> : <User size={18} />}
      <span>
        {playerName}'s Turn to Move
      </span>
    </div>
  );
};
