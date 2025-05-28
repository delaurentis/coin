import React from 'react';
import styles from './Fulcrum.module.css';

interface FulcrumProps {}

const Fulcrum: React.FC<FulcrumProps> = () => {
  return (
    <div className={styles.fulcrumContainer}>
      <img 
        src="/fulcrum.png" 
        alt="Fulcrum" 
        className={styles.fulcrumImage} 
      />
    </div>
  );
};

export default Fulcrum;