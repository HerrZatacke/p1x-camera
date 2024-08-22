import React from 'react';
import { useWebUSB } from '../WebUSBProvider';
import Controls from '../Controls';
import Messages from '../Messages';
import DataView from '../DataView';

import './index.scss';
import Dialog from '../Dialog/dialog';

function App() {
  const { enabled } = useWebUSB();

  return (
    <div className="app">
      <Dialog />
      { enabled && <Controls /> }
      <DataView />
      <Messages />
    </div>
  );
}

export default App;
