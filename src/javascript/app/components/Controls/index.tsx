import React from 'react';
import { AppBar, Toolbar } from '@mui/material';
import { useWebUSB } from '../WebUSBProvider';
import { useControls } from './useControls';
import { useScanData } from '../../hooks/useScanData';

import './index.scss';

const fTime = (ms: number): string => (
  `${
    Math.floor(ms / 1000 / 60).toString(10).padStart(2, '0')
  }:${
    Math.floor(ms / 1000 % 60).toString(10).padStart(2, '0')
  }`
);

function Controls() {
  const { activePort, clearMessages, requestPort } = useWebUSB();

  const {
    busy: controlsBusy,
    getData,
    gotoDialog,
    ping,
    ledOn,
    ledMax,
    ledOff,
    downloadData,
    importData,
    sensitivityDialog,
    dimensionsDialog,
  } = useControls();

  const {
    busy: scanBusy,
    progress,
    clearData,
    scanData,
  } = useScanData();

  const disabled = scanBusy || controlsBusy;

  return (
    <AppBar
      position="sticky"
      color="secondary"
    >
      <Toolbar>
        {
          !activePort ? (
            <button
              className="controls__button"
              disabled={disabled}
              type="button"
              onClick={requestPort}
            >
              Request Port
            </button>
          ) : (
            <>
              <button
                className="controls__button"
                type="button"
                onClick={clearMessages}
              >
                Clear messages
              </button>

              <button
                className="controls__button"
                disabled={disabled}
                type="button"
                onClick={dimensionsDialog}
              >
                Set Dimensions
              </button>

              <button
                className="controls__button"
                disabled={disabled}
                type="button"
                onClick={sensitivityDialog}
              >
                Set sensitivity
              </button>

              <button
                className="controls__button"
                disabled={disabled}
                type="button"
                onClick={scanData}
              >
                Scan data
              </button>

              <button
                className="controls__button"
                disabled={disabled}
                type="button"
                onClick={gotoDialog}
              >
                GoTo
              </button>

              <button
                className="controls__button"
                disabled={disabled}
                type="button"
                onClick={ping}
              >
                Ping
              </button>

              <button
                className="controls__button"
                disabled={disabled}
                type="button"
                onClick={getData}
              >
                Get Data
              </button>

              <button
                className="controls__button"
                disabled={disabled}
                type="button"
                onClick={ledMax}
              >
                Led Max
              </button>

              <button
                className="controls__button"
                disabled={disabled}
                type="button"
                onClick={ledOn}
              >
                Led On
              </button>

              <button
                className="controls__button"
                disabled={disabled}
                type="button"
                onClick={ledOff}
              >
                Led Off
              </button>
            </>
          )
        }

        <button
          className="controls__button"
          disabled={disabled}
          type="button"
          onClick={clearData}
        >
          Clear data
        </button>

        <button
          className="controls__button"
          disabled={disabled}
          type="button"
          onClick={downloadData}
        >
          Download Data
        </button>

        <input
          type="file"
          onChange={importData}
        />

        {
          progress.startTime > 0 && (
            <div className="controls__progress">
              <p>{`steps done: ${progress.elapsedSteps}/${progress.totalSteps} (${(progress.elapsedSteps / progress.totalSteps * 100).toFixed(2)}%)`}</p>
              <p>{`time elapsed: ${fTime(progress.elapsedTime)} min`}</p>
              <p>{`time remaining: ${fTime(progress.timeRemaining)} min`}</p>
              <p>{`step duration: ${progress.timePerStep.toFixed(2)}ms`}</p>
            </div>
          )
        }
      </Toolbar>
    </AppBar>
  );
}

export default Controls;
