import React from 'react'
import { Accounts } from 'meteor/accounts-base'
import { connect, ConnectedProps } from 'react-redux'
import { NavigationOptions } from 'router5'
import { actions } from 'redux-router5'

const mapStateToProps = (state: any) => ({
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

const VerifyEmail = (props: PropsFromRedux) => {
  const { _token } = props.params

  if (_token) {
    Accounts.verifyEmail(_token, (err) => {
      if (err) {
        props.navigateTo('dashboard', {}, { replace: true })
      } else {
        props.navigateTo('dashboard', {}, { replace: true })
      }
    })
  }

  return (
    <div className='Profile'>
      <h1 className='Profile__title'>VerfiEmail Title</h1>
    </div>
  )
}

export default connector(VerifyEmail)
