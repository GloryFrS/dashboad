export interface Application {
  _id: string
  type: string
  name: string
  description: string
  'token_secret': string
  integrations: string
  'content_schema': string
}

export interface NewApplication {
  type: string
  title: string
  description: string
}
