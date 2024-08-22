import { useCallback } from 'react';
import type { P1XMessage } from '../../types/P1X';
import { P1XCommands } from '../../types/P1X';
import { useWebUSB } from '../components/WebUSBProvider';

interface UseSendMessage {
  sendMessage: (message: number[]) => Promise<P1XMessage | null>,
  getMoveToMessage: (x: number, y: number) => number[],
}

export const useSendMessage = (): UseSendMessage => {
  const { activePort } = useWebUSB();
  const getMoveToMessage = (x: number, y: number): number[] => {
    const xMSB = Math.floor(x / 256);
    const xLSB = x % 256;
    const yMSB = Math.floor(y / 256);
    const yLSB = y % 256;

    return [
      P1XCommands.GOTO,
      xMSB,
      xLSB,
      yMSB,
      yLSB,
    ];
  };

  const sendMessage = useCallback(async (message: number[]): Promise<P1XMessage | null> => {
    if (!activePort) {
      return null;
    }

    const deviceMessage = await activePort.send(new Uint8Array(message), true);
    return deviceMessage?.message || null;
  }, [activePort]);

  return {
    getMoveToMessage,
    sendMessage,
  };
};
