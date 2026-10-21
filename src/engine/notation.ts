import type { Position } from '../types/game';

const COL_NAMES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export function posToNotation(pos: Position): string {
  const colName = COL_NAMES[pos.col] ?? '?';
  const rank = 8 - pos.row;
  return `${colName}${rank}`;
}

export function notationToPos(notation: string): Position | null {
  if (notation.length !== 2) return null;
  const colLetter = notation[0].toLowerCase();
  const rankNum = parseInt(notation[1], 10);
  const col = COL_NAMES.indexOf(colLetter);
  const row = 8 - rankNum;
  if (col < 0 || col > 7 || row < 0 || row > 7) return null;
  return { row, col };
}

export function formatMoveNotation(from: Position, to: Position, path: Position[], isCapture: boolean): string {
  if (!isCapture) {
    return `${posToNotation(from)}-${posToNotation(to)}`;
  }
  // For captures: from:step1:step2:...:to
  const allSteps = [from, ...path];
  const uniqueSteps: Position[] = [];
  for (let i = 0; i < allSteps.length; i++) {
    if (i === 0 || allSteps[i].row !== allSteps[i - 1].row || allSteps[i].col !== allSteps[i - 1].col) {
      uniqueSteps.push(allSteps[i]);
    }
  }
  return uniqueSteps.map(posToNotation).join(':');
}
