import { Meteor } from 'meteor/meteor'
import { Roles } from 'meteor/alanning:roles'

Meteor.users.after.insert((userId: any, doc: any) => {
  if (!userId && Meteor.users.find().count() === 0) {
    return Roles.addUsersToRoles(doc._id, ['ADMIN'], Roles.GLOBAL_GROUP)
  }
  if (!userId) {
    return Roles.addUsersToRoles(doc._id, ['USER'], Roles.GLOBAL_GROUP)
  }
})
