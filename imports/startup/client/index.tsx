import React from 'react'
import { Meteor } from 'meteor/meteor'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router5'
import App from '../../ui/layouts/App'
import createStore from '../../store/createStore'
import createRouter from '../../router/createRouter'

const router = createRouter()
const store = createStore(router)

Meteor.startup(() => {
  router.start(() => {
    render((
      <Provider store={store}>
        <RouterProvider router={router}>
          <App />
        </RouterProvider>
      </Provider>
    ), document.getElementById('react-root'))
  })
})
