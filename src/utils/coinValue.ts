import { WeightMode } from '../types';

// Weight constants
const LIGHT_COIN_VALUE = 0.5;
const HEAVY_COIN_VALUE = 2;

/**
 * Determines the appropriate coin value based on the weight mode
 * @param mode The weight mode (heavy, light, or either)
 * @returns The numerical value for the weighted coin
 */
export function getCoinValueFromWeightMode(mode: WeightMode): number {
  switch (mode) {
    case 'heavy':
      return HEAVY_COIN_VALUE;
    case 'light':
      return LIGHT_COIN_VALUE;
    case 'either':
      return Math.random() < 0.5 ? LIGHT_COIN_VALUE : HEAVY_COIN_VALUE;
    default:
      return HEAVY_COIN_VALUE; // Default to heavy if somehow invalid
  }
}