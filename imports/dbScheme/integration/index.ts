import { Mongo } from 'meteor/mongo'
import { IntegrationInterface } from './types'

const Integration = new Mongo.Collection<IntegrationInterface>('integration')

export default Integration
