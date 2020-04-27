import { Meteor } from 'meteor/meteor'
import { registerReactiveSource } from 'meteor-redux-middlewares'
import { USER_INITIALIZATION_START } from '../constants'
export const initUser = () => async (dispatch: any) => {
  try {
    await dispatch({ type: USER_INITIALIZATION_START })
    dispatch(loadUser())
    dispatch(logginIn())
  } catch {}
}
export const loadUser = () => registerReactiveSource({
  key: 'user',
  get: () => Meteor.user() || {}
})
export const logginIn = () => registerReactiveSource({
  key: 'user_logging',
  get: () => Meteor.loggingIn() || {}
})
