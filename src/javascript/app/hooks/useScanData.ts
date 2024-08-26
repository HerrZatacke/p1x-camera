import { useCallback, useState } from 'react';
import { useSendMessage } from './useSendMessage';
import type { P1XChannels, P1XDataMessage } from '../../types/P1X';
import { P1XChannel, P1XCommands } from '../../types/P1X';
import useScannedDataStore from '../stores/scannedDataStore';
import useSettingsStore from '../stores/settingsStore';
import { getIndexFromCoordinates } from '../../tools/dimensions';

export interface Progress {
  startTime: number,
  totalSteps: number,
  elapsedSteps: number,
  elapsedTime: number,
  timeRemaining: number,
  timePerStep: number,
}


export interface UseScanData {
  busy: boolean,
  progress: Progress,
  clearData: () => void,
  scanData: () => Promise<void>,
}

export interface Point {
  x: number,
  y: number,
}

const prepareCoords = (startX: number, startY: number, endX: number, endY: number): Point[] => {
  let evenOdd = true;
  const coords: Point[] = [];

  for (let y = startY; y < endY; y += 1) {
    evenOdd = !evenOdd;
    const line: Point[] = [];

    for (let x = startX; x < endX; x += 1) {
      line.push({ x, y });
    }

    if (evenOdd) {
      line.reverse();
    }

    coords.push(...line);
  }

  return coords;
};

export const useScanData = (): UseScanData => {
  const [busy, setBusy] = useState<boolean>(false);

  const { sendMessage, getMoveToMessage } = useSendMessage();
  const { addData, clearData, setDimensions, data } = useScannedDataStore();
  const { scanConstraints } = useSettingsStore();

  const [progress, setProgress] = useState<Progress>({
    startTime: 0,
    totalSteps: 1,
    elapsedSteps: 0,
    elapsedTime: 0,
    timeRemaining: 0,
    timePerStep: 0,
  });

  const updateProgress = useCallback((remaining: number) => {
    setProgress((currentProgress) => {
      const startTime = currentProgress.startTime;
      const totalSteps = currentProgress.totalSteps;

      const elapsedTime = Date.now() - startTime;
      const elapsedSteps = totalSteps - remaining;
      const timePerStep = elapsedTime / elapsedSteps;
      const timeRemaining = remaining * timePerStep;

      return ({
        startTime,
        totalSteps,
        elapsedSteps,
        elapsedTime,
        timeRemaining,
        timePerStep,
      });
    });
  }, []);

  const append = true;

  const scanData = async () => {
    setBusy(true);

    try {
      await navigator.wakeLock.request('screen');
    } catch (error) {
      console.error('WakeLock failed', error);
    }

    if (!append) {
      clearData();
    }

    const width = scanConstraints.maxX - scanConstraints.minX;
    const height = scanConstraints.maxY - scanConstraints.minY;

    // Full image
    let coords = prepareCoords(
      scanConstraints.minX,
      scanConstraints.minY,
      scanConstraints.maxX,
      scanConstraints.maxY,
    );
    setDimensions(width, height);

    if (append) {
      coords = coords.filter(({ x, y }) => {
        const index = getIndexFromCoordinates(
          x - scanConstraints.minX,
          y - scanConstraints.minY,
          { width, height },
        );

        return (
          (data[P1XChannel.CLEAR]?.[index] === -1) ||
          (data[P1XChannel.CLEAR]?.[index] === undefined)
        );
      });
    }

    if (!coords.length) {
      setBusy(false);
      return;
    }

    setProgress((p) => ({
      ...p,
      totalSteps: coords.length,
      startTime: Date.now(),
    }));

    // Before scanning, travel to start point
    await sendMessage(
      getMoveToMessage(coords[0].x * scanConstraints.step, coords[0].y * scanConstraints.step),
      true,
    );


    const aquireData = async (): Promise<void> => {
      const nextCoords = coords.shift();

      if (!nextCoords) {
        return;
      }

      await sendMessage(
        getMoveToMessage(nextCoords.x * scanConstraints.step, nextCoords.y * scanConstraints.step),
        true,
      );

      const result = await sendMessage([P1XCommands.READ_DATA], true);

      if (result) {
        addData(
          nextCoords.x - scanConstraints.minX,
          nextCoords.y - scanConstraints.minY,
          result as P1XDataMessage as P1XChannels,
        );
      }

      updateProgress(coords.length);

      await aquireData();
    };

    await aquireData();
    setProgress((p) => ({
      ...p,
      startTime: 0,
    }));

    setBusy(false);
  };

  return {
    progress,
    busy,
    clearData,
    scanData,
  };
};
