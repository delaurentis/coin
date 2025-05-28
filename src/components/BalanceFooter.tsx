import React from 'react';
import styles from './BalanceFooter.module.css';

interface BalanceFooterProps {
  selectedSide: 'left' | 'right' | null;
  onSelectSide: (side: 'left' | 'right') => void;
  onWeigh: () => void;
  isWeighDisabled: boolean;
}

const BalanceFooter: React.FC<BalanceFooterProps> = ({ 
  selectedSide, 
  onSelectSide, 
  onWeigh, 
  isWeighDisabled 
}) => {
  return (
    <div className={styles.footerContainer}>
      {/* Desktop layout - all buttons in one row */}
      <div className={styles.desktopLayout}>
        <button 
          className={`${styles.selectionButton} ${styles.leftButton} ${selectedSide === 'left' ? styles.selected : ''}`}
          onClick={() => onSelectSide('left')}
        >
          {selectedSide === 'left' ? 'Left Selected' : 'Select Left'}
        </button>
        
        <button 
          className={styles.weighButton}
          onClick={onWeigh}
          disabled={isWeighDisabled}
        >
          Weigh
        </button>
        
        <button 
          className={`${styles.selectionButton} ${styles.rightButton} ${selectedSide === 'right' ? styles.selected : ''}`}
          onClick={() => onSelectSide('right')}
        >
          {selectedSide === 'right' ? 'Right Selected' : 'Select Right'}
        </button>
      </div>

      {/* Mobile layout - Weigh on top, Left/Right buttons in row below */}
      <div className={styles.mobileLayout}>
        <button 
          className={`${styles.weighButton} ${styles.mobileWeighButton}`}
          onClick={onWeigh}
          disabled={isWeighDisabled}
        >
          Weigh
        </button>
        
        <div className={styles.mobileSelectionRow}>
          <button 
            className={`${styles.selectionButton} ${styles.leftButton} ${selectedSide === 'left' ? styles.selected : ''}`}
            onClick={() => onSelectSide('left')}
          >
            {selectedSide === 'left' ? 'Left Selected' : 'Select Left'}
          </button>
          
          <button 
            className={`${styles.selectionButton} ${styles.rightButton} ${selectedSide === 'right' ? styles.selected : ''}`}
            onClick={() => onSelectSide('right')}
          >
            {selectedSide === 'right' ? 'Right Selected' : 'Select Right'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BalanceFooter;