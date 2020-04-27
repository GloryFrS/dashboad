import { Meteor } from 'meteor/meteor'
import { Roles } from 'meteor/alanning:roles'

Meteor.users.deny({
  update () {
    return true
  }
})
Meteor.startup(() => {
  const roles = ['ADMIN', 'USER', 'GUEST']

  roles.forEach(role => Roles.createRole(role, { unlessExists: true }))
})
