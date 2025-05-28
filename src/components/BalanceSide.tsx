import React from 'react';
import styles from './BalanceSide.module.css';
import Coin from './Coin';

interface BalanceSideProps {
  coins: number[];
  side: 'left' | 'right';
  isSelected: boolean;
  onSelect: () => void;
  onCoinClick?: (index: number) => void;
}

const BalanceSide: React.FC<BalanceSideProps> = ({ 
  coins, 
  side, 
  isSelected, 
  onSelect,
  onCoinClick
}) => {
  // Calculate the pyramid layout based on total coins
  const calculatePyramidRows = (totalCoins: number): number[] => {
    if (totalCoins === 0) return [];
    
    // Special cases for specific coin counts
    if (totalCoins === 1) return [1];
    if (totalCoins === 2) return [2];
    if (totalCoins === 3) return [2, 1];
    if (totalCoins === 4) return [3, 1];
    if (totalCoins === 5) return [3, 2];
    if (totalCoins === 6) return [3, 2, 1];
    
    // For larger numbers of coins
    if (totalCoins === 7) return [4, 2, 1];
    if (totalCoins === 8) return [4, 3, 1];
    if (totalCoins === 9) return [4, 3, 2];
    if (totalCoins === 10) return [4, 3, 2, 1];
    if (totalCoins === 11) return [5, 3, 2, 1];
    if (totalCoins === 12) return [5, 4, 2, 1];
    if (totalCoins === 13) return [5, 4, 3, 1];
    if (totalCoins === 14) return [5, 4, 3, 2];
    if (totalCoins === 15) return [5, 4, 3, 2, 1];
    
    // Fallback for more than 15 coins
    const rows: number[] = [5, 4, 3, 2, 1];
    return rows;
  };
  
  // Get the pyramid rows
  const rowSizes = calculatePyramidRows(coins.length).reverse();
  
  // Create the pyramid by distributing coins into rows
  const createPyramid = () => {
    if (coins.length === 0) return null;
    
    const pyramid: number[][] = [];
    let coinIndex = 0;
    
    // Fill each row with coins (starting from the bottom row)
    // rowSizes is already in bottom-to-top order
    for (const rowSize of rowSizes) {
      const row: number[] = [];
      for (let i = 0; i < rowSize; i++) {
        if (coinIndex < coins.length) {
          row.push(coins[coinIndex]);
          coinIndex++;
        }
      }
      pyramid.push(row);
    }
    
    return (
      <div className={side === 'left' ? styles.leftPyramid : styles.rightPyramid}>
        {/* Render in bottom-to-top order (largest row first) */}
        {pyramid.map((row, rowIndex) => {
          return (
            <div key={`row-${rowIndex}`} className={styles.pyramidRow}>
              {row.map((coinIndex, i) => {
                // Calculate horizontal offset for centering
                const offset = ((rowSizes[rowIndex] - 1) / 2 - i) * -40;
                
                return (
                  <div 
                    key={`coin-${coinIndex}-${i}`} 
                    className={styles.pyramidCoin}
                    style={{ 
                      transform: `translateX(${offset}px)`
                    }}
                  >
                    <Coin 
                      number={coinIndex + 1} 
                      onClick={() => onCoinClick && onCoinClick(coinIndex)} 
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };
  
  // Calculate arrow position based on pyramid height
  const getArrowPosition = () => {
    // Base height for the arrow
    const baseOffset = -48;
    // Additional offset for each row of coins (30px per row)
    const rowOffset = coins.length > 0 ? calculatePyramidRows(coins.length).length * -65 : 0;
    return { top: `${baseOffset + rowOffset}px` };
  };

  return (
    <div className={styles.balanceSide}>
      <div 
        className={`${styles.plate} ${side === 'left' ? styles.leftPlate : styles.rightPlate} ${isSelected ? styles.selected : ''}`}
      >
        {/* Selection arrow - only shows when selected and adjusts position based on pyramid height */}
        {isSelected && (
          <div className={styles.selectionArrow} style={getArrowPosition()}>↓</div>
        )}
        
        {createPyramid()}
      </div>

      {/* Selectable area for this plate */}
      <div 
        className={styles.plateSelectArea}
        onClick={onSelect}
      ></div>
    </div>
  );
};

export default BalanceSide;