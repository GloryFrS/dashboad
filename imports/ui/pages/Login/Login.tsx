import React from 'react'
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions
} from '@material-ui/core/'
import { connect, ConnectedProps } from 'react-redux'
import { NavigationOptions } from 'router5'
import { actions } from 'redux-router5'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { useForm } from 'react-hook-form'
import { Meteor } from 'meteor/meteor'
import { handleError } from '../../../store/actions'
import { dataForm } from './types'
import useStyles from './styles'

const Copyright = () => {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <Link color='inherit' href='https://google.com/'>
        NoName.Admin
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const mapDispatchToProps = (dispatch: any) => ({
  navigateTo: (
    name: string,
    params?: { [key: string]: any },
    opts: NavigationOptions = {}
  ) => {
    dispatch(actions.navigateTo(name, params, opts))
  },
  handleError: (body: any) => dispatch(handleError(body))
})
const connector = connect(null, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

const Login = (props: PropsFromRedux) => {
  const classes = useStyles()
  const { register, handleSubmit } = useForm()
  const [open, setOpen] = React.useState(false)
  const login = (data: dataForm) => {
    Meteor.loginWithPassword(data.email, data.password, (err: any) => {
      if (err !== undefined) {
        props.handleError({ error: err })
      }
    })
  }

  const onSubmitLogin = (data: any) => {
    login(data)
  }

  const onSubmitForgotPassword = () => {}

  const handleModal = () => {
    setOpen(!open)
  }
  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmitLogin)}>
          <TextField
            variant='filled'
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            inputRef={register}
            className={classes.input}
          />
          <TextField
            variant='filled'
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
            inputRef={register}
            className={classes.input}
          />
          <FormControlLabel
            control={
              <Checkbox
                name='remember'
                color='primary'
                inputRef={register}
              />
            }
            label='Remember me'
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Sign In
          </Button>
        </form>
        <Grid container>
          <Grid item xs>
            <Link color='primary' onClick={handleModal}>
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link
              onClick={() => props.navigateTo('signup', {}, { repalce: true })}
              variant='body2'
            >
              Don't have an account? Sign Up
            </Link>
          </Grid>
        </Grid>
      </div>
      <Dialog open={open} onClose={handleModal} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>Forgot password</DialogTitle>
        <form noValidate onSubmit={handleSubmit(onSubmitForgotPassword)}>
          <DialogContent>
            <DialogContentText>
              Did you forget your password?
            </DialogContentText>
            <TextField
              margin='dense'
              name='email'
              label='email'
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModal} color='primary'>
              Cancel
            </Button>
            <Button
              type='submit'
              onClick={handleModal}
              color='primary'
            >
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  )
}

export default connector(Login)
