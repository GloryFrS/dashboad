import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { NavigationOptions } from 'router5'
import { actions } from 'redux-router5'
import CircularProgress from '@material-ui/core/CircularProgress'
import {
  Project,
  Dashboard,
  Login,
  Main,
  MyProjects,
  NewProject,
  Profile,
  SettingApplication,
  Signup,
  VerifyEmail,
  Application,
  Integration
} from '../pages/'
import {
  MenuDrawer,
  CloseMenuProfile,
  OpenMenuProfile,
  Alert
} from '../components'
import { closeAlert } from '../../store/actions'
import { initUser } from '../../store/meteor/actions'
import useStyles from './styles'

const mapStateToProps = (state: any) => ({
  alert: state.app.alert,
  ready: state.meteor.ready,
  user: state.meteor.user,
  logging: state.meteor.logging,
  route: state.router.route
})
const mapDispatchToProps = (dispatch: any) => ({
  handleCloseAlert: () => {
    dispatch(closeAlert())
  },
  initUser: () => {
    dispatch(initUser())
  },
  navigateTo: (
    name: string,
    params?: { [key: string]: any },
    opts: NavigationOptions = {}
  ) => {
    dispatch(actions.navigateTo(name, params, opts))
  }
})
const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

const App = (props: PropsFromRedux) => {
  useEffect(() => {
    if (!props.ready) {
      props.initUser()
    }
  }, [props.ready])

  const classes = useStyles()
  const widthMenu = 250
  const menuElements = [
    {
      divider: false,
      icon: 'home',
      title: 'Главная',
      route: 'dashboard',
      itmes: []
    },
    {
      divider: false,
      icon: 'desktop_windows',
      title: 'Проекты',
      itmes: [
        {
          divider: false,
          icon: 'star',
          title: 'Мои проекты',
          route: 'my-projects',
          itmes: []
        },
        {
          divider: false,
          icon: 'add_circle',
          title: 'Добавить',
          route: 'new-project',
          itmes: []
        }
      ]
    }
  ]
  const routes = [
    { component: <Main />, name: 'main' },
    { component: <Dashboard />, name: 'dashboard' },
    { component: <MyProjects />, name: 'my-projects' },
    { component: <NewProject />, name: 'new-project' },
    { component: <Project />, name: 'project' },
    { component: <Application />, name: 'application' },
    { component: <SettingApplication />, name: 'setting-application' },
    { component: <Profile />, name: 'profile' },
    { component: <VerifyEmail />, name: 'verify-email' },
    { component: <Integration />, name: 'integration' }
  ]
  const loginRoutes = [
    { component: <Login />, name: 'login' },
    { component: <Signup />, name: 'signup' },
    { component: <VerifyEmail />, name: 'verify-email' }
  ]

  if (props.logging) {
    return (
      <div className={classes.loading}>
        <CircularProgress />
      </div>
    )
  } else if (props.user._id) {
    const renderComponent = routes.find((r: any) => r.name === props.route.name)

    if (!renderComponent) {
      props.navigateTo('main')

      return <CircularProgress />
    }

    return (
      <MenuDrawer
        headerClose={<CloseMenuProfile />}
        headerOpen={<OpenMenuProfile user={props.user} widthMenu={widthMenu} />}
        DrawerWidth={widthMenu}
        menuElements={menuElements}
      >
        <Alert {...props.alert} onClose={props.handleCloseAlert} />
        {renderComponent.component}
      </MenuDrawer>
    )
  } else {
    const renderComponent = loginRoutes.find((r: any) => r.name === props.route.name)

    if (!renderComponent) {
      props.navigateTo('login')

      return <CircularProgress />
    }
    return renderComponent.component
  }
}

export default connector(App)
