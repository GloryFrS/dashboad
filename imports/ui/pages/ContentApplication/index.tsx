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
import { connect, ConnectedProps } from 'react-redux'
import DeveloperModeIcon from '@material-ui/icons/DeveloperMode'
import meteorCall from '../../../utils/meteorCall'
import { JsonEditorDialog } from '../../components'
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

const ContentApplication = (props: PropsFromRedux) => {
  const [defaultLanguage, setDefaultLanguage] = useState({ id: 0, name: '' })
  const [receivedLanguages, setReceivedLanguages] = useState([{ id: 0, name: '' }])
  const [refresh, setRefresh] = useState(false)
  const [editorMetaTable, setEditorMetaTable] = useState({
    key: '',
    meta: {},
    isOpen: false
  })
  const [languages, setLanguages] = useState(receivedLanguages)
  const [state, setState] = useState<TableState>({
    columnsApplication: [
      {
        title: 'group',
        field: 'group',
        initialEditValue: 'A',
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
        initialEditValue: 'A',
        editable: 'never',
        render: (rowData: any) => (
          <Button
            onClick={() => { handleEditorTable(true, rowData.key, rowData.meta) }}
            disabled={rowData.group === 'P' || rowData === 'A'}
          >
            <DeveloperModeIcon />
          </Button>
        )
      }
    ],
    dataApplication: [],
    dataProject: []
  })
  const [openApplicationModal, setOpenApplicationModal] = useState(false)
  const [openJsonModal, setOpenJsonModal] = useState(false)
  const [jsonData, setJsonData] = useState([])
  const [checkedApplication, setCheckedApplication] = useState([defaultLanguage.id])
  const [currentUserRoleInProject, setCurrentUserRoleInProject] = useState('')
  const { _id, applicationId } = props.params

  useEffect(() => {
    setLanguages(receivedLanguages)
  }, [receivedLanguages])

  useEffect(() => {
    (async () => {
      const project: any = await meteorCall('project.getInfo', { projectId: _id })
      const сurrentUserRoleInProject = project.members.filter((m: any) => m.user === Meteor.userId())[0].role
      const languages = project.languages.map((item: any, index: number) => ({ id: index, name: item }))
      const applicationContent: any = await meteorCall('application.getContentKey', { applicationId: applicationId })
      const projectContent: any = await meteorCall('project.getContentKey', { projectId: _id })
      const tempApplication = applicationContent.map((item: contentValues) => {
        const lang = Object.entries(item.value).reduce((r, [k, v]) => ({ ...r, [k]: v }), {})
        return {
          group: 'A',
          key: item.key,
          meta: item.meta,
          ...lang
        }
      })
      const tempProject = projectContent.map((item: contentValues) => {
        const lang = Object.entries(item.value).reduce((r, [k, v]) => ({ ...r, [k]: v }), {})
        return {
          group: 'P',
          key: item.key,
          ...lang
        }
      })

      setCurrentUserRoleInProject(сurrentUserRoleInProject)
      setDefaultLanguage({ id: 0, name: project.default_language })
      setReceivedLanguages(languages)

      const defaultLanguageState: any = []

      if (!state.columnsApplication.find((column: any) => column.title === project.default_language)) {
        defaultLanguageState.push({
          title: project.default_language,
          field: project.default_language
        })
      }

      setState(prevState => ({
        columnsApplication: [
          ...prevState.columnsApplication,
          ...defaultLanguageState
        ],
        dataProject: tempProject,
        dataApplication: tempApplication
      }))
      setJsonData(applicationContent)
    })()
  }, [refresh])

  const handleModalApplication = () => {
    setOpenApplicationModal(!openApplicationModal)
  }

  const handleModalJsonEditer = () => {
    setOpenJsonModal(!openJsonModal)
  }

  const handleSubmitJson = async (newJsonData: any) => {
    await meteorCall('application.updateAllContent', { applicationId, jsonData: newJsonData })

    const applicationContent: any = await meteorCall('application.getContentKey', { applicationId })
    const temp = applicationContent.map((item: contentValues) => {
      const lang = Object.entries(item.value).reduce((r, [k, v]) => ({ ...r, [k]: v }), {})
      return {
        group: 'A',
        key: item.key,
        meta: item.meta,
        ...lang
      }
    })

    await setState(prevState => ({
      columnsApplication: prevState.columnsApplication,
      dataProject: prevState.dataProject,
      dataApplication: temp
    }))
    await handleModalJsonEditer()
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
    await meteorCall('application.setMetaData', {
      applicationId: applicationId,
      key: editorMetaTable.key,
      meta: newJsonData
    })

    const applicationContent: any = await meteorCall('application.getContentKey', { applicationId })
    const temp = applicationContent.map((item: contentValues) => {
      const lang = Object.entries(item.value).reduce((r, [k, v]) => ({ ...r, [k]: v }), {})
      return {
        group: 'A',
        key: item.key,
        meta: item.meta,
        ...lang
      }
    })

    await setState(prevState => ({
      columnsApplication: prevState.columnsApplication,
      dataProject: prevState.dataProject,
      dataApplication: temp
    }))

    handleEditorTable(false)
  }

  const handleToggleApplication = (value: number) => () => {
    if (value === defaultLanguage.id) return 0

    const currentIndex = checkedApplication.indexOf(value)
    const newChecked = [...checkedApplication]

    if (currentIndex === -1) {
      newChecked.push(value)
      setState(prevState => {
        const columnsApplication = [...prevState.columnsApplication]
        const languageName = languages.filter(l => l.id === value)[0].name
        const newColumnLanguage = {
          title: languageName,
          field: languageName
        }
        columnsApplication.push(newColumnLanguage)

        return { ...prevState, columnsApplication }
      })
    } else {
      newChecked.splice(currentIndex, 1)
      setState(prevState => {
        const columnsApplication = [...prevState.columnsApplication]
        const desiredLanguageObject = receivedLanguages.filter(receivedLanguage => receivedLanguage.id === value)[0]
        const disiredLanguageIndex = columnsApplication.filter(c => c.title === desiredLanguageObject.name)[0]

        columnsApplication.splice(columnsApplication.indexOf(disiredLanguageIndex), 1)

        return { ...prevState, columnsApplication }
      })
    }

    setCheckedApplication(newChecked)
  }

  const CheckboxListApplication = () => {
    return (
      <List>
        {languages.map((value) => {
          const labelId = `checkbox-list-label-${value.name}`
          return (
            <ListItem
              key={value.name}
              dense
              button
              onClick={handleToggleApplication(value.id)}
            >
              <ListItemIcon>
                <Checkbox
                  disabled={defaultLanguage.id === value.id}
                  edge='start'
                  checked={checkedApplication.indexOf(value.id) !== -1}
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

  return (
    <>
      <MaterialTable
        title='Content'
        columns={[...state.columnsApplication]}
        data={[...state.dataProject, ...state.dataApplication]}
        actions={[
          {
            icon: 'translate',
            tooltip: 'Display languages',
            isFreeAction: true,
            onClick: () => handleModalApplication()
          },
          {
            icon: () => <DeveloperModeIcon />,
            tooltip: 'Edit json',
            isFreeAction: true,
            onClick: () => handleModalJsonEditer()
          }
        ]}
        editable={{
          isEditable: () => currentUserRoleInProject === ROLES_PROJECT.OWNER || currentUserRoleInProject === ROLES_PROJECT.EDITOR,
          isDeletable: (rowData: any) => (rowData.group !== 'P' && currentUserRoleInProject === ROLES_PROJECT.OWNER),
          onRowAdd: async (newData: any) => {
            try {
              await meteorCall('application.addContentKey', {
                applicationId: applicationId,
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
              if (oldData.group === 'P') {
                await meteorCall('application.addContentKey', {
                  applicationId: applicationId,
                  projectId: _id,
                  key: newData.key,
                  meta: { type: 'String' },
                  value: newData[defaultLanguage.name]
                })
              } else {
                await meteorCall('application.setContentKey', {
                  applicationId: applicationId,
                  key: oldData.key,
                  values: tempValues
                })
              }
            }
            setRefresh(!refresh)
          },
          onRowDelete: async (oldData: any) => {
            await meteorCall('application.delContentKey', {
              applicationId: applicationId,
              key: oldData.key
            })
            setRefresh(!refresh)
          }
        }}
      />
      <Dialog
        open={openApplicationModal}
        onClose={handleModalApplication}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Отобразить языки</DialogTitle>
        <DialogContent>
          {CheckboxListApplication()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalApplication} color='primary'>
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
      <JsonEditorDialog
        jsonData={jsonData}
        isOpen={openJsonModal}
        onSubmit={handleSubmitJson}
        onClose={handleModalJsonEditer}
      />
      <JsonEditorDialog
        jsonData={editorMetaTable.meta}
        isOpen={editorMetaTable.isOpen}
        onSubmit={handleSubmitJsonTable}
        onClose={() => { handleEditorTable(false) }}
      />
    </>
  )
}

export default connector(ContentApplication)
