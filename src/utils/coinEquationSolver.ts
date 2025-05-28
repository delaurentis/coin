import { WeighResult } from '../types';

/**
 * Determines which coins could potentially be weighted based on weighing history
 * Uses a system of linear equations approach to identify coins that must have normal weight
 * @param weighHistory Array of weighing results
 * @param totalCoins Total number of coins in the game
 * @returns Array of indices representing coins that could potentially be weighted
 */
export function getPotentialWeightedCoins(
  weighHistory: WeighResult[],
  totalCoins: number
): number[] {
  // If no weighings have been done, all coins are potential weighted coins
  if (weighHistory.length === 0) {
    return Array.from({ length: totalCoins }, (_, i) => i);
  }

  // Create an array to track which coins are potential weighted coins
  // Initially, all coins are potential weighted coins
  const potentialWeightedCoins = Array.from({ length: totalCoins }, (_, i) => i);
  
  // Helper function to remove coins from potential weighted coins
  // No protection here - this is just for simulation calculations
  const eliminateCoins = (coinsToEliminate: number[]) => {
    for (const coinIndex of coinsToEliminate) {
      const index = potentialWeightedCoins.indexOf(coinIndex);
      if (index !== -1) {
        potentialWeightedCoins.splice(index, 1);
      }
    }
  };
  
  // Helper function to get coins not on the scale
  const getCoinsOffScale = (leftCoins: number[], rightCoins: number[]) => {
    return Array.from({ length: totalCoins }, (_, i) => i)
      .filter(coin => !leftCoins.includes(coin) && !rightCoins.includes(coin));
  };
  
  // For each weighing result, we can eliminate some coins
  for (const weighResult of weighHistory) {
    const { leftCoins, rightCoins, result } = weighResult;
    
    if (result === 'equal') {
      if (leftCoins.length === rightCoins.length) {
        // If equal number of coins on both sides AND they balance,
        // then none of the coins on either side can be weighted
        eliminateCoins([...leftCoins, ...rightCoins]);
      } else if (leftCoins.length > rightCoins.length) {
        // If left side has more coins but they balance, 
        // then the weighted coin must be on the left side
        // (since it's adding weight to balance the extra coins)
        const nonLeftCoins = Array.from({ length: totalCoins }, (_, i) => i)
          .filter(coin => !leftCoins.includes(coin));
        eliminateCoins(nonLeftCoins);
      } else {
        // If right side has more coins but they balance,
        // then the weighted coin must be on the right side
        const nonRightCoins = Array.from({ length: totalCoins }, (_, i) => i)
          .filter(coin => !rightCoins.includes(coin));
        eliminateCoins(nonRightCoins);
      }
    } else if (result === 'left') {
      // Left side is heavier
      if (leftCoins.length <= rightCoins.length) {
        // If left has fewer coins but is still heavier, weighted coin must be on left
        // OR if equal number of coins on both sides, the weighted coin must be on the left
        // so coins on the right side cannot be weighted
        eliminateCoins(rightCoins);
        
        // Coins not on the scale cannot be the weighted coin in this case
        eliminateCoins(getCoinsOffScale(leftCoins, rightCoins));
      }
      // If left has more coins and is heavier, we can't determine anything for sure
      // (could be weighted coin or just more coins)
    } else if (result === 'right') {
      // Right side is heavier
      if (leftCoins.length >= rightCoins.length) {
        // If right has fewer coins but is still heavier, weighted coin must be on right
        // OR if equal number of coins on both sides, the weighted coin must be on the right
        // so coins on the left side cannot be weighted
        eliminateCoins(leftCoins);
        
        // Coins not on the scale cannot be the weighted coin in this case
        eliminateCoins(getCoinsOffScale(leftCoins, rightCoins));
      }
      // If right has more coins and is heavier, we can't determine anything for sure
      // (could be weighted coin or just more coins)
    }
  }
  
  return potentialWeightedCoins;
}