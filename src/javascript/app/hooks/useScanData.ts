import { useCallback, useState } from 'react';
import { useSendMessage } from './useSendMessage';
import type { P1XChannels, P1XDataMessage } from '../../types/P1X';
import { P1XCommands } from '../../types/P1X';
import useScannedDataStore from '../stores/scannedDataStore';

const STEP = 250;
const CENTER_SIZE = 30;

interface Progress {
  startTime: number,
  totalSteps: number,
  elapsedSteps: number,
  elapsedTime: number,
  timeRemaining: number,
  timePerStep: number,
}
interface UseScanData {
  busy: boolean,
  progress: Progress,
  scanData: () => Promise<void>,
}

interface Point {
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
  const { addData, clearData, setTargetSize } = useScannedDataStore();

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

  const scanData = async () => {
    setBusy(true);

    try {
      await navigator.wakeLock.request('screen');
    } catch (error) {
      console.error('WakeLock failed', error);
    }

    clearData();

    const message = await sendMessage([P1XCommands.READ_DATA]);

    if (!message) {
      return;
    }

    const { maxX, maxY } = (message as P1XDataMessage);

    const width = Math.floor(maxX / STEP);
    const height = Math.floor(maxY / STEP);
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);

    // Full image
    // const coords = prepareCoords(0, 0, width, height);

    // Lower half
    // const coords = prepareCoords(0, centerY, width, height);

    // Lower 1/4
    // const coords = prepareCoords(0, Math.floor(centerY * 1.5), width, height);

    // center only
    const centerSize = CENTER_SIZE;
    const startX = Math.max(centerX - centerSize, 0);
    const startY = Math.max(centerY - centerSize, 0);
    const endX = Math.min(centerX + centerSize, Math.floor(maxX / STEP));
    const endY = Math.min(centerY + centerSize, Math.floor(maxY / STEP));

    const coords = prepareCoords(startX, startY, endX, endY);

    // console.log(startX, startY, endX, endY, Math.floor(maxX / STEP), Math.floor(maxY / STEP));

    setTargetSize(centerSize * 2, centerSize * 2);

    setProgress((p) => ({
      ...p,
      totalSteps: coords.length,
      startTime: Date.now(),
    }));

    // Before scanning, travel to start point
    await sendMessage(getMoveToMessage(coords[0].x * STEP, coords[0].y * STEP));


    const aquireData = async (): Promise<void> => {
      const nextCoords = coords.shift();

      if (!nextCoords) {
        return;
      }

      await sendMessage(getMoveToMessage(nextCoords.x * STEP, nextCoords.y * STEP));

      const result = await sendMessage([P1XCommands.READ_DATA]);

      if (result) {
        addData(nextCoords.x, nextCoords.y, result as P1XDataMessage as P1XChannels);
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
    scanData,
  };
};
