import React, { useState } from 'react';
import { useWebUSB } from '../WebUSBProvider';
import type { P1XErrorMessage, P1XInfoMessage, P1XMessage, P1XWarningMessage, P1XHomingMessage } from '../../../types/P1X';
import { P1XType } from '../../../types/P1X';

import './index.scss';

interface MessageProps {
  className: string,
  text: string,
}

const getMessageProps = (message: P1XMessage): MessageProps => {
  switch (message.type) {
    case P1XType.ERROR:
      return {
        className: 'messages__message messages__message--error',
        text: (message as P1XErrorMessage).message,
      };
    case P1XType.WARNING:
      return {
        className: 'messages__message messages__message--warning',
        text: (message as P1XWarningMessage).message,
      };
    case P1XType.INFO:
      return {
        className: 'messages__message messages__message--info',
        text: (message as P1XInfoMessage).message,
      };
    case P1XType.DONE_HOMING:
      return {
        className: 'messages__message messages__message--homing',
        text: `Homing on ${(message as P1XHomingMessage).axis}-axis done. Detected range: ${(message as P1XHomingMessage).range} steps`,
      };
    default:
      return {
        className: 'messages__message',
        text: JSON.stringify(message),
      };
  }
};

function Messages() {
  const { messages } = useWebUSB();

  const [showCaptured, setShowCaptured] = useState<boolean>(false);

  return (
    <>
      <label>
        <span>Show captured messages</span>
        <input
          type="checkbox"
          checked={showCaptured}
          onChange={({ target }) => setShowCaptured(target.checked)}
        />
      </label>
      <ul className="messages">
        { messages
          .filter(({ captured }) => !(captured && !showCaptured))
          .map((msg) => {
            const { className, text } = getMessageProps(msg.message);

            return (
              <li key={msg.messageTimestamp} className={className}>
                { text }
              </li>
            );
          })}
      </ul>
    </>
  );
}

export default Messages;
