import React from 'react';
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
    goto,
    center,
    ping,
    ledOn,
    ledMax,
    ledOff,
    setSensitivity,
  } = useControls();

  const {
    busy: scanBusy,
    progress,
    scanData,
  } = useScanData();

  const disabled = scanBusy || controlsBusy;

  return (
    <div className="controls">
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
              onClick={scanData}
            >
              Scan data
            </button>

            <button
              className="controls__button"
              disabled={disabled}
              type="button"
              onClick={goto}
            >
              GoTo
            </button>

            <button
              className="controls__button"
              disabled={disabled}
              type="button"
              onClick={center}
            >
              Center
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
              onClick={setSensitivity}
            >
              Set sensitivity
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
    </div>
  );
}

export default Controls;
