import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import CancelIcon from '@material-ui/icons/Cancel'
import Title from './Title'
import applicationStyles from './ApplicationsStyles'

function createData (number: number, status: string, name: string, plan: string) {
  return { number, status, name, plan }
}

const rows = [
  createData(1, 'Online', '108 AllWorld Mobile', 'Free'),
  createData(2, 'Offline', '108 AllWorld Landing', 'Free')
]

export default function Applications () {
  const classes = applicationStyles()

  return (
    <TableContainer>
      <Title>Projects</Title>
      <Table className={classes.table} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableCell}>№</TableCell>
            <TableCell className={classes.tableCell}>Status</TableCell>
            <TableCell className={classes.tableCell}>Name</TableCell>
            <TableCell className={classes.tableCell}>Plan</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.name}>
              <TableCell component='th' scope='row'>
                {row.number}
              </TableCell>
              <TableCell>
                {
                  row.status === 'Online'
                    ? <div className={classes.status}> <CheckCircleIcon /> <p className={classes.statusText}>Online</p></div>
                    : <div className={classes.status}> <CancelIcon /> <p className={classes.statusText}>Offline</p> </div>
                }
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.plan}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
