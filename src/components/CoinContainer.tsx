import React from 'react';
import styles from './CoinContainer.module.css';
import Coin from './Coin';

interface CoinContainerProps {
  coins: number[];
  isCoinDim: (index: number) => boolean;
  isWeightedAndFound: (index: number) => boolean;
  isCoinSilver: (index: number) => boolean;
  onCoinClick: (index: number) => void;
  onClearCoins: () => void;
}

const CoinContainer: React.FC<CoinContainerProps> = ({
  coins,
  isCoinDim,
  isWeightedAndFound,
  isCoinSilver,
  onCoinClick,
  onClearCoins
}) => {
  return (
    <div className={styles.container}>
      {coins.map((num, index) => (
        <Coin 
          key={num} 
          number={num} 
          isDim={isCoinDim(index)}
          isWeighted={isWeightedAndFound(index)}
          isSilver={isCoinSilver(index)}
          onClick={() => onCoinClick(index)}
          onDoubleClick={() => {}}
        />
      ))}
      <div 
        className={styles.clearButton}
        onClick={onClearCoins}
      >
        CLEAR
      </div>
    </div>
  );
};

export default CoinContainer;