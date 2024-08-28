import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { P1XChannel } from '../../types/P1X';


export interface ScanConstraints {
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
  step: number,
}

export interface ActiveChannels {
  r: P1XChannel[],
  g: P1XChannel[],
  b: P1XChannel[],
}

const defaultChannels: ActiveChannels = {
  r: [
    P1XChannel.COLOR_630NM,
    P1XChannel.COLOR_680NM,
    P1XChannel.COLOR_590NM,
  ],
  g: [
    P1XChannel.COLOR_555NM,
    P1XChannel.COLOR_515NM,
  ],
  b: [
    P1XChannel.COLOR_480NM,
    P1XChannel.COLOR_445NM,
    P1XChannel.COLOR_415NM,
  ],
};

export interface SettingsState {
  scanConstraints: ScanConstraints,
  setScanConstraints: (scanConstraints: ScanConstraints) => void,
  activeChannels: ActiveChannels,
  setActiveChannels: (activeChannels: ActiveChannels) => void,
}

const useSettingsStore = create(
  persist<SettingsState>(
    (set) => ({
      scanConstraints: { minX: 0, minY: 0, maxX: 0, maxY: 0, step: 0 },
      activeChannels: defaultChannels,
      setScanConstraints: (scanConstraints: ScanConstraints) => set({ scanConstraints }),
      setActiveChannels: (activeChannels: ActiveChannels) => set({ activeChannels }),
    }),
    {
      name: 'p1x-settings',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useSettingsStore;
