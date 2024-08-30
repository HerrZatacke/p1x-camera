import React from 'react';
import { Stack } from '@mui/material';
import { useWebUSB } from '../WebUSBProvider';
import Controls from '../Controls';
import Messages from '../Messages';
import DataView from '../DataView';
import Dialogs from '../Dialogs';
import DataViewRGB from '../DataViewRGB';

import './index.scss';

function App() {
  const { enabled } = useWebUSB();

  return (
    <div className="app">
      <Dialogs />
      { enabled && <Controls /> }
      <div className="app__grid">
        <DataView />
        <Stack direction="column" gap={2} sx={{ maxHeight: '90vh' }}>
          <DataViewRGB />
          <Messages />
        </Stack>
      </div>
    </div>
  );
}

export default App;
