import {
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    '@global': {
      body: {
        background: '#2f2f2f',
        padding: theme.spacing(0),
        margin: theme.spacing(0),
        fontFamily: ['PT Sans']
      }
    },
    title: {
      margin: '25px 0',
      padding: '15px',
      display: 'flex',
      justifyContent: 'space-between',
      background: '#202020',
      color: '#fff',
      borderRadius: '3px',
      border: '1px solid #3f3f3f',
      '& h2': {
        margin: '0'
      }
    },
    subTitle: {
      color: '#f50057'
    },
    loading: {
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  })
)

export default useStyles
