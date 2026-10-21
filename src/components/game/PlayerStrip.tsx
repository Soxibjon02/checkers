import React from 'react';
import type { GameSettings, Player } from '../../types/game';

interface PlayerStripProps {
  player: Player;
  isCurrentTurn: boolean;
  totalPieces: number;
  kingsCount: number;
  capturedCount: number;
  settings: GameSettings;
}

export const PlayerStrip: React.FC<PlayerStripProps> = ({
  player,
  isCurrentTurn,
  totalPieces,
  kingsCount,
  capturedCount,
  settings,
}) => {
  const isRed = player === 'red';

  let playerName = '';
  if (settings.gameMode === 'computer') {
    if (isRed) {
      playerName = settings.playerSide === 'red' ? 'Siz (Qizil)' : `Kompyuter (${settings.difficulty})`;
    } else {
      playerName = settings.playerSide === 'black' ? 'Siz (Oq)' : `Kompyuter (${settings.difficulty})`;
    }
  } else {
    playerName = isRed ? "Qizil O'yinchi" : "Qora / Oq O'yinchi";
  }

  return (
    <div className={`player-strip ${isCurrentTurn ? 'strip-active' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div className={`player-avatar ${isRed ? 'avatar-red' : 'avatar-black'}`} />
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.92rem', lineHeight: 1.2 }}>
            {playerName}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            {totalPieces} tosh ({kingsCount} shoh) · Urib olingan: {capturedCount}
          </div>
        </div>
      </div>

      {isCurrentTurn && (
        <span className="turn-pill">
          Navbat
        </span>
      )}
    </div>
  );
};
