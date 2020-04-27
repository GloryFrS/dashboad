import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@material-ui/core'
import JSONInput from 'react-json-editor-ajrm'
import locale from 'react-json-editor-ajrm/locale/en'

export default (props: any) => {
  const {
    jsonData,
    isOpen,
    onSubmit,
    onClose
  } = props
  const [localJsonData, setJsonData] = useState(jsonData)
  const [changedJsonData, setChangedJsonData] = useState(true)
  const handleChange = (arg: any) => {
    if (!arg.error) {
      setJsonData(arg.jsObject)
      setChangedJsonData(true)
    } else {
      setChangedJsonData(false)
    }
  }

  useEffect(() => {
    setJsonData(jsonData)
  }, [jsonData])

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby='form-dialog-title'
    >
      <DialogTitle id='form-dialog-title'>Редактор</DialogTitle>
      <DialogContent>
        <JSONInput
          id='json_editer'
          placeholder={localJsonData}
          locale={locale}
          height='550px'
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        {changedJsonData && <Button onClick={() => onSubmit(localJsonData)} color='primary'>ok</Button>}
        <Button onClick={onClose} color='primary'>
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  )
}
