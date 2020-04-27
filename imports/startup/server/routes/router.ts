import { Meteor } from 'meteor/meteor'
import { WebApp } from 'meteor/webapp'
import bodyParser from 'body-parser'
import router from 'router'
import Project from '../../../dbScheme/project'
import Integration from '../../../dbScheme/integration'
import logger from '../../../utils/logger'

const endpoint = router()

if (Meteor.isServer) {
  endpoint.get('/content/:_name', (req: any, res: any) => {
    const { authorization } = req.headers

    const queryArray = Object.entries(req.query)
    const meta = queryArray.reduce((r, [k, v]) => {
      if (k.startsWith('meta.')) {
        return { ...r, [k]: v }
      }
      return { ...r }
    }, [])

    logger.info('meta', meta)

    const projectContent = Project.findOne({ _id: authorization })?.content

    res.end(JSON.stringify(projectContent))
  })
  endpoint.get('/integration/:_id/config', async (req: any, res: any) => {
    const params = req.params
    const integration = Integration.findOne({ _id: params._id })

    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(integration.config))
  })
}

WebApp.connectHandlers.use(bodyParser.json())
WebApp.connectHandlers.use(endpoint)
