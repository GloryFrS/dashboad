import {
  OPEN_ALERT,
  CLOSE_ALERT,
  INIT_INTEGRATIONS
} from './constants'
import { IntegrationInterface } from '../dbScheme/integration/types'

export interface Alert {
  open?: boolean
  message?: string
  autoClose?: boolean
  severity?: 'info' | 'error' | 'succes' | 'warning'
}

export interface appState {
  alert: Alert,
  integrations: IntegrationInterface[]
}

interface openAlertAction {
  type: typeof OPEN_ALERT
  payload: Alert
}

interface closeAlertAction {
  type: typeof CLOSE_ALERT
}

interface initIntegrations {
  type: typeof INIT_INTEGRATIONS
  payload: IntegrationInterface[]
}

export type ActionTypes = openAlertAction | closeAlertAction | initIntegrations
