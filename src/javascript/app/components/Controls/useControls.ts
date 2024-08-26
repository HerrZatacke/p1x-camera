import { useState } from 'react';
import { P1XCommands } from '../../../types/P1X';
import { useSendMessage } from '../../hooks/useSendMessage';
import useDialogStore from '../../stores/dialogStore';
import useSettingsStore from '../../stores/settingsStore';
import type { Sensitivity } from '../../stores/dialogStore';
import type { ScanConstraints } from '../../stores/settingsStore';
import type { P1XDataMessage } from '../../../types/P1X';
import type { Point } from '../../hooks/useScanData';


interface UseControls {
  busy: boolean,
  getData: () => Promise<void>,
  gotoDialog: () => Promise<void>,
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
  const { setShowDimensionsDialog, setShowGoToDialog, setShowSensitivityDialog } = useDialogStore();
  const { setScanConstraints } = useSettingsStore();

  const getData = async () => {
    setBusy(true);
    await sendMessage([P1XCommands.READ_DATA], false);
    setBusy(false);
  };

  const gotoDialog = async () => {
    setBusy(true);
    const { maxX, maxY, x, y } = (await sendMessage([P1XCommands.READ_DATA], true)) as P1XDataMessage;

    setShowGoToDialog({ maxX,
      maxY,
      x,
      y,
      callback: async (point?: Point) => {
        if (!point) {
          setBusy(false);
          return;
        }

        await sendMessage(getMoveToMessage(point.x, point.y), false);

        setBusy(false);
      } });
  };

  const ping = async () => {
    sendMessage([P1XCommands.SILENT_PING], true);
  };

  const sensitivityDialog = async () => {
    setBusy(true);
    const { aGain, aTime, aStep } = (await sendMessage([P1XCommands.READ_DATA], true)) as P1XDataMessage;

    setShowSensitivityDialog({
      aGain,
      aTime,
      aStep,
      callback: async (sensitivity?: Sensitivity) => {

        if (!sensitivity) {
          setBusy(false);
          return;
        }

        await sendMessage([
          P1XCommands.SET_SENSITIVITY,
          sensitivity.aTime,
          sensitivity.aStep,
          sensitivity.aGain,
        ], false);

        setBusy(false);
      },
    });
  };

  const dimensionsDialog = async () => {
    setBusy(true);

    const { maxX, maxY } = (await sendMessage([P1XCommands.READ_DATA], true)) as P1XDataMessage;

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
    await sendMessage([P1XCommands.LED, 100], false);
    setBusy(false);
  };

  const ledOn = async () => {
    setBusy(true);
    await sendMessage([P1XCommands.LED, 10], false);
    setBusy(false);
  };

  const ledOff = async () => {
    setBusy(true);
    await sendMessage([P1XCommands.LED, 0], false);
    setBusy(false);
  };

  return {
    busy,
    getData,
    gotoDialog,
    ping,
    ledOn,
    ledMax,
    ledOff,
    sensitivityDialog,
    dimensionsDialog,
  };
};
