import { Mongo } from 'meteor/mongo'
import { ProjectInterface } from './types'

const Project = new Mongo.Collection<ProjectInterface>('project')

export default Project
