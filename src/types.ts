export interface CoinCandidate {
  index: number;
  value: number;
}

export interface WeighResult {
  leftCoins: number[];
  rightCoins: number[];
  result: 'left' | 'right' | 'equal';
  remainingCandidates?: CoinCandidate[]; // Possible weighted coins after this weighing
}

export type WeightMode = 'heavy' | 'light' | 'either';

