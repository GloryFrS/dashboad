import {
  Alert,
  Integration,
  ActionTypes
} from '../types'
import {
  OPEN_ALERT,
  CLOSE_ALERT,
  INIT_INTEGRATIONS
} from '../constants'
import meteorCall from '../../utils/meteorCall'

export const openAlert = (props: Alert): ActionTypes => {
  const {
    open = true,
    message = '',
    autoClose = true,
    severity = 'info'
  } = props

  return {
    type: OPEN_ALERT,
    payload: {
      open,
      message,
      autoClose,
      severity
    }
  }
}

export const initIntegrations = (props: Integration[]): ActionTypes => ({
  type: INIT_INTEGRATIONS,
  payload: props
})

export const closeAlert = (): ActionTypes => {
  return {
    type: CLOSE_ALERT
  }
}

export const handleError = (props: any) => (dispatch: any) => {
  const {
    error = new Error('Ошибка')
  } = props

  meteorCall('complaints.add', {
    message: error.message,
    type: 'COMPLAINT_BUG'
  })
  dispatch(openAlert({
    message: 'Ошибка',
    severity: 'error'
  }))
}
