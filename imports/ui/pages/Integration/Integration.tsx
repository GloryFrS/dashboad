import React, { useEffect, useState } from 'react'
import MaterialTable from 'material-table'
import {
  Container,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  FormControlLabel,
  Checkbox,
  FormLabel,
  FormGroup
} from '@material-ui/core'
import { useForm } from 'react-hook-form'
import { connect, ConnectedProps } from 'react-redux'
import { NavigationOptions } from 'router5'
import { actions } from 'redux-router5'
import meteorCall from '../../../utils/meteorCall'
import { BreadCrumbs } from '../../components'
import { IntegrationInterface } from '../../../dbScheme/integration/types'
import globalStyles from '../../layouts/styles'
import useStyles from './styles'

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

const Integration = (props: PropsFromRedux) => {
  const [refresh, setRefresh] = useState(false)
  const globalClasses = globalStyles()
  const [state, setState] = useState<IntegrationInterface>()
  const {
    _id,
    applicationId,
    integrationsId
  } = props.params
  const { register, handleSubmit } = useForm()
  const classes = useStyles()
  const deleteIntegration = async () => {
    await meteorCall('integration.delete', { applicationId, integrationsId })
    props.navigateTo('application', { _id, applicationId })
  }
  const [openUpdateIntegration, setOpenUpdateIntegration] = useState(false)
  const handleModalUpdateIntegation = () => setOpenUpdateIntegration(!openUpdateIntegration)
  const onSubmitUpdateIntegration = async (data: any) => {
    const actions = []

    for (const [key, value] of Object.entries(data)) {
      const keysArr = ['add', 'delete', 'update']

      if (keysArr.includes(key)) {
        delete data[key]
        if (value) { actions.push(key) }
      }
    }

    await meteorCall('integration.update', {
      newIntegration: data,
      integrationsId,
      actions
    })
    setRefresh(!refresh)
  }

  useEffect(() => {
    (async () => {
      const result: any = await meteorCall('integration.get', { integrationsId })

      setState(result)
    })()
  }, [refresh])

  if (!state) {
    return null
  }

  const deleteRow = async (oldData: any) => {
    const { _id } = oldData
    const { endpoint } = state

    await meteorCall('integration.deleteTableRow', { _id, endpoint })
    setRefresh(!refresh)
  }

  const addRow = async (newData: any) => {
    const { endpoint } = state

    await meteorCall('integration.addTableRow', { newData, endpoint })
    setRefresh(!refresh)
  }

  const updateRow = async (newData: any, oldData: any) => {
    let check = false
    const { endpoint } = state

    for (const [key, value] of Object.entries(newData)) {
      if (oldData[key] !== value) {
        check = true
      }
    }

    if (check) {
      await meteorCall('integration.editTableRow', { newData, endpoint })
      setRefresh(!refresh)
    }
  }

  const integrationInfo = (
    <>
      <div className={globalClasses.title}>
        <h2>Интеграция</h2>
      </div>
      <Paper className={classes.integration}>
        <div className={classes.integrationActions}>
          <Button
            className={classes.button}
            variant='contained'
            color='primary'
            onClick={handleModalUpdateIntegation}
          >
            Настройки
          </Button>
          <Button
            className={classes.button}
            variant='contained'
            color='secondary'
            onClick={deleteIntegration}
          >
            Удалить
          </Button>
        </div>
      </Paper>
    </>
  )

  const editableProps = state.config && Object.keys(state.config.table.actions).reduce((r: any, item: any) => {
    const config: any = {
      add: { onRowAdd: (newData: any) => addRow(newData) },
      delete: { onRowDelete: (oldData: any) => deleteRow(oldData) },
      update: { onRowUpdate: (newData: any, oldData: any) => updateRow(newData, oldData) }
    }

    return {
      ...r,
      ...config[item]
    }
  }, {})

  const content = state.type === 'TABLE' ? (
    <div>
      <p style={{ color: '#fff' }}>{state.name}</p>
      <MaterialTable
        title={state.title}
        columns={[...state.config.table.fields]}
        data={state.data}
        editable={editableProps}
      />
    </div>
  ) : 'loading...'

  return (
    <Container maxWidth='lg'>
      <BreadCrumbs />
      {integrationInfo}
      {content}
      <Dialog
        open={openUpdateIntegration}
        onClose={handleModalUpdateIntegation}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Добавить интеграцию</DialogTitle>
        <form noValidate onSubmit={handleSubmit(onSubmitUpdateIntegration)}>
          <DialogContent>
            <DialogContentText>
              Интеграция связывает серверную часть вашего приложения с ND.
            </DialogContentText>
            <TextField
              margin='dense'
              name='title'
              label='Название'
              fullWidth
              inputRef={register}
              defaultValue={state?.title}
            />
            <TextField
              margin='dense'
              name='name'
              label='Имя (для общения с сервером)'
              fullWidth
              inputRef={register}
              defaultValue={state?.name}
            />
            <TextField
              margin='dense'
              name='endpoint'
              label='Endpoint'
              fullWidth
              inputRef={register}
              defaultValue={state?.endpoint}
            />
            <FormLabel component='legend'>Возможные действия</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox name='add' defaultChecked={state.config && state.config.table.actions.includes('add')} />}
                label='add'
                inputRef={register}
              />
              <FormControlLabel
                control={<Checkbox name='delete' defaultChecked={state.config && state.config.table.actions.includes('delete')} />}
                label='delete'
                inputRef={register}
              />
              <FormControlLabel
                control={<Checkbox name='update' defaultChecked={state.config && state.config.table.actions.includes('update')} />}
                label='update'
                inputRef={register}
              />
            </FormGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModalUpdateIntegation} color='primary'>
              Отменить
            </Button>
            <Button
              type='submit'
              onClick={handleModalUpdateIntegation}
              color='primary'
            >
              Сохранить
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  )
}

export default connector(Integration)
