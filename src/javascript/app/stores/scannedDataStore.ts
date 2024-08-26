import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { P1XChannel, P1XChannels } from '../../types/P1X';
import { p1xChannels } from '../../types/P1X';
import { getIndexFromCoordinates } from '../../tools/dimensions';

export interface Dimensions {
  width: number,
  height: number,
}

export type ChannelData = Partial<Record<P1XChannel, number[]>>;

export interface ScannedDataState {
  data: ChannelData,
  dimensions: Dimensions,
  clearData: () => void,
  addData: (x: number, y: number, message: P1XChannels) => void,
  setDimensions: (width: number, height: number) => void,
}

const useScannedDataStore = create(
  persist<ScannedDataState>(
    (set, getState) => ({
      data: {},
      dimensions: {
        width: 0,
        height: 0,
      },
      clearData: () => {
        set({ data: {} });
      },
      addData: (x: number, y: number, message: P1XChannels) => {
        const { data, dimensions } = getState();
        const arraySize = dimensions.width * dimensions.height;

        const newData = p1xChannels.reduce((acc: ChannelData, channelKey: P1XChannel) => {
          const channel: number[] = data?.[channelKey] || Array(arraySize).fill(-1);
          const index = getIndexFromCoordinates(x, y, dimensions);
          channel[index] = message[channelKey];

          return {
            ...acc,
            [channelKey]: [...channel],
          };
        }, { ...data });

        set({ data: newData });
      },
      setDimensions: (width: number, height: number) => {
        set({
          dimensions: {
            width,
            height,
          },
        });
      },
    }),
    {
      name: 'p1x-scanned',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useScannedDataStore;
