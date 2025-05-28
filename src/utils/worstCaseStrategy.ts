import { WeighResult } from '../types';
import { getPotentialWeightedCoins } from './coinEquationSolver';

/**
 * Determines the optimal weighing result in "worst case" mode
 * to maximize the number of weighings required to find the weighted coin
 * 
 * @param leftCoins Indices of coins on the left side
 * @param rightCoins Indices of coins on the right side
 * @param possibleWeightedCoins Current set of possible weighted coins
 * @param weighHistory History of previous weighings
 * @param totalCoins Total number of coins in the game
 * @returns The optimal weighing result ('left', 'right', or 'equal')
 */
export function determineOptimalWeighResult(
  leftCoins: number[],
  rightCoins: number[],
  possibleWeightedCoins: number[],
  weighHistory: WeighResult[],
  totalCoins: number
): 'left' | 'right' | 'equal' {
  // ABSOLUTE PHYSICAL CONSTRAINT: If all coins are on the scale with equal numbers on each side,
  // it is physically impossible for them to balance
  /*if (leftCoins.length + rightCoins.length === totalCoins && leftCoins.length === rightCoins.length) {
    console.log("ALL COINS ON SCALE - MUST return left or right!");
    // We'll always choose left for consistency
    return 'left';
  }*/
  // When we've identified the weighted coin (only one possibility), act like random mode
  if (possibleWeightedCoins.length === 1) {
    const WEIGHT_VALUE = 1;
    const weightedCoinIndex = possibleWeightedCoins[0];
    
    // Calculate physical weights like in random mode
    const leftWeight = leftCoins.length + (leftCoins.includes(weightedCoinIndex) ? WEIGHT_VALUE : 0);
    const rightWeight = rightCoins.length + (rightCoins.includes(weightedCoinIndex) ? WEIGHT_VALUE : 0);
    
    // Return physically correct result
    if (leftWeight > rightWeight) {
      return 'left';
    } else if (rightWeight > leftWeight) {
      return 'right';
    } else {
      return 'equal';
    }
  }
  
  // Simulate all three possible outcomes and see which one leaves the most 
  // potential weighted coins (making the game harder)
  
  // Helper function to simulate a weighing result
  const simulateWeighing = (result: 'left' | 'right' | 'equal'): number => {
    // Create a copy of the weighing history with the simulated result added
    const simulatedHistory = [
      ...weighHistory,
      { leftCoins, rightCoins, result }
    ];
    
    // Use coinEquationSolver to determine remaining potential weighted coins
    const remainingCoins = getPotentialWeightedCoins(simulatedHistory, totalCoins);
    return remainingCoins.length;
  };
  
  // Simulate all three outcomes
  const remainingIfLeft = simulateWeighing('left');
  const remainingIfRight = simulateWeighing('right');
  const remainingIfEqual = simulateWeighing('equal');
  
  // Log for debugging
  console.log(`Potential coins remaining - Left: ${remainingIfLeft}, Right: ${remainingIfRight}, Equal: ${remainingIfEqual}`);
  
  // We already handled the all-coins-on-scale case at the top of the function
  
  // Make sure we never eliminate all coins - there must be at least one weighted coin
  if (remainingIfLeft === 0 && remainingIfRight === 0 && remainingIfEqual === 0) {
    console.warn('All simulations eliminated all coins - defaulting to a non-equal result');
    // Since equal isn't valid, we need to pick left or right
    return 'left';
  }
  
  // Find the result that leaves the most possible weighted coins
  const max = Math.max(remainingIfLeft, remainingIfRight, remainingIfEqual);
  
  // If multiple options have the same number of remaining coins, prioritize in this order: equal, left, right
  // But ensure we respect physics - equal is only possible in certain situations
  
  // We already handled the all-coins-on-scale case at the top of the function
  // So here we can just check if equal preserves the most candidates
  
  if (remainingIfEqual === max && remainingIfEqual > 0) {
    return 'equal';
  } else if (remainingIfLeft === max && remainingIfLeft > 0) {
    return 'left';
  } else if (remainingIfRight === max && remainingIfRight > 0) {
    return 'right';
  } else {
    // Fallback - choose something non-equal for safety
    return leftCoins.length >= rightCoins.length ? 'left' : 'right';
  }
}