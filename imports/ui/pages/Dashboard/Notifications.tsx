import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import notificationStyles from './NotificationsStyles'

export default function Notifications () {
  const classes = notificationStyles()

  return (
    <List className={classes.root}>
      <ListItem>
        <ListItemText primary='Deduct 5 dollars from the account' secondary='Mar 12, 2020' />
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText primary='Deduct 5 dollars from the account' secondary='Mar 9, 2020' />
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText primary='Deduct 5 dollars from the account' secondary='Mar 1, 2020' />
      </ListItem>
    </List>
  )
}
