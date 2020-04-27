import { Meteor } from 'meteor/meteor'

const methods = {
  'users.getInfo' (props: any) {
    const { members } = props
    const users = members.map((member: any) => {
      const user: any = Meteor.users.findOne({ _id: member.user })

      return {
        _id: user._id,
        username: user.username,
        email: user.emails[0],
        role: member.role
      }
    })

    return users
  },
  'users.updateUserInformation' (props: any) {
    const { _id, userData } = props
    const user: any = Meteor.users.findOne({ _id })
    const updatedUser: any = Meteor.users.update({ _id }, { $set: { ...user, ...userData } })

    return updatedUser
  }
}

export default Meteor.methods(methods)
