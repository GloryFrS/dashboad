import React, { useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  TextField,
  DialogContentText,
  DialogContent,
  DialogActions,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Portal,
  Button,
  FormControl,
  Container,
  Grid
} from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'
import { connect, ConnectedProps } from 'react-redux'
import { NavigationOptions } from 'router5'
import { actions } from 'redux-router5'
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone'
import { Meteor } from 'meteor/meteor'
import ContentProject from '../ContentProject'
import meteorCall from '../../../utils/meteorCall'
import { BreadCrumbs } from '../../components'
import { ROLES_PROJECT } from '../../../constants'
import { Application, NewApplication } from './types'
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

const Applications = (props: PropsFromRedux) => {
  const classes = useStyles()
  const globalClasses = globalStyles()
  const [open, setOpen] = React.useState(false)
  const [parentTitle, setParentTitle] = React.useState(false)
  const [applications, setApplications] = React.useState([])
  const [users, setUsers] = React.useState([])
  const [refresh, setRefresh] = React.useState(false)
  const [currentUserRoleInProject, setCurrentUserRoleInProject] = React.useState('')
  const [openAddMember, setOpenAddMember] = React.useState(false)
  const [showListOfPartisipants, setShowListOfPartisipants] = React.useState(false)
  const [showContent, setShowContent] = React.useState(false)
  const contentContainer = React.useRef(null)
  const partisipantsContainer = React.useRef(null)
  const {
    register,
    handleSubmit,
    control
  } = useForm()
  const { _id } = props.params

  const defaultRole = ROLES_PROJECT.REPORTER

  useEffect(() => {
    (async () => {
      const project: any = await meteorCall('project.getInfo', { projectId: _id })
      const сurrentUserRoleInProject = project.members.filter((m: any) => m.user === Meteor.userId())[0].role
      const members = project.members
      const users: any = await meteorCall('users.getInfo', { members })
      const projectApp: any = await meteorCall('project.getApp', { projectId: _id })
      const apps: any = await meteorCall('applications.get', { arrIds: projectApp.applications })

      setParentTitle(project.name)
      setApplications(apps)
      setUsers(users)
      setCurrentUserRoleInProject(сurrentUserRoleInProject)
    })()
  }, [refresh])

  const handleModal = () => {
    setOpen(!open)
  }

  const goApplication = (applicationId: string) => {
    props.navigateTo('application', { _id, applicationId })
  }

  const newApplication = async (data: NewApplication) => {
    await meteorCall('application.create', { ...data, projectId: _id })
    setRefresh(!refresh)
  }

  const deleteApplication = async (data: any) => {
    await meteorCall('application.delete', { applicationId: data.applicationId, projectId: _id })
    setRefresh(!refresh)
  }

  const onSubmit = (data: any) => {
    newApplication(data)
  }

  const DeleteApplicationButton = (data: any) => {
    return (
      <Button
        variant='contained'
        color='secondary'
        onClick={() => {
          deleteApplication({ applicationId: data._id })
        }}
      >
        Удалить
      </Button>
    )
  }

  const applicationsView = applications.map((data: Application, index: number) => {
    return (
      <Grid key={index} item xs={12} md={6} lg={6}>
        <Paper key={index} className={classes.projects}>
          <PhoneIphoneIcon className={classes.projectIcon} />
          <div className={classes.projectInfo}>
            <p>{data.description}</p>
            <h2>{data.name}</h2>
            <p>статус</p>
          </div>
          <div className={classes.applicationButtons}>
            <Button
              variant='contained'
              color='primary'
              onClick={() => goApplication(data._id)}
            >
              Подробнее
            </Button>
            {currentUserRoleInProject === ROLES_PROJECT.OWNER
              ? DeleteApplicationButton(data) : null}
          </div>
        </Paper>
      </Grid>
    )
  })

  const usersView = users.map((user: any, index: any) => {
    return (
      <div className={classes.members} key={index}>
        <p>{user.email.address} ({user.username}), {user.role}</p>
      </div>
    )
  })

  const NewApplicationButton = () => {
    return (
      <Button
        variant='contained'
        color='primary'
        onClick={handleModal}
      >
        Создать
      </Button>
    )
  }

  const handleShowListOfPartisipants = () => {
    setShowListOfPartisipants(!showListOfPartisipants)
  }

  const handleShowContent = () => {
    setShowContent(!showContent)
  }

  const onSubmitAddMember = (data: any) => {
    meteorCall('project.addMember', {
      projectId: _id,
      emailMember: data.email,
      role: data.role
    })
  }

  const handleModalAddMember = () => {
    setOpenAddMember(!openAddMember)
  }

  const rolesView = () => {
    const roles = []
    for (const role in ROLES_PROJECT) {
      roles.push(<MenuItem key={role} value={role}>{role}</MenuItem>)
    }
    return roles
  }

  return (
    <Container maxWidth='lg'>
      <BreadCrumbs />
      <div className={globalClasses.title}>
        <h2>{parentTitle} / applications</h2>
        {currentUserRoleInProject === ROLES_PROJECT.OWNER
          ? NewApplicationButton() : null}
      </div>
      <div className={globalClasses.title}>
        <Button
          type='button'
          onClick={handleShowListOfPartisipants}
          variant='contained'
          color='primary'
        >
          {showListOfPartisipants ? 'Убрать список участников' : 'Показать список участников'}
        </Button>
        <Button
          onClick={() => {
            handleModalAddMember()
          }}
          variant='contained'
          color='secondary'
        >
          Добавить пользователя
        </Button>
      </div>
      <div>
        {showListOfPartisipants ? (
          <Portal container={partisipantsContainer.current}>
            {usersView}
          </Portal>
        ) : null}
      </div>
      <div ref={partisipantsContainer} />
      <Dialog
        open={open}
        onClose={handleModal}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Новое приложение</DialogTitle>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <DialogContentText>
              Для того, чтобы создать приложение выберите тип, укажите название и описание.
            </DialogContentText>
            <InputLabel id='demo-simple-select-label'>Тип</InputLabel>
            <Controller
              as={
                <Select
                  labelId='demo-simple-select-label'
                  name='type'
                >
                  <MenuItem value='VMA'>VK Mini App</MenuItem>
                </Select>
              }
              name='type'
              rules={{ required: 'this is required' }}
              control={control}
              defaultValue='VMA'
            />

            <TextField
              margin='dense'
              name='title'
              label='Название'
              fullWidth
              inputRef={register}
            />
            <TextField
              margin='dense'
              name='description'
              label='Описание'
              fullWidth
              inputRef={register}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModal} color='primary'>
              Отменить
            </Button>
            <Button
              type='submit'
              onClick={handleModal}
              color='primary'
            >
              Создать
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Grid container spacing={3}>
        {applicationsView}
        <Dialog
          open={openAddMember}
          onClose={handleModalAddMember}
          aria-labelledby='form-dialog-title'
        >
          <DialogTitle id='form-dialog-title'>Добавить участника к проекту</DialogTitle>
          <form noValidate onSubmit={handleSubmit(onSubmitAddMember)}>
            <DialogContent>
              <DialogContentText>
                Введите email пользователя, которого хотите добавить
              </DialogContentText>
              <TextField
                margin='dense'
                name='email'
                label='Почта'
                fullWidth
                inputRef={register}
              />
              <FormControl>
                <InputLabel>Роли</InputLabel>
                <Controller
                  as={
                    <Select
                      name='roles'
                      label='Роли'
                    >
                      {rolesView()}
                    </Select>
                  }
                  name='role'
                  defaultValue={defaultRole}
                  control={control}
                />
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleModalAddMember} color='primary'>
                Отменить
              </Button>
              <Button
                type='submit'
                onClick={handleModalAddMember}
                color='primary'
              >
                Добавить
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Grid>
      <div className={globalClasses.title}>
        <div className={globalClasses.subTitle}>
          <h2>Контент проекта</h2>
        </div>
        <Button
          onClick={handleShowContent}
          variant='contained'
          color='secondary'
        >
          {showContent ? 'Убрать контент' : 'Показать контент'}
        </Button>
      </div>
      <div>
        {showContent ? (
          <Portal container={contentContainer.current}>
            <ContentProject />
          </Portal>
        ) : null}
      </div>
      <div ref={contentContainer} />
    </Container>
  )
}

export default connector(Applications)
