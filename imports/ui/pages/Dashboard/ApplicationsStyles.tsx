import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  table: {
    minWidth: 650
  },
  tableCell: {
    fontWeight: 700
  },
  status: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  statusText: {
    marginLeft: 10
  }
})

export default useStyles
