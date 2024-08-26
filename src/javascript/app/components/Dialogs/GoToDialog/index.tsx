import React, { useCallback, useEffect, useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import useDialogStore from '../../../stores/dialogStore';
import DialogModal from '../DialogModal';

function GoToDialog() {
  const { goToParams } = useDialogStore();

  const [strX, setStrX] = useState<string>('');
  const [strY, setStrY] = useState<string>('');

  const intX = parseInt(strX, 10) || 0;
  const intY = parseInt(strY, 10) || 0;

  const update = useCallback(() => {
    goToParams?.callback({
      x: intX,
      y: intY,
    });
  }, [goToParams, intX, intY]);

  const cancel = useCallback(() => {
    goToParams?.callback();
  }, [goToParams]);

  useEffect(() => {
    if (goToParams) {
      setStrX(goToParams.x.toString());
      setStrY(goToParams.y.toString());
    }
  }, [goToParams]);

  const setZero = () => {
    setStrX('0');
    setStrY('0');
  };

  const setCenter = () => {
    setStrX(Math.floor((goToParams?.maxX || 0) / 2).toString());
    setStrY(Math.floor((goToParams?.maxY || 0) / 2).toString());
  };

  const setMax = () => {
    setStrX((goToParams?.maxX || 0).toString());
    setStrY((goToParams?.maxY || 0).toString());
  };

  return (
    <DialogModal
      id="goto-dialog"
      open={Boolean(goToParams)}
      title="Set scan dimensions"
      cancelLabel="Cancel"
      confirmLabel="Go"
      cancel={cancel}
      confirm={update}
    >
      <Stack useFlexGap gap={1}>
        <TextField
          label="new X position"
          variant="filled"
          value={strX}
          onChange={({ target }) => setStrX(target.value)}
        />
        <TextField
          label="new Y position"
          variant="filled"
          value={strY}
          onChange={({ target }) => setStrY(target.value)}
        />
        <Button variant="outlined" onClick={setZero}>Zero</Button>
        <Button variant="outlined" onClick={setCenter}>Center</Button>
        <Button variant="outlined" onClick={setMax}>Max</Button>
      </Stack>
    </DialogModal>
  );
}

export default GoToDialog;
