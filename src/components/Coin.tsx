import React, { useState } from 'react';
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
  
  const handleClick = () => {
    if (onClick && !isAnimating) {
      setIsAnimating(true);
      onClick();
      
      // Reset animation state after animation completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 500); // Animation duration is 0.5s
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