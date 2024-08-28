import React from 'react';
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
      <DataView />
      <DataViewRGB />
      <Messages />
    </>
  );
}

export default App;
