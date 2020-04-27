import { Column } from 'material-table/types'

export interface IntegrationInterface {
  _id: string,
  title: string,
  name: string,
  type: string,
  endpoint: string,
  config: configtInterface,
  data: any[]
}

interface fieldsInterface {
  name: string,
  title: string,
  type: string
}

interface tableInterface {
  name: string,
  fields: Column<fieldsInterface>[],
  actions: string[]
}

interface configtInterface {
  table : tableInterface,
  form : string,
  chart: string
}
