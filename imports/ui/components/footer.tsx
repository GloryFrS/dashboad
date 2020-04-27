import React from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles(theme => ({
  footer: {
    padding: theme.spacing(1),
    backgroundColor: 'white',
    width: '100%'

  },
  footerContainer: {
    maxWidth: '200px'
  }
}))

export default function Footer () {
  const classes = useStyles()

  return (
    <div className={classes.footer}>
      <Grid
        container
        spacing={3}
        direction='row'
        alignItems='center'
        justify='center'
      >
        <Grid item xs={3}>
          <Typography variant='body2' color='textSecondary'>
            Главная
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            Профиль
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            Мои проекты
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            Добавить проект
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant='body2' color='textSecondary'>
            Прайс
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            Тарифы
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            Условия конфиденциальности
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            О нас
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant='body2' color='textSecondary'>
            Noname Team
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            Индивидуальное сотрудничество
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            Обратная связь
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            Реклама
          </Typography>
        </Grid>
      </Grid>
    </div>
  )
}
