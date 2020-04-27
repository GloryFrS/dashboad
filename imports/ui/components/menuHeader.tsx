import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Accounts } from 'meteor/accounts-base'
import { connect, ConnectedProps } from 'react-redux'
import { NavigationOptions } from 'router5'
import { actions } from 'redux-router5'
import {
  ListItem,
  IconButton,
  Icon,
  Typography
} from '@material-ui/core'
import {
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core/styles'
import { OpenMenuProfileProps } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuHeaderOpen: {
      justifyContent: 'space-between',
      padding: theme.spacing(1, 0.5),
      borderBottom: '1px solid #363636'
    },
    infoUser: {
      maxWidth: '140px'
    },
    infoUserEmailTrue: {
      color: 'rgb(4, 191, 110)'
    },
    infoUserEmailFalse: {
      color: 'rgb(191, 62, 4)',
      cursor: 'pointer',
      textDecoration: 'underline'
    },
    menuHeaderOpenIcon: {
      color: '#a1a1a1'
    },
    username: {
      color: '#fff'
    }
  })
)
const mapDispatchToProps = (dispatch: any) => ({
  navigateTo: (
    name: string,
    params?: { [key: string]: any },
    opts: NavigationOptions = {}
  ) => {
    dispatch(actions.navigateTo(name, params, opts))
  }
})
const connector = connect(null, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & OpenMenuProfileProps

const DefCloseMenuProfile = (props: any) => {
  const classes = useStyles()

  return (
    <ListItem divider style={{ padding: '4px' }}>
      <IconButton className={classes.menuHeaderOpenIcon} onClick={() => { props.navigateTo('profile') }}>
        <Icon>person</Icon>
      </IconButton>
    </ListItem>
  )
}

const DefOpenMenuProfile = (props: Props) => {
  const classes = useStyles()

  return (
    <ListItem
      divider
      className={classes.menuHeaderOpen}
      style={{
        width: props.widthMenu
      }}
    >
      <IconButton className={classes.menuHeaderOpenIcon} onClick={() => { props.navigateTo('profile') }}>
        <Icon>person</Icon>
      </IconButton>
      <div className={classes.infoUser}>
        <Typography className={classes.username} variant='h6'>{props.user.username}</Typography>
        <Typography
          variant='subtitle2'
          className={props.user.emails[0].verified ? classes.infoUserEmailTrue : classes.infoUserEmailFalse}
          onClick={!props.user.emails[0].verified ? () => { Meteor.call('verifyUserEmail') } : () => { }}
        >
          {`${props.user.emails[0].verified ? 'Email подтвержден' : 'Email не подтвержден'}`}
        </Typography>
      </div>
      <IconButton className={classes.menuHeaderOpenIcon} onClick={() => { Accounts.logout() }}>
        <Icon>exit_to_app</Icon>
      </IconButton>
    </ListItem>
  )
}
export const OpenMenuProfile = connector(DefOpenMenuProfile)
export const CloseMenuProfile = connector(DefCloseMenuProfile)
