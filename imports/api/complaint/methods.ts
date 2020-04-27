import { Meteor } from 'meteor/meteor'
import Complaints from '../../dbScheme/complaint'

const methods = {
  'complaints.get' () {
    const myComplaints = Complaints.find().fetch()

    return myComplaints
  },
  'complaints.add' (props: any) {
    const complaintsId = Complaints.insert(props)

    return complaintsId
  }
}

export default Meteor.methods(methods)
