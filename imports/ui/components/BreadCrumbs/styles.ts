import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  root: {
    margin: 0,
    padding: '15px',
    display: 'flex',
    justifyContent: 'flex-start',
    background: '#202020',
    color: '#fff',
    borderRadius: '3px',
    border: '1px solid #3f3f3f',
    '& a': {
      color: '#fff',
      margin: '0',
      fontWeight: 600
    }
  }
})

export default useStyles
