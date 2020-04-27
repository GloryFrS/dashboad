import { Meteor } from 'meteor/meteor'
import { HTTP } from 'meteor/http'
import { Random } from 'meteor/random'
import Application from '../../dbScheme/application'
import Integration from '../../dbScheme/integration'
import runTransactionAsync from '../../utils/runTransactionAsync'

const methods = {
  async 'integration.create' (props: any) {
    const _id = Random.id()
    const {
      applicationId,
      config
    } = props
    const addIntegrationTransaction = async () => {
      const integrationId = await Integration.insert({
        _id,
        title: String(config.table.title),
        name: String(config.table.name),
        type: config.table.type,
        endpoint: String(config.table.endpoint),
        config
      })

      Application.update(
        { _id: applicationId },
        { $push: { integrations: integrationId } }
      )

      return integrationId
    }
    const integrationId = await runTransactionAsync(addIntegrationTransaction)

    return integrationId
  },
  async 'integration.get' (props: any) {
    const result = await Integration.findOne({ _id: props.integrationsId })
    const { endpoint } = result

    try {
      const connectToCustomerApi = endpoint.includes('https') && HTTP.call('POST', endpoint, { data: { operation: 'list' } })

      return { ...result, ...connectToCustomerApi.data }
    } catch (error) {
      return result
    }
  },
  async 'integration.addTableRow' (props: any) {
    const { newData, endpoint } = props

    await HTTP.call('POST', endpoint, { data: { operation: 'add', data: newData } })
  },
  async 'integration.editTableRow' (props: any) {
    const { newData, endpoint } = props

    await HTTP.call('POST', endpoint, { data: { operation: 'update', data: newData } })
  },
  async 'integration.deleteTableRow' (props: any) {
    const { _id, endpoint } = props

    await HTTP.call('POST', endpoint, { data: { operation: 'delete', data: { _id } } })
  },
  async 'integration.delete' (props: any) {
    const { applicationId, integrationsId } = props
    const delAppTransaction = async () => {
      const delIneg = await Integration.remove({ _id: integrationsId })
      const delIntegFromApplication = (delIneg === 1) && Application.update(
        { _id: applicationId },
        { $pull: { integrations: integrationsId } }
      )

      return (delIneg === 1) && (delIntegFromApplication === 1)
    }
    const resultDel = await runTransactionAsync(delAppTransaction)

    return resultDel
  },
  async 'integration.update' (props: any) {
    const {
      newIntegration,
      integrationsId,
      actions
    } = props
    const integration = await Integration.findOne({ _id: integrationsId })
    const config = {
      table: {
        ...integration?.config?.table,
        ...newIntegration,
        actions
      }
    }
    const updated = await Integration.update(
      { _id: integrationsId },
      {
        $set: {
          ...integration,
          ...newIntegration,
          config
        }
      }
    )

    return updated
  }
}

export default Meteor.methods(methods)
