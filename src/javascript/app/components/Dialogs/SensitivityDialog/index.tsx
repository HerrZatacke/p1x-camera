import React, { useCallback, useEffect, useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import useDialogStore from '../../../stores/dialogStore';
import DialogModal from '../DialogModal';

function SensitivityDialog() {
  const { sensitivityParams } = useDialogStore();

  const [strATime, setStrATime] = useState<string>('');
  const [strAStep, setStrAStep] = useState<string>('');
  const [strAGain, setStrAGain] = useState<string>('');

  const intATime = parseInt(strATime, 10) || 1;
  const intAStep = parseInt(strAStep, 10) || 1;
  const intAGain = parseInt(strAGain, 10) || 1;

  const update = useCallback(() => {
    sensitivityParams?.callback({
      aTime: intATime,
      aStep: intAStep,
      aGain: intAGain,
    });
  }, [intAGain, intAStep, intATime, sensitivityParams]);

  const cancel = useCallback(() => {
    sensitivityParams?.callback();
  }, [sensitivityParams]);


  useEffect(() => {
    if (sensitivityParams) {
      setStrATime(sensitivityParams.aTime.toString());
      setStrAStep(sensitivityParams.aStep.toString());
      setStrAGain(sensitivityParams.aGain.toString());
    }
  }, [sensitivityParams]);

  const setLow = () => {
    setStrATime('20');
    setStrAStep('20');
    setStrAGain('4');
  };

  const setMedium = () => {
    setStrATime('40');
    setStrAStep('40');
    setStrAGain('8');
  };

  const setHigh = () => {
    setStrATime('80');
    setStrAStep('80');
    setStrAGain('10');
  };


  return (
    <DialogModal
      id="goto-dialog"
      open={Boolean(sensitivityParams)}
      title="Set scan dimensions"
      cancelLabel="Cancel"
      confirmLabel="Set"
      cancel={cancel}
      confirm={update}
    >
      <Stack useFlexGap gap={1}>
        <TextField
          label="Sensitivity time"
          variant="filled"
          value={strATime}
          onChange={({ target }) => setStrATime(target.value)}
        />
        <TextField
          label="Sensitivity step"
          variant="filled"
          value={strAStep}
          onChange={({ target }) => setStrAStep(target.value)}
        />
        <TextField
          label="Sensitivity gain"
          variant="filled"
          value={strAGain}
          onChange={({ target }) => setStrAGain(target.value)}
        />
        <Button variant="outlined" onClick={setLow}>Low Sensitivity</Button>
        <Button variant="outlined" onClick={setMedium}>Medium Sensitivity</Button>
        <Button variant="outlined" onClick={setHigh}>High Sensitivity</Button>
      </Stack>
    </DialogModal>
  );
}

export default SensitivityDialog;
