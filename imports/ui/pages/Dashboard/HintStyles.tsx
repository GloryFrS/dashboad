import {
  makeStyles,
  Theme,
  createStyles
} from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 400,
      flexGrow: 1,
      padding: '10px'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      height: 50,
      paddingLeft: theme.spacing(4)
    },
    mobileStepper: {
      background: '#bcb63e'
    }
  })
)

export default useStyles
