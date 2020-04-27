export interface Project {
  _id: string
  members: any[]
  name: string
  description: string
  'token_public': string
  content: string
}

export interface NewProject {
  title: string
  description: string
}
