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
  Container
} from '@material-ui/core/'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { connect, ConnectedProps } from 'react-redux'
import { NavigationOptions } from 'router5'
import { actions } from 'redux-router5'
import { useForm } from 'react-hook-form'
import { Accounts } from 'meteor/accounts-base'
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

const SignUp = (props: PropsFromRedux) => {
  const classes = useStyles()
  const { register, handleSubmit } = useForm()
  const signUp = (data: dataForm) => {
    Accounts.createUser({
      username: data.firstName + data.lastName,
      email: data.email,
      password: data.password
    }, (err: any) => {
      if (err !== undefined) {
        props.handleError({ error: err })
      }
    })
  }
  const onSubmit = (data: any) => {
    signUp(data)
  }

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete='fname'
                name='firstName'
                variant='filled'
                required
                fullWidth
                id='firstName'
                label='First Name'
                autoFocus
                inputRef={register}
                className={classes.input}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant='filled'
                required
                fullWidth
                id='lastName'
                label='Last Name'
                name='lastName'
                autoComplete='lname'
                inputRef={register}
                className={classes.input}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='filled'
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                inputRef={register}
                className={classes.input}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='filled'
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
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    color='primary'
                    name='allowExtraEmails'
                    inputRef={register}
                  />
                }
                label='I want to receive inspiration, marketing promotions and updates via email.'
              />
            </Grid>
          </Grid>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify='flex-end'>
            <Grid item>
              <Link
                variant='body2'
                onClick={() => props.navigateTo('login', {}, { repalce: true })}
              >
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  )
}

export default connector(SignUp)
