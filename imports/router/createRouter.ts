import createRouter from 'router5'
import loggerPlugin from 'router5-plugin-logger'
import browserPlugin from 'router5-plugin-browser'
import routes from './routes'

export default () => {
  const router = createRouter(routes, { defaultRoute: 'main' })

  if (process.env.NODE_ENV === 'development') {
    router.usePlugin(loggerPlugin)
  }
  router.usePlugin(browserPlugin({ useHash: false }))

  return router
}
