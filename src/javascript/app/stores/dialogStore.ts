import { create } from 'zustand';
import type { ScanConstraints } from './settingsStore';
import type { Point } from '../hooks/useScanData';

export interface Question {
  id: string,
  message: string,
  min: number,
  max: number,
  value?: number,
}


export type DimensionsDialogCallback = (scanConstraints?: ScanConstraints) => Promise<void>;
export interface DimensionsParams {
  callback: DimensionsDialogCallback,
  maxX: number,
  maxY: number,
}

export type GoToDialogCallback = (point?: Point) => Promise<void>;
export interface GoToParams {
  callback: GoToDialogCallback,
  maxX: number,
  maxY: number,
  x: number,
  y: number,
}

export interface Sensitivity {
  aTime: number,
  aStep: number,
  aGain: number,
}

export type SensitivityDialogCallback = (sensitivity?: Sensitivity) => Promise<void>;
export interface SensitivityParams extends Sensitivity {
  callback: SensitivityDialogCallback,
}

export interface DialogState {
  dimensionsParams: DimensionsParams | null,
  setShowDimensionsDialog: (dimensionsParams: DimensionsParams) => void,

  goToParams: GoToParams | null,
  setShowGoToDialog: (goToParams: GoToParams) => void,

  sensitivityParams: SensitivityParams | null,
  setShowSensitivityDialog: (sensitivityParams: SensitivityParams) => void,
}

const useDialogStore = create<DialogState>((set) => ({
  dimensionsParams: null,
  goToParams: null,
  sensitivityParams: null,

  setShowDimensionsDialog: (dimensionsParams: DimensionsParams) => {
    const callback: DimensionsDialogCallback = async (scanConstraints?: ScanConstraints) => {
      dimensionsParams.callback(scanConstraints);
      set({ dimensionsParams: null });
    };

    set({
      dimensionsParams: {
        ...dimensionsParams,
        callback,
      },
    });
  },

  setShowGoToDialog: (goToParams: GoToParams) => {
    const callback: GoToDialogCallback = async (point?: Point) => {
      goToParams.callback(point);
      set({ goToParams: null });
    };

    set({
      goToParams: {
        ...goToParams,
        callback,
      },
    });
  },

  setShowSensitivityDialog: (sensitivityParams: SensitivityParams) => {
    const callback: SensitivityDialogCallback = async (sensitivity?: Sensitivity) => {
      sensitivityParams.callback(sensitivity);
      set({ sensitivityParams: null });
    };

    set({
      sensitivityParams: {
        ...sensitivityParams,
        callback,
      },
    });
  },
}));

export default useDialogStore;
