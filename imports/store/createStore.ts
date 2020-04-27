import {
  createStore,
  applyMiddleware,
  compose
} from 'redux'
import { Tracker } from 'meteor/tracker'
import createReactiveMiddlewares from 'meteor-redux-middlewares'
import { router5Middleware } from 'redux-router5'
import thunk from 'redux-thunk'
import reducers from './reducers'

export default function configureStore (router: any) {
  const {
    sources,
    subscriptions
  } = createReactiveMiddlewares(Tracker)
  const middlewares = [
    sources,
    subscriptions,
    router5Middleware(router),
    thunk
  ]

  if (process.env.NODE_ENV === 'development') {
    const { logger } = require('redux-logger')
    middlewares.push(logger)
  }

  const store = createStore(
    reducers(),
    compose(applyMiddleware(...middlewares))
  )

  return store
}
