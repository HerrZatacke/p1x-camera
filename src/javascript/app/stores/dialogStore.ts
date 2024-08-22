import { create } from 'zustand';
import { createRandomId } from '../hooks/useRandomId';

export interface Question {
  id: string,
  message: string,
  min: number,
  max: number,
  value?: number,
}

export type Answers = Record<string, string>;
export type DialogCallback = (answers?: Answers) => Promise<void>;

export interface Dialog {
  id: string,
  questions: Question[],
  callback: DialogCallback,
}

export interface DialogState {
  dialogs: Dialog[],
  setDialog: (questions: Question[], answered: DialogCallback) => void,
}

const useDialogStore = create<DialogState>((set, getState) => ({
  dialogs: [],
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
}));

export default useDialogStore;
