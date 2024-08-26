import { useState } from 'react';
import { P1XCommands } from '../../../types/P1X';
import { useSendMessage } from '../../hooks/useSendMessage';
import useDialogStore from '../../stores/dialogStore';
import useSettingsStore from '../../stores/settingsStore';
import type { ScanConstraints } from '../../stores/settingsStore';
import type { P1XDataMessage } from '../../../types/P1X';
import type { Answers } from '../../stores/dialogStore';
import type { Point } from '../../hooks/useScanData';


interface UseControls {
  busy: boolean,
  getData: () => Promise<void>,
  goto: () => Promise<void>,
  ledOn: () => Promise<void>,
  ledMax: () => Promise<void>,
  ledOff: () => Promise<void>,
  ping: () => Promise<void>,
  sensitivityDialog: () => Promise<void>,
  dimensionsDialog: () => Promise<void>,
}

export const useControls = (): UseControls => {
  const [busy, setBusy] = useState<boolean>(false);
  const { sendMessage, getMoveToMessage } = useSendMessage();
  const { setDialog, setShowDimensionsDialog, setShowGoToDialog } = useDialogStore();
  const { setScanConstraints } = useSettingsStore();

  const getData = async () => {
    setBusy(true);
    // eslint-disable-next-line no-console
    console.log(await sendMessage([P1XCommands.READ_DATA]));
    setBusy(false);
  };

  const goto = async () => {
    setBusy(true);
    const { maxX, maxY, x, y } = (await sendMessage([P1XCommands.READ_DATA])) as P1XDataMessage;

    setShowGoToDialog({ maxX,
      maxY,
      x,
      y,
      callback: async (point?: Point) => {
        if (!point) {
          setBusy(false);
          return;
        }

        // eslint-disable-next-line no-console
        console.log(await sendMessage(getMoveToMessage(point.x, point.y)));

        setBusy(false);
      } });
  };

  const ping = async () => {
    sendMessage([P1XCommands.SILENT_PING]);
  };

  const sensitivityDialog = async () => {
    setBusy(true);
    const { aGain, aTime, aStep } = (await sendMessage([P1XCommands.READ_DATA])) as P1XDataMessage;

    setDialog([
      {
        id: 'time',
        message: 'Time',
        min: 1,
        max: 255,
        value: aTime,
      },
      {
        id: 'step',
        message: 'Step',
        min: 1,
        max: 255,
        value: aStep,
      },
      {
        id: 'gain',
        message: 'Gain',
        min: 0,
        max: 10,
        value: aGain,
      },
    ], async (answers?: Answers) => {

      if (!answers) {
        setBusy(false);
        return;
      }

      const numberAnswers = Object.fromEntries(
        Object.entries(answers).map(([key, value]) => {
          let nValue = parseInt(value, 10);
          if (isNaN(nValue)) {
            nValue = 0;
          }

          return ([key, nValue]);
        }),
      );

      // eslint-disable-next-line no-console
      console.log(await sendMessage([
        P1XCommands.SET_SENSITIVITY,
        numberAnswers.time,
        numberAnswers.step,
        numberAnswers.gain,
      ]));

      setBusy(false);
    });
  };

  const dimensionsDialog = async () => {
    setBusy(true);

    const { maxX, maxY } = (await sendMessage([P1XCommands.READ_DATA])) as P1XDataMessage;

    setShowDimensionsDialog({
      maxX,
      maxY,
      callback: async (scanConstraints?: ScanConstraints) => {
        if (scanConstraints) {
          setScanConstraints(scanConstraints);
        }

        setBusy(false);
      },
    });
  };

  const ledMax = async () => {
    setBusy(true);
    // eslint-disable-next-line no-console
    console.log(await sendMessage([P1XCommands.LED, 100]));
    setBusy(false);
  };

  const ledOn = async () => {
    setBusy(true);
    // eslint-disable-next-line no-console
    console.log(await sendMessage([P1XCommands.LED, 10]));
    setBusy(false);
  };

  const ledOff = async () => {
    setBusy(true);
    // eslint-disable-next-line no-console
    console.log(await sendMessage([P1XCommands.LED, 0]));
    setBusy(false);
  };

  return {
    busy,
    getData,
    goto,
    ping,
    ledOn,
    ledMax,
    ledOff,
    sensitivityDialog,
    dimensionsDialog,
  };
};
