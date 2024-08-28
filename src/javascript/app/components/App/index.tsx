import React from 'react';
import { Stack } from '@mui/material';
import { useWebUSB } from '../WebUSBProvider';
import Controls from '../Controls';
import Messages from '../Messages';
import DataView from '../DataView';
import Dialogs from '../Dialogs';
import DataViewRGB from '../DataViewRGB';

function App() {
  const { enabled } = useWebUSB();

  return (
    <>
      <Dialogs />
      { enabled && <Controls /> }
      <Stack useFlexGap gap={4} direction="row" justifyContent="center">
        <DataView />
        <DataViewRGB />
        <Messages />
      </Stack>
    </>
  );
}

export default App;
