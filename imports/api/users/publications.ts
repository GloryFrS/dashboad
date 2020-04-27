import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { Roles } from 'meteor/alanning:roles'

if (Meteor.isServer) {
  Meteor.publish('users.all', function () {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return Meteor.users.find()
    }
    return this.ready()
  })

  Meteor.publish('user', function () {
    if (this.userId) {
      return Meteor.users.find(
        { _id: this.userId },
        {
          fields: {
            emails: 1,
            profile: 1,
            status: 1
          }
        }
      )
    }
    return this.ready()
  })

  Meteor.methods({
    verifyUserEmail () {
      if (this.userId) {
        Accounts.sendVerificationEmail(this.userId)
      }
    }
  })
}
