import { useCallback } from 'react';
import type { P1XMessage } from '../../types/P1X';
import { P1XCommands } from '../../types/P1X';
import { useWebUSB } from '../components/WebUSBProvider';

interface UseSendMessage {
  sendMessage: (message: number[], capture: boolean) => Promise<P1XMessage | null>,
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

  const sendMessage = useCallback(async (message: number[], capture: boolean): Promise<P1XMessage | null> => (
    new Promise((resolve) => {
      if (!activePort) {
        resolve(null);
        return;
      }

      const timer = window.setInterval(() => {
        // eslint-disable-next-line no-console
        console.log('pinging...');
        activePort.send(new Uint8Array([P1XCommands.SILENT_PING]), false);
      }, 10000);

      (async () => {
        const deviceMessage = await activePort.send(new Uint8Array(message), capture);
        window.clearInterval(timer);
        resolve(deviceMessage?.message || null);
      })();
    })
  ), [activePort]);

  return {
    getMoveToMessage,
    sendMessage,
  };
};
