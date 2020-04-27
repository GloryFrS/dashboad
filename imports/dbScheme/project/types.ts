import { contentInterface } from '../application/types'

interface MemberInterface {
  user: string,
  role: string
}

export interface ProjectInterface {
  _id: string,
  members: MemberInterface[],
  name: string,
  description: string,
  'token_public': string,
  applications: string[],
  content: contentInterface[],
  'default_language': string,
  languages: string[]
}
