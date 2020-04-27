import { Mongo } from 'meteor/mongo'

interface ComplaintInterface {
  _id: string,
  message: string,
  type: string
}

const Complaint = new Mongo.Collection<ComplaintInterface>('complaint')

export default Complaint
