import React, { useState } from 'react'
import Link from '@material-ui/core/Link'
import { connect, ConnectedProps } from 'react-redux'
import { NavigationOptions } from 'router5'
import { actions } from 'redux-router5'
import meteorCall from '../../../utils/meteorCall'
import useStyles from './styles'

interface Crumbs {
  path: string
  name: string
  params?: {
    _id: string,
    applicationId?: string,
    integrationsId?: string
  }
}

const mapStateToProps = (state: any) => ({
  route: state.router.route.name,
  params: state.router.route.params
})
const mapDispatchToProps = (dispatch: any) => ({
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

const BreadCrumbs = (props: PropsFromRedux) => {
  const classes = useStyles()
  const {
    _id,
    applicationId,
    integrationsId
  } = props.params
  const { navigateTo } = props
  const [crumbs, setCrumbs] = useState<Crumbs[]>([])
  const getProject = (id: string) => meteorCall('project.getInfo', { projectId: id })
  const getApplication = (id: string) => meteorCall('application.get', { applicationId: id })
  const getIntegration = (id: string) => meteorCall('integration.get', { integrationsId: id })
  const getBreadCrumbsPath = async () => {
    const newCrumbs: Crumbs[] = [{ path: 'my-projects', name: 'projects' }]

    if (_id) {
      const projectInfo: any = await getProject(_id)

      newCrumbs.push({
        path: 'project',
        name: projectInfo.name,
        params: { _id }
      })
    }
    if (applicationId) {
      const applicationInfo: any = await getApplication(applicationId)

      newCrumbs.push({
        path: 'application',
        name: applicationInfo.name,
        params: { _id, applicationId }
      })
    }
    if (integrationsId) {
      const integrationInfo: any = await getIntegration(integrationsId)

      newCrumbs.push({
        path: 'integration',
        name: integrationInfo.name,
        params: {
          _id,
          applicationId,
          integrationsId
        }
      })
    }
    setCrumbs(newCrumbs)
  }

  if (crumbs.length === 0 && _id) {
    getBreadCrumbsPath()
  }

  return (
    <div className={classes.root}>
      {crumbs.map((c: any, i: number) => <Link key={`crumb${i}`} onClick={() => navigateTo(c.path, c.params)}>{c.name}/</Link>)}
    </div>
  )
}

export default connector(BreadCrumbs)
