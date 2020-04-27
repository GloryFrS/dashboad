import { Mongo } from 'meteor/mongo'
import { ApplicationInterface } from './types'

const Application = new Mongo.Collection<ApplicationInterface>('application')

export default Application
