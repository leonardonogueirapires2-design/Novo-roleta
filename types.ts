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

export enum WheelSectorType {
  POINT = 'POINT',
  BANKRUPT = 'BANKRUPT',
  PASS = 'PASS',
}

export interface WheelSector {
  label: string;
  value: number;
  type: WheelSectorType;
  color: string;
  textColor: string;
}

export enum GamePhase {
  SPINNING,
  GUESSING,
  SOLVED
}
