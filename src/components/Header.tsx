import React from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  gameMode: 'random' | 'worst';
  setGameMode: (mode: 'random' | 'worst') => void;
  turns: number;
  resetGame: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  gameMode, 
  setGameMode, 
  turns, 
  resetGame 
}) => {
  return (
    <div className={styles.gameHeader}>
      <div className={styles.headerContainer}>
        <h2 className={styles.gameTitle}>Coin-spiracy</h2>
        
        <div className={styles.controlsRow}>
          <div className={styles.modeSwitchContainer}>
            <div className={styles.modeSwitch}>
              <span 
                className={`${styles.modeOption} ${gameMode === 'random' ? styles.modeOptionSelected : ''}`}
                onClick={() => setGameMode('random')}
              >
                Random
              </span>
              <span 
                className={`${styles.modeOption} ${gameMode === 'worst' ? styles.modeOptionSelected : ''}`}
                onClick={() => setGameMode('worst')}
              >
                Worst
              </span>
            </div>
          </div>

          <div className={styles.rightControls}>
            <div className={styles.turnsDisplay}>{turns} Turns</div>
            <button 
              onClick={resetGame}
              className={styles.resetButton}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;