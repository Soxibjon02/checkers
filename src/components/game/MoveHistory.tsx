import React, { useEffect, useRef } from 'react';
import type { Board, GameHistoryEntry, GameSettings, Player } from '../../types/game';
import { countPieces } from '../../engine/board';

interface MoveHistoryProps {
  board: Board;
  currentPlayer: Player;
  history: GameHistoryEntry[];
  settings: GameSettings;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({
  board,
  currentPlayer,
  history,
  settings,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const counts = countPieces(board);

  // Auto-scroll to bottom of move list
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history.length]);

  // Group moves into pairs (turn 1: red, black; turn 2: red, black, etc.)
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

  const redName = settings.gameMode === 'computer' && settings.playerSide === 'red' ? 'You (Red)' : 'Red Player';
  const blackName = settings.gameMode === 'computer' && settings.playerSide === 'black' ? 'You (Black)' : settings.gameMode === 'computer' ? `Computer (${settings.difficulty})` : 'Black Player';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Player 1 Card (Black / Top) */}
      <div className={`player-card ${currentPlayer === 'black' ? 'active-turn' : ''}`}>
        <div className="player-info">
          <div className="player-avatar avatar-black" />
          <div>
            <div className="player-name">{blackName}</div>
            <div className="player-details">
              {counts.totalBlack} pieces ({counts.blackKings} {counts.blackKings === 1 ? 'king' : 'kings'}) · Captured: {12 - counts.totalRed}
            </div>
          </div>
        </div>
        {currentPlayer === 'black' && <span className="turn-pill">Turn</span>}
      </div>

      {/* Player 2 Card (Red / Bottom) */}
      <div className={`player-card ${currentPlayer === 'red' ? 'active-turn' : ''}`}>
        <div className="player-info">
          <div className="player-avatar avatar-red" />
          <div>
            <div className="player-name">{redName}</div>
            <div className="player-details">
              {counts.totalRed} pieces ({counts.redKings} {counts.redKings === 1 ? 'king' : 'kings'}) · Captured: {12 - counts.totalBlack}
            </div>
          </div>
        </div>
        {currentPlayer === 'red' && <span className="turn-pill">Turn</span>}
      </div>

      {/* History Panel */}
      <div className="history-panel">
        <div className="history-header">
          <span className="history-title">Move History</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            {history.length} {history.length === 1 ? 'ply' : 'plies'}
          </span>
        </div>

        <div className="history-list" ref={scrollRef}>
          {movePairs.length === 0 ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
              No moves played yet.
            </div>
          ) : (
            movePairs.map((pair) => (
              <div key={pair.turnNumber} className="history-row">
                <span className="history-number">{pair.turnNumber}.</span>
                <span className={pair.red === history[history.length - 1] ? 'history-move-active' : ''}>
                  {pair.red?.notation ?? '-'}
                </span>
                <span className={pair.black === history[history.length - 1] ? 'history-move-active' : ''}>
                  {pair.black?.notation ?? ''}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
