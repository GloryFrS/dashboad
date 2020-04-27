export interface Application {
  _id?: String
  type?: String
  name?: String
  description?: String
  integrations?: String[]
}

export interface NewIntegration {
  type: string
  title: string
  name: string
  endpoint: string
}

export interface StateInterace {
  columns: any[]
  data: any[]
 }
