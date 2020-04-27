import React, { useEffect } from 'react'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import {
  Dialog,
  DialogTitle,
  TextField,
  DialogContentText,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Grid
} from '@material-ui/core'
import AccountTreeOutlinedIcon from '@material-ui/icons/AccountTreeOutlined'
import { useForm, Controller } from 'react-hook-form'
import { connect, ConnectedProps } from 'react-redux'
import { NavigationOptions } from 'router5'
import { actions } from 'redux-router5'
import { LANGUAGES } from '../../../constants'
import meteorCall from '../../../utils/meteorCall'
import { NewProject, Project } from './types'
import globalStyles from '../../layouts/styles'
import useStyles from './styles'

const mapDispatchToProps = (dispatch: any) => ({
  navigateTo: (
    name: string,
    params?: { [key: string]: any },
    opts: NavigationOptions = {}
  ) => {
    dispatch(actions.navigateTo(name, params, opts))
  }
})
const connector = connect(null, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

const MyProjects = (props: PropsFromRedux) => {
  const classes = useStyles()
  const globalClasses = globalStyles()
  const [open, setOpen] = React.useState(false)
  const [projects, setProjects] = React.useState([])
  const {
    register,
    handleSubmit,
    control
  } = useForm()
  const [refresh, setRefresh] = React.useState(false)
  const defaultLanguage = LANGUAGES.find((l: any) => l.default)

  const newProject = async (data: NewProject) => {
    await meteorCall('project.create', data)
    setRefresh(!refresh)
  }

  const onSubmitNewProject = (data: any) => {
    newProject(data)
  }

  useEffect(() => {
    (async () => {
      const res: any = await meteorCall('project.get')

      setProjects(res)
    })()
  }, [refresh])

  const handleModal = () => {
    setOpen(!open)
  }

  const goProject = (_id: string) => {
    props.navigateTo('project', { _id })
  }

  const pojectView = projects.map((data: Project, index: number) => {
    return (
      <Grid key={index} item xs={12} md={6} lg={6}>
        <Paper className={classes.projects}>
          <AccountTreeOutlinedIcon className={classes.projectIcon} />
          <div className={classes.projectInfo}>
            <p>{data.description}</p>
            <h2>{data.name}</h2>
            <p>status</p>
          </div>
          <div className={classes.projectButtons}>
            <Button onClick={() => { goProject(data._id) }} variant='contained' color='secondary'>
              Apps
            </Button>
          </div>
        </Paper>
      </Grid>
    )
  })

  const languagesView = () => {
    return LANGUAGES.map((l: any, i: any) => {
      return <MenuItem key={i} value={l.short}>{l.name}</MenuItem>
    })
  }

  return (
    <Container maxWidth='lg'>
      <div className={globalClasses.title}>
        <h2>My Projects</h2>
        <Button variant='contained' color='primary' onClick={handleModal}>
          New
        </Button>
      </div>
      <Dialog
        open={open}
        onClose={handleModal}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>New project</DialogTitle>
        <form noValidate onSubmit={handleSubmit(onSubmitNewProject)}>
          <DialogContent>
            <DialogContentText>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, ab?
            </DialogContentText>
            <TextField
              margin='dense'
              name='title'
              label='Title'
              fullWidth
              inputRef={register}
            />
            <TextField
              margin='dense'
              name='description'
              label='Description'
              fullWidth
              inputRef={register}
            />
            <FormControl className={classes.formControl}>
              <InputLabel>Default language</InputLabel>
              <Controller
                as={
                  <Select
                    name='lang'
                    label='lang'
                  >
                    {languagesView()}
                  </Select>
                }
                name='lang'
                defaultValue={defaultLanguage && defaultLanguage.short}
                control={control}
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModal} color='primary'>
              Cancel
            </Button>
            <Button
              type='submit'
              onClick={handleModal}
              color='primary'
            >
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Grid container spacing={3}>
        {pojectView}
      </Grid>
    </Container>
  )
}

export default connector(MyProjects)
