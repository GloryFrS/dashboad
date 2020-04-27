import React from 'react'
import clsx from 'clsx'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Applications from './Applications'
import Billing from './Billing'
import Statistics from './Statistics'
import Hint from './Hint'
import Notifications from './Notifications'
import Title from './Title'
import useStyles from './styles'

export default function Dashboard () {
  const classes = useStyles()
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)
  const autoHeightPaper = clsx(classes.paper, classes.autoHeight)

  return (
    <div className={classes.root}>
      <CssBaseline />
      <main className={classes.content}>
        <Container maxWidth='lg' className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={10} md={6} lg={6}>
              <Paper className={fixedHeightPaper}>
                <Statistics />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Title>Notifications</Title>
                <Notifications />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={autoHeightPaper}>
                <Hint />
              </Paper>
            </Grid>
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={classes.paper}>
                <Applications />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Billing />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  )
}
