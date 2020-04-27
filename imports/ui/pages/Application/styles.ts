import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  root: {
    width: '100%'
  },
  integrationCard: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
    position: 'relative',
    background: '#48cbbd'
  },
  integrationIcon: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    width: '60px',
    height: '60px'
  },
  application: {
    maxWidth: 820,
    padding: 50,
    margin: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    background: '#cbc548'
  },
  applicationActions: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center'
  },
  button: {
    margin: 5
  },
  content: {
    margin: 'auto'
  }
})

export default useStyles
