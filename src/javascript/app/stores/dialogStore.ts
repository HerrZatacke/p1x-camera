import { create } from 'zustand';
import { createRandomId } from '../hooks/useRandomId';
import type { ScanConstraints } from './settingsStore';

export interface Question {
  id: string,
  message: string,
  min: number,
  max: number,
  value?: number,
}

export type Answers = Record<string, string>;
export type DialogCallback = (answers?: Answers) => Promise<void>;
export type DimensionsDialogCallback = (scanConstraints?: ScanConstraints) => Promise<void>;

export interface Dialog {
  id: string,
  questions: Question[],
  callback: DialogCallback,
}

export interface DimensionsParams {
  callback: DimensionsDialogCallback,
  maxX: number,
  maxY: number,
}

export interface DialogState {
  dialogs: Dialog[],
  setDialog: (questions: Question[], answered: DialogCallback) => void,
  dimensionsParams: DimensionsParams | null,
  setShowDimensionsDialog: (dimensionsParams: DimensionsParams) => void,
}

const useDialogStore = create<DialogState>((set, getState) => ({
  dialogs: [],
  dimensionsParams: null,
  setDialog: (questions: Question[], answered: DialogCallback) => {
    const { dialogs } = getState();

    const id = createRandomId();

    const callback: DialogCallback = (answers?: Answers) => {
      const { dialogs: dialogsAfterAdding } = getState();
      set({ dialogs: dialogsAfterAdding.filter((dialog) => dialog.id !== id) });
      return answered(answers);
    };

    set({
      dialogs: [
        ...dialogs,
        {
          id,
          questions,
          callback,
        },
      ],
    });
  },
  setShowDimensionsDialog: (dimensionsParams: DimensionsParams) => {
    const callback: DimensionsDialogCallback = async (scanConstraints?: ScanConstraints) => {
      dimensionsParams.callback(scanConstraints);
      set({ dimensionsParams: null });
    };

    set({
      dimensionsParams: {
        maxX: dimensionsParams.maxX,
        maxY: dimensionsParams.maxY,
        callback,
      },
    });
  },
}));

export default useDialogStore;
