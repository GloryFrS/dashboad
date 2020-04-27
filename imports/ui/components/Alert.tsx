import React from 'react'
import Snackbar, { SnackbarProps } from '@material-ui/core/Snackbar'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'

export default (props: any) => {
  const Alert = (props: AlertProps) => <MuiAlert elevation={6} variant='filled' {...props} />
  const defaultAlert = {
    autoHideDuration: props.autoClose ? 6000 : null,
    open: props.open,
    onClose: props.onClose
  }
  const anchorOrigin: SnackbarProps['anchorOrigin'] = {
    vertical: 'top',
    horizontal: 'center'
  }

  return (
    <Snackbar {...defaultAlert} anchorOrigin={anchorOrigin}>
      <Alert severity={props.severity || 'info'}>{props.message}</Alert>
    </Snackbar>
  )
}
