import React from 'react'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import Title from './Title'
import billingStyles from './BillingStyles'

function preventDefault (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
  event.preventDefault()
}

export default function Billing () {
  const classes = billingStyles()
  return (
    <>
      <Title>Billing</Title>
      <Typography component='p' variant='h4'>
        $124.00
      </Typography>
      <Typography color='textSecondary' className={classes.depositContext}>
        on 16 March, 2020
      </Typography>
      <div>
        <Link color='primary' href='#' onClick={preventDefault}>
          More Details
        </Link>
      </div>
    </>
  )
}
