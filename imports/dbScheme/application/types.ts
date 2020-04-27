export interface ApplicationInterface {
  _id: string,
  type: string,
  name: string,
  description: string,
  'token_secret': string,
  integrations: string[],
  structure?: string,
  content: contentInterface[]
}

interface values<TValue> {
  [id: string]: TValue
}

export interface contentInterface {
  key: string,
  meta: values<string>,
  value: values<string>
}
