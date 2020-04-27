import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { connect, ConnectedProps } from 'react-redux'
import {
  Paper,
  Button,
  Container,
  Portal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  FormControl,
  InputLabel,
  Grid,
  Select,
  DialogActions,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormLabel,
  FormGroup
} from '@material-ui/core'
import MaterialTable from 'material-table'
import CodeIcon from '@material-ui/icons/Code'
import ContentApplication from '../ContentApplication'
import { NavigationOptions } from 'router5'
import { actions } from 'redux-router5'
import { StateInterace, Application as ApplicationInterface } from './types'
import meteorCall from '../../../utils/meteorCall'
import { BreadCrumbs } from '../../components'
import { TYPES_INTEGRATION } from '../../../constants'
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

const Application = (props: PropsFromRedux) => {
  const [application, setApplication] = React.useState<ApplicationInterface>({})
  const [refresh, setRefresh] = React.useState(false)
  const [showContent, setShowContent] = React.useState(false)
  const [showIntegrations, setShowIntegrations] = React.useState(false)
  const [openAddIntegration, setOpenAddIntegration] = React.useState(false)
  const [state, setState] = React.useState<StateInterace>({
    columns: [
      { title: 'название', field: 'title' },
      { title: 'field', field: 'field' },
      {
        title: 'тип',
        field: 'types',
        initialEditValue: 'text',
        lookup: { text: 'text', date: 'date' }
      }
    ],
    data: []
  })
  const container = React.useRef(null)
  const globalClasses = globalStyles()
  const classes = useStyles()
  const { _id, applicationId } = props.params
  const {
    register,
    handleSubmit,
    control
  } = useForm()
  const defaultType = TYPES_INTEGRATION.TABLE
  const [currentTypeIntegration, setCurrentTypeIntegration] = React.useState(defaultType)

  useEffect(() => {
    (async () => {
      const result: any = await meteorCall('application.get', { applicationId })

      setApplication(result)
    })()
  }, [refresh])

  const goToIntegration = (integrationsId: string) => {
    props.navigateTo('integration', {
      _id,
      applicationId,
      integrationsId
    })
  }

  const applicationInfo = () => {
    return (
      <>
        <div className={globalClasses.title}>
          <h2>{application.name}</h2>
        </div>
        <Paper className={classes.application}>
          <div className={classes.applicationActions}>
            <Button
              className={classes.button}
              variant='contained'
              color='primary'
            >
              Настройки
            </Button>
            <Button
              className={classes.button}
              variant='contained'
              color='primary'
            >
              Конструктор
            </Button>
            <Button
              className={classes.button}
              variant='contained'
              color='primary'
              onClick={() => {
                handleModalAddIntegation()
              }}
            >
              Добавить интеграцию
            </Button>
          </div>
        </Paper>
      </>
    )
  }

  const handleShowContent = () => {
    setShowContent(!showContent)
  }

  const handleShowIntegrations = () => {
    setShowIntegrations(!showIntegrations)
  }

  const handleModalAddIntegation = () => {
    setOpenAddIntegration(!openAddIntegration)
  }

  const onSubmitAddIntegration = async (data: any) => {
    const fields = state.data.map((field: any) => {
      const { tableData, ...record } = field

      if (tableData) return record
    })
    let config
    const actions = []

    for (const [key, value] of Object.entries(data)) {
      const keysArr = ['add', 'delete', 'update']

      if (keysArr.includes(key)) {
        delete data[key]
        if (value) { actions.push(key) }
      }
    }

    if (data.type === TYPES_INTEGRATION.TABLE) {
      config = {
        table: {
          ...data,
          actions,
          fields
        }
      }
    }

    await meteorCall('integration.create', { applicationId, config })
    setRefresh(!refresh)
  }

  const typesView = () => {
    const types = []

    for (const type in TYPES_INTEGRATION) {
      types.push(<MenuItem key={type} value={type}>{type}</MenuItem>)
    }
    return types
  }

  const typeTable = () => {
    return (
      <MaterialTable
        title=''
        columns={state.columns}
        data={state.data}
        editable={{
          onRowAdd: async (newData) => {
            setState((prevState) => {
              const data = [...prevState.data]

              data.push(newData)

              return { ...prevState, data }
            })
          },
          onRowUpdate: async (newData, oldData) => {
            setState((prevState) => {
              const data = [...prevState.data]

              data[data.indexOf(oldData)] = newData

              return { ...prevState, data }
            })
          },
          onRowDelete: async (oldData) => {
            setState((prevState) => {
              const data = [...prevState.data]

              data.splice(data.indexOf(oldData), 1)

              return { ...prevState, data }
            })
          }
        }}
      />
    )
  }
  const { integrations } = application
  const integrationList = integrations
    ? integrations.map((item: any, index: any) => (
      <Grid key={index} item xs={12} md={6} lg={4}>
        <Paper onClick={() => goToIntegration(item._id)} className={classes.integrationCard}>
          <CodeIcon className={classes.integrationIcon} />
          <div>
            <p>{item.title}</p>
            <h2>{item.name}</h2>
          </div>
        </Paper>
      </Grid>
    )) : null

  return (
    <Container maxWidth='lg'>
      <BreadCrumbs />
      {applicationInfo()}
      <div className={classes.content}>
        <div className={globalClasses.title}>
          <div className={globalClasses.subTitle}>
            <h2>Контент приложения</h2>
          </div>
          <Button
            onClick={handleShowContent}
            variant='contained'
            color='secondary'
          >
            {showContent ? 'Скрыть' : 'Показать'}
          </Button>
        </div>
        <div>
          {showContent ? (
            <Portal container={container.current}>
              <ContentApplication {...props} />
            </Portal>
          ) : null}
        </div>
        <div ref={container} />
        <div className={globalClasses.title}>
          <div className={globalClasses.subTitle}>
            <h2>Интеграции</h2>
          </div>
          <Button
            onClick={handleShowIntegrations}
            variant='contained'
            color='secondary'
          >
            {showIntegrations ? 'Скрыть' : 'Показать'}
          </Button>
        </div>
        <Grid container spacing={3}>
          {showIntegrations && integrationList}
        </Grid>
      </div>
      <Dialog
        open={openAddIntegration}
        onClose={handleModalAddIntegation}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Добавить интеграцию</DialogTitle>
        <form noValidate onSubmit={handleSubmit(onSubmitAddIntegration)}>
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
            />
            <TextField
              margin='dense'
              name='name'
              label='Имя (для общения с сервером)'
              fullWidth
              inputRef={register}
            />
            <TextField
              margin='dense'
              name='endpoint'
              label='endpoint'
              fullWidth
              inputRef={register}
            />
            <FormLabel component='legend'>Возможные действия</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox name='add' />}
                label='add'
                inputRef={register}
              />
              <FormControlLabel
                control={<Checkbox name='delete' />}
                label='delete'
                inputRef={register}
              />
              <FormControlLabel
                control={<Checkbox name='update' />}
                label='update'
                inputRef={register}
              />
            </FormGroup>
            <FormControl>
              <InputLabel>Типы</InputLabel>
              <Controller
                as={<Select label='Типы'>{typesView()}</Select>}
                name='type'
                defaultValue={defaultType}
                control={control}
                onChange={([event, selected]) => {
                  setCurrentTypeIntegration(event.target.value)
                  return selected.key
                }}
              />
            </FormControl>
            {currentTypeIntegration === 'TABLE' ? typeTable() : (currentTypeIntegration === 'FORM' ? <p>form</p> : <p>chart</p>)}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModalAddIntegation} color='primary'>
              Отменить
            </Button>
            <Button
              type='submit'
              onClick={handleModalAddIntegation}
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

export default connector(Application)
