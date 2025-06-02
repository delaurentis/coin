export interface WeighResult {
  leftCoins: number[];
  rightCoins: number[];
  result: 'left' | 'right' | 'equal';
  remainingCandidates?: number[]; // Possible weighted coins after this weighing
}

export type WeightMode = 'heavy' | 'light' | 'either';

