import { WeighResult, CoinCandidate, WeightMode } from '../types';
import { getCoinValueFromWeightMode } from './coinValue';

/**
 * Determines which coins could potentially be weighted based on weighing history
 * @param weighHistory Array of weighing results
 * @param totalCoins Total number of coins in the game
 * @param weightMode The current weight mode (heavy, light, or either)
 * @returns Array of CoinCandidate objects representing coins that could potentially be weighted
 */
export function getPotentialWeightedCoins(
  weighHistory: WeighResult[],
  totalCoins: number,
  weightMode: WeightMode
): CoinCandidate[] {
  // If no weighings have been done, all coins are potential weighted coins
  if (weighHistory.length === 0) {
    return generateInitialCandidates(totalCoins, weightMode);
  }

  // Create an array to track which coins are potential weighted coins
  // Initially, all coins are potential weighted coins
  let potentialWeightedCoins = generateInitialCandidates(totalCoins, weightMode);
  
  // Helper function to remove specific coin/weight combinations
  // No protection here - this is just for simulation calculations
  const eliminateCoins = (coinsToEliminate: number[], weightToEliminate?: 'heavy' | 'light') => {
    if (!weightToEliminate || weightMode !== 'either') {
      // If no specific weight to eliminate or not in 'either' mode, eliminate all instances of the coins
      potentialWeightedCoins = potentialWeightedCoins.filter(
        candidate => !coinsToEliminate.includes(candidate.index)
      );
    } else {
      // In 'either' mode with a specific weight to eliminate
      const valueToEliminate = weightToEliminate === 'heavy' ? 
                              getCoinValueFromWeightMode('heavy') : 
                              getCoinValueFromWeightMode('light');
      
      // Filter out only the combinations with the specified indices AND weight
      potentialWeightedCoins = potentialWeightedCoins.filter(
        candidate => !(coinsToEliminate.includes(candidate.index) && candidate.value === valueToEliminate)
      );
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
      } else if (leftCoins.length < rightCoins.length) {
        // If right side has more coins but they balance,
        // then the weighted coin must be on the right side
        const nonRightCoins = Array.from({ length: totalCoins }, (_, i) => i)
          .filter(coin => !rightCoins.includes(coin));
        eliminateCoins(nonRightCoins);
      }
    } else if (result === 'left') {
      // Left side is heavier
      if ((leftCoins.length <= rightCoins.length && weightMode === 'heavy') ||
          (leftCoins.length >= rightCoins.length && weightMode === 'light')) {
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
      if (leftCoins.length >= rightCoins.length && weightMode === 'heavy' ||
          leftCoins.length <= rightCoins.length && weightMode === 'light') {
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

/**
 * Generates the initial set of coin candidates based on the weight mode
 * @param totalCoins Total number of coins in the game
 * @param weightMode The current weight mode (heavy, light, or either)
 * @returns Array of CoinCandidate objects
 */
function generateInitialCandidates(totalCoins: number, weightMode: WeightMode): CoinCandidate[] {
  const candidates: CoinCandidate[] = [];
  
  if (weightMode === 'either') {
    // For 'either' mode, we need to create two candidates for each coin index
    // One for heavy and one for light
    for (let i = 0; i < totalCoins; i++) {
      candidates.push({ index: i, value: getCoinValueFromWeightMode('heavy') });
      candidates.push({ index: i, value: getCoinValueFromWeightMode('light') });
    }
  } else {
    // For 'heavy' or 'light' mode, we create one candidate per coin with the appropriate value
    for (let i = 0; i < totalCoins; i++) {
      candidates.push({ index: i, value: getCoinValueFromWeightMode(weightMode) });
    }
  }
  
  return candidates;
}