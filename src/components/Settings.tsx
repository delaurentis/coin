import React from 'react';
import styles from './Settings.module.css';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  gameMode: 'random' | 'worst';
  setGameMode: (mode: 'random' | 'worst') => void;
  isHintModeActive: boolean;
  setIsHintModeActive: (active: boolean) => void;
  isLogVisible: boolean;
  setIsLogVisible: (visible: boolean) => void;
  weightMode: 'heavy' | 'light' | 'either';
  setWeightMode: (mode: 'heavy' | 'light' | 'either') => void;
}

const Settings: React.FC<SettingsProps> = ({
  isOpen,
  onClose,
  gameMode,
  setGameMode,
  isHintModeActive,
  setIsHintModeActive,
  isLogVisible,
  setIsLogVisible,
  weightMode,
  setWeightMode
}) => {
  // No need for local state since changes take effect immediately
  
  const handleGameModeChange = (mode: 'random' | 'worst') => {
    setGameMode(mode);
    localStorage.setItem('coinGameMode', mode);
  };
  
  const handleHintModeChange = (checked: boolean) => {
    setIsHintModeActive(checked);
    localStorage.setItem('coinGameHintMode', String(checked));
  };
  
  const handleLogVisibleChange = (checked: boolean) => {
    setIsLogVisible(checked);
    localStorage.setItem('coinGameLogVisible', String(checked));
  };
  
  const handleWeightModeChange = (mode: 'heavy' | 'light' | 'either') => {
    setWeightMode(mode);
  };
  
  // Close when clicking overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.settingsPanel}>
        <h2 className={styles.settingsTitle}>Settings</h2>
        
        <div className={styles.settingGroup}>
          <h3>Strategy:</h3>
          <div className={styles.radioGroup}>
            <label className={`${styles.radioOption} ${gameMode === 'random' ? styles.selected : ''}`}>
              <input
                type="radio"
                name="gameMode"
                value="random"
                checked={gameMode === 'random'}
                onChange={() => handleGameModeChange('random')}
              />
              Random
            </label>
            <label className={`${styles.radioOption} ${gameMode === 'worst' ? styles.selected : ''}`}>
              <input
                type="radio"
                name="gameMode"
                value="worst"
                checked={gameMode === 'worst'}
                onChange={() => handleGameModeChange('worst')}
              />
              Worst
            </label>
          </div>
        </div>

        <div className={styles.settingGroup}>
          <h3>Weighted Coin:</h3>
          <div className={styles.radioGroup}>
            <label className={`${styles.radioOption} ${weightMode === 'heavy' ? styles.selected : ''}`}>
              <input
                type="radio"
                name="weightMode"
                value="heavy"
                checked={weightMode === 'heavy'}
                onChange={() => handleWeightModeChange('heavy')}
              />
              Heavy
            </label>
            <label className={`${styles.radioOption} ${weightMode === 'light' ? styles.selected : ''}`}>
              <input
                type="radio"
                name="weightMode"
                value="light"
                checked={weightMode === 'light'}
                onChange={() => handleWeightModeChange('light')}
              />
              Light
            </label>
            <label className={`${styles.radioOption} ${weightMode === 'either' ? styles.selected : ''}`}>
              <input
                type="radio"
                name="weightMode"
                value="either"
                checked={weightMode === 'either'}
                onChange={() => handleWeightModeChange('either')}
              />
              Either
            </label>
          </div>
        </div>

        <div className={styles.settingGroup}>
          <h3>Show:</h3>
          <div className={styles.checkboxGroup}>
            <label className={`${styles.checkboxOption} ${isHintModeActive ? styles.selected : ''}`}>
              <input
                type="checkbox"
                checked={isHintModeActive}
                onChange={(e) => handleHintModeChange(e.target.checked)}
              />
              Hints
            </label>
            <label className={`${styles.checkboxOption} ${isLogVisible ? styles.selected : ''}`}>
              <input
                type="checkbox"
                checked={isLogVisible}
                onChange={(e) => handleLogVisibleChange(e.target.checked)}
              />
              Log
            </label>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.doneButton} onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
