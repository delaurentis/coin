import React from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  turns: number;
  resetGame: () => void;
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  turns, 
  resetGame,
  onOpenSettings
}) => {
  return (
    <div className={styles.gameHeader}>
      <div className={styles.headerContainer}>
        <h2 className={styles.gameTitle}>Coin-spiracy</h2>
        
        <div className={styles.controlsRow}>
          <div className={styles.modeSwitchContainer}>
            <button 
              className={styles.settingsButton}
              onClick={onOpenSettings}
            >
              Settings
            </button>
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