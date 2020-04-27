import { combineReducers } from 'redux'
import { router5Reducer } from 'redux-router5'
import app from './app'
import meteor from '../meteor/reducers'

export default () => {
  return combineReducers({
    router: router5Reducer,
    app,
    meteor
  })
}
