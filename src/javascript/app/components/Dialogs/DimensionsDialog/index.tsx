import React, { useCallback, useState, useMemo } from 'react';
import type { CSSPropertiesVars } from 'react';
import { TextField, Button, Stack, Typography } from '@mui/material';
import DialogModal from '../DialogModal';
import useDialogStore from '../../../stores/dialogStore';
import useSettingsStore from '../../../stores/settingsStore';
import { calcRect } from './calcRect';

import './index.scss';


function DimensionsDialog() {
  const { dimensionsParams } = useDialogStore();
  const { scanConstraints } = useSettingsStore();

  const [strStep, setStrStep] = useState<string>(scanConstraints.step.toString());
  const [strMinX, setStrMinX] = useState<string>(scanConstraints.minX.toString());
  const [strMaxX, setStrMaxX] = useState<string>(scanConstraints.maxX.toString());
  const [strMinY, setStrMinY] = useState<string>(scanConstraints.minY.toString());
  const [strMaxY, setStrMaxY] = useState<string>(scanConstraints.maxY.toString());

  const intStep = parseInt(strStep, 10) || 1;
  const intMinX = parseInt(strMinX, 10) || 0;
  const intMinY = parseInt(strMinY, 10) || 0;
  const intMaxX = parseInt(strMaxX, 10) || 0;
  const intMaxY = parseInt(strMaxY, 10) || 0;

  const update = useCallback(() => {
    dimensionsParams?.callback({
      maxX: intMaxX,
      minX: intMinX,
      maxY: intMaxY,
      minY: intMinY,
      step: intStep,
    });
  }, [dimensionsParams, intMaxX, intMaxY, intMinX, intMinY, intStep]);

  const cancel = useCallback(() => {
    dimensionsParams?.callback();
  }, [dimensionsParams]);

  const rect = useMemo(() => calcRect(
    intStep,
    dimensionsParams?.maxX || 0,
    dimensionsParams?.maxY || 0,
    intMinX,
    intMinY,
    intMaxX,
    intMaxY,
  ), [dimensionsParams, intMaxX, intMaxY, intMinX, intMinY, intStep]);

  const svgSize: CSSPropertiesVars = {
    width: `${rect.displayTotalWidth}px`,
    height: `${rect.displayTotalHeight}px`,
  };

  const setPreview = () => {
    const newStep = 1000;
    const { rawWidth, rawHeight } = calcRect(
      newStep,
      dimensionsParams?.maxX || 0,
      dimensionsParams?.maxY || 0,
      intMinX,
      intMinY,
      intMaxX,
      intMaxY,
    );

    setStrStep(newStep.toString(10));
    setStrMinX('0');
    setStrMaxX(rawWidth.toString(10));
    setStrMinY('0');
    setStrMaxY(rawHeight.toString(10));
  };

  const setCenter = () => {
    const newStep = intStep;
    const { rawWidth, rawHeight } = calcRect(
      newStep,
      dimensionsParams?.maxX || 0,
      dimensionsParams?.maxY || 0,
      intMinX,
      intMinY,
      intMaxX,
      intMaxY,
    );

    setStrStep(newStep.toString(10));
    setStrMinX(Math.floor(rawWidth * 0.33).toString(10));
    setStrMaxX(Math.ceil(rawWidth * 0.66).toString(10));
    setStrMinY(Math.floor(rawHeight * 0.33).toString(10));
    setStrMaxY(Math.ceil(rawHeight * 0.66).toString(10));
  };

  const setFullImage = () => {
    const newStep = intStep;
    const { rawWidth, rawHeight } = calcRect(
      newStep,
      dimensionsParams?.maxX || 0,
      dimensionsParams?.maxY || 0,
      intMinX,
      intMinY,
      intMaxX,
      intMaxY,
    );

    setStrStep(newStep.toString(10));
    setStrMinX('1');
    setStrMaxX((rawWidth - 1).toString(10));
    setStrMinY('1');
    setStrMaxY((rawHeight - 1).toString(10));
  };

  return (
    <DialogModal
      open={Boolean(dimensionsParams)}
      title="Set scan dimensions"
      cancelLabel="Cancel"
      confirmLabel="Set"
      cancel={cancel}
      confirm={update}
    >
      <Stack useFlexGap gap={2} direction="row">
        <Stack useFlexGap gap={1}>
          <TextField
            label="Minimum X"
            variant="filled"
            value={strMinX}
            onChange={({ target }) => setStrMinX(target.value)}
          />
          <TextField
            label="Maximum X"
            variant="filled"
            value={strMaxX}
            onChange={({ target }) => setStrMaxX(target.value)}
          />
          <TextField
            label="Minimum Y"
            variant="filled"
            value={strMinY}
            onChange={({ target }) => setStrMinY(target.value)}
          />
          <TextField
            label="Maximum Y"
            variant="filled"
            value={strMaxY}
            onChange={({ target }) => setStrMaxY(target.value)}
          />
          <TextField
            label="Step"
            variant="filled"
            value={strStep}
            onChange={({ target }) => setStrStep(target.value)}
          />
          <Button variant="outlined" onClick={setPreview}>Preview</Button>
          <Button variant="outlined" onClick={setCenter}>Center</Button>
          <Button variant="outlined" onClick={setFullImage}>Full Image</Button>
        </Stack>
        <Stack useFlexGap gap={2}>
          <Typography variant="body2">
            {`Available size with step ${strStep}:`}
            <br />
            {`${rect.rawWidth}x${rect.rawHeight}`}
          </Typography>
          <Typography variant="body2">
            Resulting scanned image size:
            <br />
            {`${rect.rawAreaWidth}x${rect.rawAreaHeight}`}
          </Typography>
          <svg
            className="dimensions-dialog__size-preview"
            viewBox={`0 0 ${rect.displayTotalWidth} ${rect.displayTotalHeight}`}
            style={svgSize}
          >
            <rect
              width={rect.displayTotalWidth}
              height={rect.displayTotalHeight}
              fill="#555555"
            />
            <rect
              x={rect.displayAreaX}
              y={rect.displayAreaY}
              width={rect.displayAreaWidth}
              height={rect.displayAreaHeight}
              fill="#448888"
            />
          </svg>
          <pre style={{ fontSize: '10px' }}>
            { JSON.stringify(rect, null, 2) }
          </pre>
        </Stack>
      </Stack>
    </DialogModal>
  );
}

export default DimensionsDialog;
