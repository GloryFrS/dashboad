import {
  USER_REACTIVE_SOURCE_CHANGED,
  USER_LOGGING_REACTIVE_SOURCE_CHANGED,
  USER_INITIALIZATION_START
} from '../constants'
import { meteorUpdate } from '../types'

const initialState = {
  ready: false,
  user: {},
  logging: true
}

export default (
  state = initialState,
  action: meteorUpdate
) => {
  switch (action.type) {
    case USER_INITIALIZATION_START:
      return {
        ...state,
        ready: true
      }
    case USER_REACTIVE_SOURCE_CHANGED:
      return {
        ...state,
        user: action.payload
      }
    case USER_LOGGING_REACTIVE_SOURCE_CHANGED:
      return {
        ...state,
        logging: typeof action.payload === 'boolean' ? action.payload : false
      }
    default:
      return state
  }
}
