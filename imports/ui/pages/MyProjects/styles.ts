import {
  createStyles,
  Theme,
  makeStyles
} from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    projectInfoTitle: {
      margin: '0'
    },
    description: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center'
    },
    nameAndStatus: {
      width: 200,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    },
    projectInfo: {
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'right',
      paddingLeft: '60px',
      justifyContent: 'flex-start'
    },
    projects: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: 10,
      marginBottom: 20,
      position: 'relative',
      background: '#cbc548'
    },
    projectActions: {
      display: 'flex'
    },
    formControl: {
      margin: theme.spacing(0),
      minWidth: 140
    },
    projectButtons: {
      display: 'flex',
      position: 'absolute',
      bottom: '-20px',
      justifyContent: 'flex-end',
      width: '88%',
      '& button': {
        marginLeft: '15px'
      }
    },
    projectIcon: {
      position: 'absolute',
      top: '10px',
      left: '10px',
      width: '60px',
      height: '60px'
    }
  })
)

export default useStyles
