import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import Project from '../../dbScheme/project'
import { ROLES_PROJECT, LANGUAGES } from '../../constants'

const methods = {
  'project.get' () {
    const userId = Meteor.userId()
    const myProjects = Project.find({ 'members.user': userId }).fetch()

    return myProjects
  },
  'project.getInfo' (props: any) {
    const { projectId } = props
    const userId = Meteor.userId()
    const myProject = Project.findOne({ 'members.user': userId, _id: projectId })

    return myProject
  },
  'project.create' (props: any) {
    const {
      title,
      description,
      lang
    } = props
    const defaultLanguage = LANGUAGES.find((l) => l.default)
    const _id = Random.id()
    const userId: string = String(Meteor.userId())
    const projectId = Project.insert({
      _id,
      members: [{ user: userId, role: String(ROLES_PROJECT.OWNER) }],
      name: String(title),
      description: String(description),
      token_public: String(_id),
      applications: [],
      content: [],
      default_language: lang || defaultLanguage?.short,
      languages: [lang || defaultLanguage?.short]
    })

    return projectId
  },
  'project.delete' (props: any) {
    const { projectId } = props
    const result = Project.remove({ _id: projectId })

    return result
  },
  'project.getApp' (props: any) {
    const { projectId } = props
    const userId = Meteor.userId()
    const myProjects = Project.find({ 'members.user': userId, _id: projectId }).fetch()

    return myProjects[0]
  },
  'project.addMember' (props: any) {
    const {
      projectId,
      emailMember,
      role
    } = props
    const userId = Meteor.users.findOne({ 'emails.address': emailMember })?._id
    const findUserInProject = Project.findOne({ 'members.user': userId, _id: projectId })

    let roleToProject

    if (!(role in ROLES_PROJECT) || ROLES_PROJECT.OWNER === role) {
      roleToProject = ROLES_PROJECT.REPORTER
    } else {
      roleToProject = role
    }

    if (findUserInProject === undefined) {
      const resultPush = Project.update(
        { _id: projectId },
        {
          $push: {
            members: {
              role: roleToProject,
              user: userId
            }
          }
        }
      )

      return resultPush
    } else {
      return 0
    }
  },
  'project.delMember' (props: any) {
    const {
      projectId,
      memberId
    } = props
    const resultPull = Project.update(
      { _id: projectId },
      {
        $pull: {
          members: {
            user: memberId
          }
        }
      }
    )

    return resultPull
  },
  'project.addContentLang' (props: any) {
    const {
      projectId, lang
    } = props
    const projectInfo = Project.findOne({ _id: projectId })
    const newContent = projectInfo?.content.reduce((r: any, item) => (
      r.concat({ ...item, value: { ...item.value, [lang]: item.key } })
    ), [])
    const content = Project.update(
      { _id: projectId },
      {
        $set: { content: newContent }
      }
    )

    return content
  },
  'project.getContentKey' (props: any) {
    const { projectId } = props
    const { content } = Project.findOne({ _id: projectId }) || {}

    return content
  },
  'project.addContentKey' (props: any) {
    const {
      projectId,
      key,
      meta,
      value
    } = props
    const projectInfo = Project.findOne({ _id: projectId })

    if (projectInfo && projectInfo.content.find(c => c.key === key)) {
      throw new Meteor.Error('This key already exists')
    }

    const otherValues: any = projectInfo?.languages.reduce((r, lang) => ({ ...r, [lang]: key }), {})
    const result = Project.update(
      { _id: projectId },
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
  'project.updateMember' (props: any) {
    const {
      projectId,
      memberId,
      role
    } = props

    let roleToProject

    if (!(role in ROLES_PROJECT) || ROLES_PROJECT.OWNER === role) {
      return false
    } else {
      roleToProject = role
    }

    const resultSet = Project.update(
      { _id: projectId, 'members.user': memberId },
      {
        $set: {
          'members.$.role': roleToProject
        }
      }
    )

    return resultSet
  },
  'project.setContentKey' (props: any) {
    const {
      projectId,
      key,
      values
    } = props
    const changes: any = Object.entries(values).reduce((r, item) => ({ ...r, [`content.$.value.${item[0]}`]: item[1] }), {})
    const content = Project.update(
      { _id: projectId, 'content.key': key },
      {
        $set: changes
      }
    )

    return content
  },
  'project.delContentKey' (props: any) {
    const { projectId, key } = props
    const content = Project.update(
      { _id: projectId },
      {
        $pull: { content: { key } }
      }
    )

    return content
  },
  'project.setMetaData' (props: any) {
    const {
      projectId,
      key,
      meta
    } = props
    const result = Project.update(
      { _id: projectId, 'content.key': key },
      {
        $set: { 'content.$.meta': meta }
      }
    )

    return result
  }
}

export default Meteor.methods(methods)
