import React, { useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import {
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  DialogActions,
  Paper,
  Button,
  Avatar,
  Typography,
  Grid
} from '@material-ui/core'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined'
import { useForm } from 'react-hook-form'
import meteorCall from '../../../utils/meteorCall'
import { handleError } from '../../../store/actions'
import { UserProfile } from './interfaces'
import useStyles from './styles'

const mapStateToProps = (state: any) => ({
  user: state.meteor.user
})
const mapDispatchToProps = (dispatch: any) => ({
  handleError: (body: any) => dispatch(handleError(body))
})
const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

const Profile = (props: PropsFromRedux) => {
  const [editModal, setEditModal] = useState(false)
  const {
    _id,
    profile = {},
    emails,
    username
  } = props.user
  const {
    register,
    handleSubmit
  } = useForm()
  const classes = useStyles()
  const updateProfile = async (updateProfileValue: UserProfile) => {
    try {
      await meteorCall('users.updateUserInformation', {
        _id,
        userData: {
          profile: {
            ...profile,
            ...updateProfileValue
          }
        }
      })
    } catch (error) {
      props.handleError({ error })
    }
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item>
            <Avatar className={classes.avatar} src={profile.awatar || `https://via.placeholder.com/150/000000/FFFFFF?text=${username}`} alt='noname team' />
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction='column' spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant='subtitle1'>
                  {profile.lastName} {profile.firstName}
                </Typography>
                {profile.phone && <Typography variant='subtitle1'>Телефон: {profile.phone}</Typography>}
              </Grid>
              <Grid item>
                <Typography variant='body2' color='textSecondary'>ID: {_id}</Typography>
                <Typography variant='body2' color='textSecondary'>Username: {username}</Typography>
                <Typography variant='body2'>Emails:</Typography>
                {
                  emails.map((e: any, i: number) => (
                    <Grid
                      key={`email${i}`}
                      container
                      direction='row'
                      justify='space-between'
                      alignItems='center'
                    >
                      <Typography variant='body2'>
                        {e.address}
                      </Typography>
                      {e.verified ? <CheckOutlinedIcon /> : <CloseOutlinedIcon />}
                    </Grid>
                  ))
                }
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          direction='column'
          justify='center'
          alignItems='stretch'
        >
          <Grid item>
            <Button onClick={() => setEditModal(!editModal)}>Редактировать</Button>
          </Grid>
        </Grid>
      </Paper>
      <Dialog
        open={editModal}
        onClose={() => setEditModal(!editModal)}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Редактрировать информацию пользователя</DialogTitle>
        <form noValidate onSubmit={handleSubmit(updateProfile)}>
          <DialogContent>
            <TextField
              margin='dense'
              name='firstName'
              label='Имя'
              fullWidth
              defaultValue={profile.firstName}
              inputRef={register}
            />
            <TextField
              margin='dense'
              name='lastName'
              label='Фамилия'
              defaultValue={profile.lastName}
              fullWidth
              inputRef={register}
            />
            <TextField
              margin='dense'
              name='phone'
              label='Телефон'
              type='tel'
              defaultValue={profile.phone}
              fullWidth
              inputRef={register}
            />
            <TextField
              margin='dense'
              name='avatar'
              label='Avatar url'
              defaultValue={profile.avatar}
              fullWidth
              inputRef={register}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditModal(false)} color='primary'>
              Отмена
            </Button>
            <Button
              type='submit'
              onClick={() => setEditModal(false)}
              color='primary'
            >
              Обновить
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}

export default connector(Profile)
