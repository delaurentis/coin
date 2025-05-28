import React from 'react';
import styles from './Message.module.css';

interface MessageProps {
  message: string;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div className={styles.container}>
      <p className={styles.message}>
        {message}
      </p>
    </div>
  );
};

export default Message;