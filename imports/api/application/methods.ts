import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import Application from '../../dbScheme/application'
import Integration from '../../dbScheme/integration'
import Project from '../../dbScheme/project'
import runTransactionAsync from '../../utils/runTransactionAsync'

const methods = {
  'applications.get' (props: any) {
    const { arrIds } = props
    const myApplications = Application.find({
      _id: { $in: arrIds }
    })
      .fetch()

    return myApplications
  },
  'application.get' (props: any) {
    const { applicationId } = props
    const myApplication = Application.find({
      _id: applicationId
    })
      .fetch()[0]
    const integrations = Integration.find({ _id: { $in: myApplication.integrations } }).fetch()

    myApplication.integrations = integrations

    return myApplication
  },
  async 'application.create' (props: any) {
    const _id = Random.id()
    const {
      projectId,
      type,
      title,
      description
    } = props
    const addAppTransaction = async () => {
      const applicationId = await Application.insert({
        _id,
        type: String(type),
        name: String(title),
        description: String(description),
        token_secret: String(_id),
        integrations: [],
        structure: 'content',
        content: []
      })

      Project.update(
        { _id: projectId },
        { $push: { applications: applicationId } }
      )

      return applicationId
    }
    const applicationId = await runTransactionAsync(addAppTransaction)

    return applicationId
  },
  async 'application.delete' (props: any) {
    const { applicationId, projectId } = props
    const delAppTransaction = async () => {
      const delApp = await Application.remove({ _id: applicationId })
      const delAppFromProject = Project.update(
        { _id: projectId },
        { $pull: { applications: applicationId } }
      )

      return (delApp === 1) && (delAppFromProject === 1)
    }
    const resultDel = await runTransactionAsync(delAppTransaction)

    return resultDel
  },
  'application.setStructure' (props: any) {
    const {
      applicationId,
      structure
    } = props
    const result = Application.update({ _id: applicationId }, { $set: { structure: JSON.stringify(structure) } })

    return result
  },
  'application.getContentKey' (props: any) {
    const { applicationId } = props
    const { content } = Application.findOne({ _id: applicationId }) || {}

    return content
  },
  'application.addContentKey' (props: any) {
    const {
      applicationId,
      projectId,
      key,
      meta,
      value
    } = props
    const projectInfo = Project.findOne({ _id: projectId })
    const applicationInfo = Application.findOne({ _id: applicationId })

    if (applicationInfo && applicationInfo.content.find(c => c.key === key)) {
      throw new Meteor.Error('This key already exists')
    }

    const otherValues: any = projectInfo?.languages.reduce((r, lang) => ({ ...r, [lang]: key }), {})
    const result = Application.update(
      { _id: applicationId },
      {
        $push: {
          content: {
            key,
            meta,
            value: {
              ...otherValues,
              [`${projectInfo?.['default_language']}`]: value
            }
          }
        }
      }
    )

    return result
  },
  'application.setContentKey' (props: any) {
    const {
      applicationId,
      key,
      values
    } = props
    const changes: any = Object.entries(values).reduce((r, item) => ({ ...r, [`content.$.value.${item[0]}`]: item[1] }), {})
    const content = Application.update(
      { _id: applicationId, 'content.key': key },
      {
        $set: changes
      }
    )

    return content
  },
  'application.delContentKey' (props: any) {
    const { applicationId, key } = props
    const content = Application.update(
      { _id: applicationId },
      {
        $pull: { content: { key } }
      }
    )

    return content
  },
  'application.updateAllContent' (props: any) {
    const { jsonData, applicationId } = props
    const content = Application.update(
      { _id: applicationId },
      {
        $set: { content: jsonData }
      }
    )

    return content
  },
  'application.getContentId' (props: any) {
    const { applicationId, lang } = props
    const projectInfo = Project.findOne({ applications: applicationId })
    const projectContent = projectInfo?.content.reduce((r, i) => ({ ...r, [i.key]: i.value[lang] }), {})
    const applicationInfo = Application.findOne({ _id: applicationId })
    const applicationContent = applicationInfo?.content.reduce((r, i) => ({ ...r, [i.key]: i.value[lang] }), {})

    return { ...projectContent, ...applicationContent }
  },
  'application.setMetaData' (props: any) {
    const {
      applicationId,
      key,
      meta
    } = props
    const result = Application.update(
      { _id: applicationId, 'content.key': key },
      {
        $set: { 'content.$.meta': meta }
      }
    )

    return result
  }
}

export default Meteor.methods(methods)
