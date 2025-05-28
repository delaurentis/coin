import React, { useState } from 'react';
import styles from './Scale.module.css';
import CoinSvg from './CoinSvg';

interface ScaleProps {
  onSelectSide: (side: 'left' | 'right') => void;
  onWeigh: () => void;
  leftCoins: number[];
  rightCoins: number[];
  tipped: 'left' | 'right' | null;
}

const Scale: React.FC<ScaleProps> = ({ 
  onSelectSide, 
  onWeigh, 
  leftCoins, 
  rightCoins, 
  tipped 
}) => {
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | null>(null);

  const handleSideClick = (side: 'left' | 'right') => {
    setSelectedSide(side);
    onSelectSide(side);
  };

  // Calculate tilt based on the tipped value
  const getScaleTilt = () => {
    if (tipped === 'left') return styles.tippedLeft;
    if (tipped === 'right') return styles.tippedRight;
    return '';
  };

  // Function to arrange coins in a pyramid
  const renderCoinPyramid = (coins: number[], side: 'left' | 'right') => {
    if (coins.length === 0) return null;
    
    // Determine how many coins per row in the pyramid
    // Start with 3 at the base, then 2, then 1
    const maxCoinsPerRow = 3;
    const rows: number[][] = [];
    let remainingCoins = [...coins];
    
    // Calculate how many full rows we can make
    let currentRowSize = maxCoinsPerRow;
    
    while (remainingCoins.length > 0) {
      // Take coins for this row
      const row = remainingCoins.slice(0, currentRowSize);
      rows.push(row);
      remainingCoins = remainingCoins.slice(currentRowSize);
      
      // Decrease row size for next row
      if (currentRowSize > 1) {
        currentRowSize--;
      }
    }

    return (
      <div className={side === 'left' ? styles.leftPyramid : styles.rightPyramid}>
        {rows.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className={styles.pyramidRow}>
            {row.map((coinIndex, i) => (
              <div 
                key={`coin-${coinIndex}-${i}`} 
                className={styles.pyramidCoin}
                style={{ 
                  // Offset each coin in the row to create the pyramid effect
                  transform: `translateX(${side === 'left' ? '' : '-'}${(row.length - 1 - (i * 2)) * 10}px)`
                }}
              >
                <CoinSvg number={coinIndex + 1} />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.scaleContainer}>
      <div className={`${styles.scale} ${getScaleTilt()}`}>
        {/* Left plate */}
        <div 
          className={`${styles.plate} ${styles.leftPlate} ${selectedSide === 'left' ? styles.selected : ''}`}
          onClick={() => handleSideClick('left')}
        >
          <div className={styles.plateInner}>
            {leftCoins.length === 0 && (
              <div className={styles.emptyPlate}></div>
            )}
          </div>
          {renderCoinPyramid(leftCoins, 'left')}
        </div>
        
        {/* Scale base */}
        <div className={styles.base}>
          <div className={styles.fulcrum}></div>
          <div className={styles.beam}></div>
        </div>
        
        {/* Right plate */}
        <div 
          className={`${styles.plate} ${styles.rightPlate} ${selectedSide === 'right' ? styles.selected : ''}`}
          onClick={() => handleSideClick('right')}
        >
          <div className={styles.plateInner}>
            {rightCoins.length === 0 && (
              <div className={styles.emptyPlate}></div>
            )}
          </div>
          {renderCoinPyramid(rightCoins, 'right')}
        </div>
      </div>
      
      {/* Weigh button */}
      <button 
        className={styles.weighButton}
        onClick={onWeigh}
        disabled={leftCoins.length === 0 && rightCoins.length === 0}
      >
        Weigh
      </button>
    </div>
  );
};

export default Scale;