import React, { useEffect, useState } from 'react'
import { Meteor } from 'meteor/meteor'
import MaterialTable from 'material-table'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText
} from '@material-ui/core'
import DeveloperModeIcon from '@material-ui/icons/DeveloperMode'
import { connect, ConnectedProps } from 'react-redux'
import { JsonEditorDialog } from '../../components'
import meteorCall from '../../../utils/meteorCall'
import { ROLES_PROJECT } from '../../../constants'
import { openAlert } from '../../../store/actions'
import { TableState, contentValues } from './types'

const mapStateToProps = (state: any) => ({
  params: state.router.route.params

})
const mapDispatchToProps = (dispatch: any) => ({
  openAlert: (body: any) => {
    dispatch(openAlert(body))
  }
})
const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

const ContentProject = (props: PropsFromRedux) => {
  const [defaultLanguage, setDefaultLanguage] = useState({ id: 0, name: '' })
  const [receivedLanguages, setReceivedLanguages] = useState([{ id: 0, name: '' }])
  const [languages, setLanguages] = useState(receivedLanguages)
  const [editorMetaTable, setEditorMetaTable] = useState({
    key: '',
    meta: {},
    isOpen: false
  })

  const [state, setState] = useState<TableState>({
    columnsProject: [
      {
        title: 'group',
        field: 'group',
        initialEditValue: 'P',
        editable: 'never'
      },
      {
        title: 'key',
        field: 'key',
        editable: 'onAdd'
      },
      {
        title: 'meta',
        field: 'meta',
        initialEditValue: 'P',
        editable: 'never',
        render: (rowData: any) => (
          <Button
            onClick={() => { handleEditorTable(true, rowData.key, rowData.meta) }}
            disabled={rowData === 'P'}
          >
            <DeveloperModeIcon />
          </Button>
        )
      }
    ],
    dataProject: []
  })
  const [openProjectModal, setOpenModalProject] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [checkedProject, setCheckedProject] = useState([defaultLanguage.id])
  const [currentUserRoleInProject, setCurrentUserRoleInProject] = useState('')
  const { _id } = props.params

  useEffect(() => {
    setLanguages(receivedLanguages)
  }, [receivedLanguages])

  useEffect(() => {
    (async () => {
      const project: any = await meteorCall('project.getInfo', { projectId: _id })
      const сurrentUserRoleInProject = project.members.filter((m: any) => m.user === Meteor.userId())[0].role
      const languages = project.languages.map((item: any, index: number) => ({ id: index, name: item }))
      const projectContent: any = await meteorCall('project.getContentKey', { projectId: _id })
      const temp = projectContent.map((item: contentValues) => {
        const lang = Object.entries(item.value).reduce((r, [k, v]) => ({ ...r, [k]: v }), {})
        return {
          group: 'P',
          key: item.key,
          meta: item.meta,
          ...lang
        }
      })

      setCurrentUserRoleInProject(сurrentUserRoleInProject)
      setDefaultLanguage({ id: 0, name: project.default_language })
      setReceivedLanguages(languages)

      const defaultLanguageState: any = []

      if (!state.columnsProject.find((column: any) => column.title === project.default_language)) {
        defaultLanguageState.push({
          title: project.default_language,
          field: project.default_language
        })
      }
      setState((prevState) => ({
        columnsProject: [
          ...prevState.columnsProject,
          ...defaultLanguageState
        ],
        dataProject: temp
      }))
    })()
  }, [refresh])

  const handleModalProject = () => {
    setOpenModalProject(!openProjectModal)
  }

  const handleToggleProject = (value: number) => () => {
    if (value === defaultLanguage.id) return 0
    const currentIndex = checkedProject.indexOf(value)
    const newChecked = [...checkedProject]

    if (currentIndex === -1) {
      newChecked.push(value)
      setState(prevState => {
        const columnsProject = [...prevState.columnsProject]
        const languageName = languages.filter(l => l.id === value)[0].name
        const newColumnLanguage = {
          title: languageName,
          field: languageName
        }
        columnsProject.push(newColumnLanguage)
        return { ...prevState, columnsProject }
      })
    } else {
      newChecked.splice(currentIndex, 1)
      setState(prevState => {
        const columnsProject = [...prevState.columnsProject]
        const desiredLanguageObject = receivedLanguages.filter(receivedLanguage => receivedLanguage.id === value)[0]
        const disiredLanguageIndex = columnsProject.filter(c => c.title === desiredLanguageObject.name)[0]

        columnsProject.splice(columnsProject.indexOf(disiredLanguageIndex), 1)

        return { ...prevState, columnsProject }
      })
    }

    setCheckedProject(newChecked)
  }

  const CheckboxListProject = () => {
    return (
      <List>
        {languages.map((value) => {
          const labelId = `checkbox-list-label-${value.name}`
          return (
            <ListItem
              key={value.name}
              dense
              button
              onClick={handleToggleProject(value.id)}
            >
              <ListItemIcon>
                <Checkbox
                  disabled={defaultLanguage.id === value.id}
                  edge='start'
                  checked={checkedProject.indexOf(value.id) !== -1}
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value.name} />
            </ListItem>
          )
        })}
      </List>
    )
  }

  const handleEditorTable = (
    isOpen: boolean,
    key = '',
    meta = {}
  ) => {
    setEditorMetaTable({
      isOpen,
      key,
      meta
    })
  }

  const handleSubmitJsonTable = async (newJsonData: any) => {
    await meteorCall('project.setMetaData', {
      projectId: _id,
      key: editorMetaTable.key,
      meta: newJsonData
    })

    const applicationContent: any = await meteorCall('project.getContentKey', { projectId: _id })
    const temp = applicationContent.map((item: contentValues) => {
      const lang = Object.entries(item.value).reduce((r, [k, v]) => ({ ...r, [k]: v }), {})
      return {
        group: 'P',
        key: item.key,
        meta: item.meta,
        ...lang
      }
    })

    await setState(prevState => ({
      columnsProject: prevState.columnsProject,
      dataProject: temp
    }))

    handleEditorTable(false)
  }

  return (
    <>
      <MaterialTable
        title='Content'
        columns={state.columnsProject}
        data={state.dataProject}
        actions={[
          {
            icon: 'translate',
            tooltip: 'Display languages',
            isFreeAction: true,
            onClick: () => handleModalProject()
          }
        ]}
        editable={{
          isEditable: () => currentUserRoleInProject === ROLES_PROJECT.OWNER || currentUserRoleInProject === ROLES_PROJECT.EDITOR,
          isDeletable: () => currentUserRoleInProject === ROLES_PROJECT.OWNER,
          onRowAdd: async (newData: any) => {
            try {
              await meteorCall('project.addContentKey', {
                projectId: _id,
                key: newData.key,
                meta: { type: 'String' },
                value: newData[defaultLanguage.name]
              })
            } catch ({ error }) {
              props.openAlert({ message: error, severity: 'error' })
            } finally {
              setRefresh(!refresh)
            }
          },
          onRowUpdate: async (newData: any, oldData: any) => {
            if (oldData) {
              const tempValues = Object.entries(newData).reduce((r, [k, v]) => {
                if (k !== 'key') {
                  return { ...r, [k]: v }
                }
                return r
              }, {})

              meteorCall('project.setContentKey', {
                projectId: _id,
                key: newData.key,
                values: tempValues
              })
            }
            setRefresh(!refresh)
          },
          onRowDelete: async (oldData: any) => {
            await meteorCall('project.delContentKey', {
              projectId: _id,
              key: oldData.key
            })
            setRefresh(!refresh)
          }
        }}
      />
      <Dialog
        open={openProjectModal}
        onClose={handleModalProject}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Отобразить языки</DialogTitle>
        <DialogContent>
          {CheckboxListProject()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalProject} color='primary'>
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
      <JsonEditorDialog
        jsonData={editorMetaTable.meta}
        isOpen={editorMetaTable.isOpen}
        onSubmit={handleSubmitJsonTable}
        onClose={() => { handleEditorTable(false) }}
      />
    </>
  )
}

export default connector(ContentProject)
