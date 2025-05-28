import React from 'react';
import styles from './Controls.module.css';

interface ControlsProps {
  selectedSide: 'left' | 'right' | null;
  onSelectSide: (side: 'left' | 'right') => void;
  onWeigh: () => void;
  isWeighDisabled: boolean;
}

const Controls: React.FC<ControlsProps> = ({ 
  selectedSide, 
  onSelectSide, 
  onWeigh, 
  isWeighDisabled 
}) => {
  return (
    <div className={styles.controlsContainer}>
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
  );
};

export default Controls;