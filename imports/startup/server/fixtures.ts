import { Meteor } from 'meteor/meteor'
import Project from '../../dbScheme/project'
import Application from '../../dbScheme/application'
import Integration from '../../dbScheme/integration'

Meteor.startup(() => {
  return {
    ...Project,
    ...Application,
    ...Integration
  }
})
