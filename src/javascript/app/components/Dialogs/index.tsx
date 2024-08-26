import React from 'react';
import DimensionsDialog from './DimensionsDialog';
import GoToDialog from './GoToDialog';
import SensitivityDialog from './SensitivityDialog';

function Dialogs() {
  return (
    <>
      <DimensionsDialog />
      <GoToDialog />
      <SensitivityDialog />
    </>
  );
}

export default Dialogs;
