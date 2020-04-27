import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
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
  projects: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
    position: 'relative',
    background: '#cbc548'
  },
  applicationButtons: {
    display: 'flex',
    position: 'absolute',
    bottom: '-20px',
    justifyContent: 'flex-end',
    width: '88%',
    '& button': {
      marginLeft: '15px'
    }
  },
  projectInfo: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'right',
    paddingLeft: '60px',
    justifyContent: 'flex-start'
  },
  projectIcon: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    width: '60px',
    height: '60px'
  },
  members: {
    color: '#fff'
  }
})

export default useStyles
