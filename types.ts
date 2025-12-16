export interface Puzzle {
  id: string;
  category: string;
  phrase: string;
}

export interface Player {
  id: number;
  name: string;
  score: number;
}

export const WheelSectorType = {
  POINT: 'POINT',
  BANKRUPT: 'BANKRUPT',
  PASS: 'PASS',
} as const;

export type WheelSectorType = typeof WheelSectorType[keyof typeof WheelSectorType];

export interface WheelSector {
  label: string;
  value: number;
  type: WheelSectorType;
  color: string;
  textColor: string;
}

export const GamePhase = {
  SPINNING: 0,
  GUESSING: 1,
  SOLVED: 2
} as const;

export type GamePhase = typeof GamePhase[keyof typeof GamePhase];