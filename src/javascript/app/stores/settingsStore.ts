import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface ScanConstraints {
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
  step: number,
}

export interface SettingsState {
  scanConstraints: ScanConstraints,
  setScanConstraints: (scanConstraints: ScanConstraints) => void,
}

const useSettingsStore = create(
  persist<SettingsState>(
    (set) => ({
      scanConstraints: { minX: 0, minY: 0, maxX: 0, maxY: 0, step: 0 },
      setScanConstraints: (scanConstraints: ScanConstraints) => set({ scanConstraints }),
    }),
    {
      name: 'p1x-settings',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useSettingsStore;
