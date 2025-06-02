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
  
  // Helper function to eliminate coins
  const eliminateCoins = (coinsToEliminate: number[], weightToEliminate?: 'heavy' | 'light') => {
    if (!weightToEliminate || weightMode !== 'either') {
      // If no specific weight to eliminate or not in 'either' mode, eliminate all instances
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
  
  // Helper function to create an array of all coin indices
  const allCoins = () => Array.from({ length: totalCoins }, (_, i) => i);
  
  // Helper function to get coins not on the scale
  const getCoinsOffScale = (leftCoins: number[], rightCoins: number[]) => {
    return allCoins()
      .filter(coin => !leftCoins.includes(coin) && !rightCoins.includes(coin));
  };

  // Helper to get coins that aren't on a specific side
  const allCoinsExcept = (except: number[]) => {
    return allCoins().filter(coin => !except.includes(coin));
  };

  // For each weighing result, we can eliminate some coins
  for (const weighResult of weighHistory) {
   
    const { leftCoins, rightCoins, result } = weighResult;
    const coinsOffScale = getCoinsOffScale(leftCoins, rightCoins);

    if (result === 'equal') {
      if (leftCoins.length === rightCoins.length) {
        // Equal number of coins and balanced = none of these coins are weighted
        eliminateCoins([...leftCoins, ...rightCoins]);
      } 
      else if (leftCoins.length > rightCoins.length) {
        if (weightMode === 'heavy') {
          // In heavy mode: if left has more coins but balances, this suggests 
          // that no coin is weighted (otherwise left would be even heavier)
          eliminateCoins(allCoins()); // All coins are normal
        }
        else if (weightMode === 'light') {
          // In light mode: if left has more coins but balances, 
          // this suggests a light coin on left is reducing weight to balance it
          // The light coin must be on the left side (reducing its weight)
          eliminateCoins(allCoinsExcept(leftCoins)); // Weighted coin must be on left
        }
        else if (weightMode === 'either') {
          // In either mode, multiple possibilities:
          // 1. Light coin on left (reduces left weight)
          // 2. Heavy coin on right (adds right weight)
          
          eliminateCoins(coinsOffScale); // Coins off scale can't be weighted
          eliminateCoins(leftCoins, 'heavy'); // No heavy on left
          eliminateCoins(rightCoins, 'light'); // No light on right
        }
      } 
      else { // leftCoins.length < rightCoins.length
        if (weightMode === 'light') {
          // In light mode: if right has more coins but balances, 
          // this suggests a light coin on right is reducing weight to balance it
          // The light coin must be on the right side (reducing its weight)
          eliminateCoins(allCoinsExcept(rightCoins)); // Weighted coin must be on right
        }
        else if (weightMode === 'heavy') {
          // In heavy mode: if right has more coins but balances, 
          // this suggests a heavy coin on right is adding weight to balance it
          // The heavy coin must be on the right side (adding to its weight)
          eliminateCoins(allCoinsExcept(rightCoins)); // Weighted coin must be on right
        }
        else if (weightMode === 'either') {
          // In either mode, multiple possibilities:
          // 1. Light coin on right (reduces right weight)
          // 2. Heavy coin on left (adds left weight)
          
          eliminateCoins(coinsOffScale); // Coins off scale can't be weighted
          eliminateCoins(rightCoins, 'heavy'); // No heavy on right
          eliminateCoins(leftCoins, 'light'); // No light on left
        }
      }
    } 
    else if (result === 'left') {
      // Left side is heavier
      if (leftCoins.length <= rightCoins.length) {
        if (weightMode === 'heavy') {
          // Left has fewer/equal coins but is heavier = heavy coin on left
          eliminateCoins(rightCoins); // No coin on right is weighted
          eliminateCoins(coinsOffScale); // No coin off scale is weighted
        }
        else if (weightMode === 'light') {
          // Left has fewer/equal coins but is heavier.
          // In light mode, this suggests the light coin must be on the right side
          // (making the right side lighter and therefore left appears heavier)
          eliminateCoins(leftCoins); // No coin on left is weighted
          eliminateCoins(coinsOffScale); // No coin off scale is weighted
        }
        else if (weightMode === 'either') {
          // In either mode, possibilities:
          // 1. Heavy coin on left (makes left heavier)
          // 2. Light coin on right (makes right lighter)
          
          eliminateCoins(coinsOffScale); // No coin off scale is weighted
          eliminateCoins(leftCoins, 'light'); // No light on left
          eliminateCoins(rightCoins, 'heavy'); // No heavy on right
        }
      }
      else { // leftCoins.length > rightCoins.length
        // Left has more coins and is heavier - expected in most cases
        if (weightMode === 'light' && leftCoins.length > rightCoins.length + 1) {
          // In light mode, if left has many more coins and is still heavier,
          // there's likely no light coin on left (which would reduce weight)
          eliminateCoins(leftCoins, 'light');
        }
        else if (weightMode === 'either' && leftCoins.length === rightCoins.length + 1) {
          // In either mode, if left has just one more coin and is heavier,
          // there's likely no light coin on left (would counteract the extra weight)
          eliminateCoins(leftCoins, 'light');
        }
      }
    } 
    else if (result === 'right') {
      // Right side is heavier
      if (rightCoins.length <= leftCoins.length) {
        if (weightMode === 'heavy') {
          // Right has fewer/equal coins but is heavier = heavy coin on right
          eliminateCoins(leftCoins); // No coin on left is weighted
          eliminateCoins(coinsOffScale); // No coin off scale is weighted
        }
        else if (weightMode === 'light') {
          // Right has fewer/equal coins but is heavier.
          // In light mode, this suggests the light coin must be on the left side
          // (making the left side lighter and therefore right appears heavier)
          eliminateCoins(rightCoins); // No coin on right is weighted
          eliminateCoins(coinsOffScale); // No coin off scale is weighted
        }
        else if (weightMode === 'either') {
          // In either mode, possibilities:
          // 1. Heavy coin on right (makes right heavier)
          // 2. Light coin on left (makes left lighter)
          
          eliminateCoins(coinsOffScale); // No coin off scale is weighted
          eliminateCoins(rightCoins, 'light'); // No light on right
          eliminateCoins(leftCoins, 'heavy'); // No heavy on left
        }
      }
      else { // rightCoins.length > leftCoins.length
        // Right has more coins and is heavier - expected in most cases
        if (weightMode === 'light' && rightCoins.length > leftCoins.length + 1) {
          // In light mode, if right has many more coins and is still heavier,
          // there's likely no light coin on right (which would reduce weight)
          eliminateCoins(rightCoins, 'light');
        }
        else if (weightMode === 'either' && rightCoins.length === leftCoins.length + 1) {
          // In either mode, if right has just one more coin and is heavier,
          // there's likely no light coin on right (would counteract the extra weight)
          eliminateCoins(rightCoins, 'light');
        }
      }
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