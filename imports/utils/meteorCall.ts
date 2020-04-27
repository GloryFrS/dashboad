import { Meteor } from 'meteor/meteor'

export default (name: string, options?: any) => new Promise((resolve, reject) => {
  Meteor.call(name, options, (err: Error, res: any) => {
    if (err) {
      reject(err || new Error(`Meteor.call failed on ${name}`))
    } else {
      resolve(res)
    }
  })
})
