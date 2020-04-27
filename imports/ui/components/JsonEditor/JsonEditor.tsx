import React, { useState, useEffect } from 'react'
import JSONInput from 'react-json-editor-ajrm'
import locale from 'react-json-editor-ajrm/locale/en'

export default (props: any) => {
  const { jsonData, onSubmit } = props
  const [localJsonData, setJsonData] = useState(jsonData)
  const handleChange = (arg: any) => {
    if (!arg.error) {
      setJsonData(arg.jsObject)
      onSubmit(localJsonData)
    }
  }

  useEffect(() => {
    setJsonData(jsonData)
  }, [jsonData])

  return (
    <JSONInput
      id='json_editer'
      placeholder={localJsonData}
      locale={locale}
      height='250px'
      onChange={handleChange}
    />
  )
}
