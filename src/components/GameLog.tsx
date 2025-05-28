import React from 'react';
import { WeighResult } from '../types';
import styles from './GameLog.module.css';

interface GameLogProps {
  weighHistory: WeighResult[];
  isVisible: boolean;
}

const GameLog: React.FC<GameLogProps> = ({ weighHistory, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className={styles.logContainer}>
      <h3 className={styles.logTitle}>Game Log</h3>
      <div className={styles.logContent}>
        {weighHistory.length === 0 ? (
          <div className={styles.logEntry}>No weighings yet</div>
        ) : (
          weighHistory.map((result, index) => (
            <div key={index} className={styles.logEntry}>
              <div className={styles.weighInfo}>
                <div className={styles.turnNumber}>Turn {index + 1}:</div>
                <div className={styles.leftSide}>
                  Left: {result.leftCoins.map(coin => coin + 1).join(', ')}
                </div>
                <div className={styles.rightSide}>
                  Right: {result.rightCoins.map(coin => coin + 1).join(', ')}
                </div>
                <div className={styles.result}>
                  Result: <span className={styles[result.result]}>{result.result}</span>
                </div>
              </div>
              {result.remainingCandidates && result.remainingCandidates.length > 0 && (
                <div className={styles.candidates}>
                  Possible weighted coins: {result.remainingCandidates.map(coin => coin + 1).join(', ')}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameLog;