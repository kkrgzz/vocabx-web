import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import React from 'react'

function WordDeleteDialog({
  isDeleteDialogOpen,
  handleCloseDeleteDialog,
  handleConfirmDelete,
  wordToDelete
}) {
  return (
    <Dialog
      open={isDeleteDialogOpen}
      onClose={handleCloseDeleteDialog}
    >
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete "{wordToDelete?.word}"?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
        <Button
          onClick={handleConfirmDelete}
          color="error"
          variant="contained"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default WordDeleteDialog