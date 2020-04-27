import {
  makeStyles,
  createStyles
} from '@material-ui/core/styles'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360
    }
  })
)

export default useStyles
