import React from 'react';
import type { PropsWithChildren } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface Props extends PropsWithChildren {
  open: boolean,
  title: string,
  cancelLabel: string,
  confirmLabel: string,
  cancel: () => void,
  confirm: () => void,
}

function DialogModal({ open, title, cancelLabel, confirmLabel, cancel, confirm, children }: Props) {
  return (
    <Dialog
      open={open}
      onClose={cancel}
      aria-labelledby="dimensions-dialog-modal-title"
      className="dimensions-dialog"
    >
      <DialogTitle id="dimensions-dialog-modal-title" variant="h6" component="h3">
        { title }
      </DialogTitle>
      <DialogContent>
        { children }
      </DialogContent>
      <DialogActions>
        <Button
          onClick={cancel}
          variant="outlined"
        >
          { cancelLabel }
        </Button>
        <Button
          onClick={confirm}
          variant="contained"
        >
          { confirmLabel }
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogModal;
