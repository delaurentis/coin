import React, { useState } from 'react';
import styles from './Balance.module.css';
import BalanceSide from './BalanceSide';
import Fulcrum from './Fulcrum';
import BalanceFooter from './BalanceFooter';

interface BalanceProps {
  selectedSide: 'left' | 'right' | null; // Passed from parent
  onSelectSide: (side: 'left' | 'right') => void;
  onWeigh: () => void;
  leftCoins: number[];
  rightCoins: number[];
  tipped: 'left' | 'right' | null;
  onCoinClick?: (side: 'left' | 'right', index: number) => void;
  isWeighing?: boolean;
}

const Balance: React.FC<BalanceProps> = ({ 
  selectedSide, // Get from props
  onSelectSide, 
  onWeigh, 
  leftCoins, 
  rightCoins, 
  tipped,
  onCoinClick,
  isWeighing
}) => {
  // No local state for selectedSide
  
  // Just pass the prop value to parent
  const handleSideClick = (side: 'left' | 'right') => {
    onSelectSide(side);
  };

  // Add state to track when the balance is being re-weighed
  const [reweighing, setReweighing] = useState(false);

  // Start reweigh animation when onWeigh is called and balance is already tipped
  const handleReweigh = () => {
    if (tipped) {
      setReweighing(true);
      // Reset after animation completes
      setTimeout(() => setReweighing(false), 1000);
    }
    onWeigh();
  };

  // Calculate tilt based on the tipped value and weighing state
  const getBalanceTilt = () => {
    // If reweighing and already tipped, show wobble animation for that side
    if (reweighing && tipped === 'left') return `${styles.tippedLeft} ${styles.wobbleLeft}`;
    if (reweighing && tipped === 'right') return `${styles.tippedRight} ${styles.wobbleRight}`;
    
    // Regular states
    if (tipped === 'left') return styles.tippedLeft;
    if (tipped === 'right') return styles.tippedRight;
    if (isWeighing) return styles.wobble;
    return '';
  };

  return (
    <div className={styles.balanceContainer}>
      <div className={styles.balanceGraphic}>
        {/* Main balance that will rotate */}
        <div className={`${styles.balance} ${getBalanceTilt()}`}>
          {/* Balance arm image with plates */}
          <div className={styles.balanceArm}>
            <img src="/balance-arm.png" alt="Balance arm" className={styles.balanceArmImage} />
            
            {/* Removed clickable sides - selection is now only via buttons */}
            
            {/* Arrows are now part of BalanceSide component */}
            
            {/* Left side */}
            <BalanceSide 
              coins={leftCoins}
              side="left"
              isSelected={selectedSide === 'left'}
              onSelect={() => handleSideClick('left')}
              onCoinClick={(index) => onCoinClick && onCoinClick('left', index)}
            />
            
            {/* Right side */}
            <BalanceSide 
              coins={rightCoins}
              side="right"
              isSelected={selectedSide === 'right'}
              onSelect={() => handleSideClick('right')}
              onCoinClick={(index) => onCoinClick && onCoinClick('right', index)}
            />
          </div>
        </div>
        
        {/* Fixed fulcrum */}
        <Fulcrum />
      </div>
      
      {/* Balance Footer with buttons */}
      <BalanceFooter 
        selectedSide={selectedSide}
        onSelectSide={handleSideClick}
        onWeigh={handleReweigh} // Use our new handler that adds wobble animation
        isWeighDisabled={leftCoins.length === 0 && rightCoins.length === 0}
      />
    </div>
  );
};

export default Balance;