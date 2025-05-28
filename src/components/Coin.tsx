import React, { useState, useRef } from 'react';
import styles from './Coin.module.css';

interface CoinProps {
  number: number;
  isDim?: boolean;
  isWeighted?: boolean;
  isSilver?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

const Coin: React.FC<CoinProps> = ({ 
  number, 
  isDim = false, 
  isWeighted = false,
  isSilver = false,
  onClick,
  onDoubleClick
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clickCountRef = useRef(0);
  
  const handleClick = () => {
    // Increment click count
    clickCountRef.current += 1;
    
    // If this is the first click, set a timeout to reset the click count
    if (clickCountRef.current === 1) {
      clickTimeoutRef.current = setTimeout(() => {
        // If only one click happened and we have an onClick handler, call it
        if (clickCountRef.current === 1 && onClick) {
          // Start animation
          if (!isAnimating) {
            setIsAnimating(true);
            onClick();
            
            // Reset animation state after animation completes
            setTimeout(() => {
              setIsAnimating(false);
            }, 500); // Animation duration is 0.5s
          }
        }
        
        // Reset click count after timeout
        clickCountRef.current = 0;
      }, 300); // 300ms is standard double-click detection time
    }
    
    // If this is the second click within the timeout, it's a double-click
    if (clickCountRef.current === 2) {
      // Clear the timeout so the single-click handler doesn't fire
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
      }
      
      // Reset click count
      clickCountRef.current = 0;
      
      // If we have a double-click handler, call it
      if (onDoubleClick) {
        onDoubleClick();
      }
    }
  };

  return (
    <div 
      className={`
        ${styles.coin} 
        ${isDim ? styles.dim : ''} 
        ${isAnimating ? styles.animate : ''} 
        ${isWeighted ? styles.weighted : ''}
        ${isSilver ? styles.silver : ''}
      `} 
      onClick={handleClick}
    >
      <img src="/coin-small.png" alt={`Coin ${number}`} className={styles.coinImage} />
      <span className={styles.number}>{number}</span>
    </div>
  );
};

export default Coin;