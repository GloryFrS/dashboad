import {
  appState,
  ActionTypes
} from '../types'
import {
  OPEN_ALERT,
  CLOSE_ALERT,
  INIT_INTEGRATIONS
} from '../constants'

const initialState: appState = {
  alert: {
    open: false
  },
  integrations: []
}

export default (
  state = initialState,
  action: ActionTypes
) => {
  switch (action.type) {
    case OPEN_ALERT:
      return {
        ...state,
        alert: action.payload
      }
    case CLOSE_ALERT:
      return {
        ...state,
        alert: { open: false }
      }
    case INIT_INTEGRATIONS:
      return {
        ...state,
        integrations: action.payload
      }
    default:
      return state
  }
}
