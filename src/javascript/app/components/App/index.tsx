import React from 'react';
import { useWebUSB } from '../WebUSBProvider';
import Controls from '../Controls';
import Messages from '../Messages';
import DataView from '../DataView';
import Dialog from '../Dialog/dialog';
import Dialogs from '../Dialogs';

function App() {
  const { enabled } = useWebUSB();

  return (
    <>
      <Dialog />
      <Dialogs />
      { enabled && <Controls /> }
      <DataView />
      <Messages />
    </>
  );
}

export default App;
