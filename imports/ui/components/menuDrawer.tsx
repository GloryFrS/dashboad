import React, { useEffect } from 'react'
import clsx from 'clsx'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import { connect, ConnectedProps } from 'react-redux'
import { NavigationOptions } from 'router5'
import { actions } from 'redux-router5'
import Menu from '@material-ui/icons/Menu'
import {
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Icon,
  Collapse,
  Typography,
  ListItemSecondaryAction
} from '@material-ui/core'
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles'
import { useCookies } from 'react-cookie'
import { MenuDrawerProps, MenuItem } from './types'

let maxDrawerWidth = 250
const minDrawerWidth = 56
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexGrow: 1,
      background: '#2f2f2f'
    },
    drawer: {
      width: maxDrawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap'
    },
    drawerOpen: {
      background: '#202020',
      width: maxDrawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    drawerClose: {
      background: '#202020',
      width: minDrawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      overflowX: 'hidden'
    },
    toolbar: {
      display: 'flex',
      background: '#2f2f2f',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 0.5),
      ...theme.mixins.toolbar
    },
    toolbarButton: {
      color: '#a1a1a1'
    },
    listItem: {
      marginTop: 15
    },
    listItemIcon: {
      minWidth: 0,
      color: '#fff'
    },
    listItemText: {
      paddingLeft: theme.spacing(3),
      color: '#fff'
    },
    content: {
      width: '100%'
    }
  })
)

const mapDispatchToProps = (dispatch: any) => ({
  navigateTo: (
    name: string,
    params?: { [key: string]: any },
    opts: NavigationOptions = {}
  ) => {
    dispatch(actions.navigateTo(name, params, opts))
  }
})
const connector = connect(null, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & MenuDrawerProps

const menuDrawer = (props: Props) => {
  maxDrawerWidth = props.DrawerWidth ? props.DrawerWidth : maxDrawerWidth

  const classes = useStyles()
  const theme = useTheme()
  const [openDrawer, setOpenDrawer] = React.useState(false)
  const [openCollapses, setOpenCollapses] = React.useState(Object.create(null))
  const [cookiesMenu, setCookieMenu] = useCookies(['drawerMenu'])
  const [first] = React.useState(true)

  if (Object.getOwnPropertyNames(cookiesMenu).length === 0) {
    setCookieMenu('open', openDrawer)
  }

  useEffect(() => {
    setOpenDrawer(cookiesMenu.open === 'true')
  }, [first])

  const handleDrawer = () => {
    if (openDrawer) {
      const collapse = Object.assign({}, openCollapses)

      for (const key in collapse) {
        collapse[key] = false
      }
      setOpenCollapses(collapse)
    }
    setOpenDrawer(!openDrawer)
    setCookieMenu('open', !openDrawer)
  }
  const handleCollapse = (index: string) => {
    if (!openDrawer) {
      handleDrawer()
    }
    const collapse = Object.assign({}, openCollapses)

    collapse[index] = !collapse[index]
    setOpenCollapses(collapse)
  }
  const openLink = (route: string) => {
    props.navigateTo(route)
  }
  const renderMenu = (
    arr: Array<MenuItem>,
    padding = 2
  ) => {
    const collapsesArray = openCollapses
    const AddCollapse = (key: string) => {
      if (collapsesArray[key] === undefined) {
        collapsesArray[key] = false
      }
    }
    const result =
      arr.map((items: MenuItem) => {
        let collapse

        if (items.itmes.length > 0) {
          AddCollapse(items.title)
          collapse = (
            <Collapse in={openCollapses[items.title]} timeout='auto' unmountOnExit>
              <List component='div' disablePadding>
                {renderMenu(items.itmes, padding + 2)}
              </List>
            </Collapse>
          )
        }
        const ArrowIcon = (
          <ListItemIcon className={classes.listItemIcon}>
            {openCollapses[items.title] ? <Icon>keyboard_arrow_up</Icon> : <Icon>keyboard_arrow_down</Icon>}
          </ListItemIcon>
        )
        const rightButton = items.rightButton ? (
          <ListItemSecondaryAction style={{ right: undefined, left: maxDrawerWidth - 50 }}>
            <IconButton onClick={items.rightButton.action || undefined}>
              <Icon>{items.rightButton.icon}</Icon>
            </IconButton>
          </ListItemSecondaryAction>
        ) : null
        const paddingRightListItem = items.rightButton ? 0 : 'null'

        return (
          <div key={items.title}>
            <ListItem
              button
              onClick={() => { items.itmes.length > 0 ? handleCollapse(items.title) : typeof items.route === 'string' && openLink(items.route) }}
              divider={items.divider}
              className={classes.listItem}
              style={{
                paddingLeft: theme.spacing(padding),
                alignItems: 'spaceBeetwen',
                paddingRight: paddingRightListItem
              }}
            >
              <ListItemIcon className={classes.listItemIcon}>
                <Icon>{items.icon}</Icon>
              </ListItemIcon>
              <ListItemText primary={items.title} className={classes.listItemText} />
              {
                items.itmes.length > 0 ? ArrowIcon : null
              }
              {rightButton}
            </ListItem>
            {collapse}
          </div>
        )
      })
    return result
  }

  return (
    <div className={classes.root}>
      <Drawer
        variant='permanent'
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: openDrawer,
          [classes.drawerClose]: !openDrawer
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: openDrawer,
            [classes.drawerClose]: !openDrawer
          }, 'menuDrawerPaddingBottom')
        }}
      >
        <div className={classes.toolbar}>
          {openDrawer ? (
            <Typography variant='h5' style={{ color: '#fff', fontWeight: 'bold' }}>
                noname team
            </Typography>
          ) : null}

          <IconButton className={classes.toolbarButton} onClick={handleDrawer}>
            {!openDrawer ? <Menu /> : <ChevronLeft />}
          </IconButton>
        </div>
        <Divider />
        {openDrawer ? props.headerOpen : props.headerClose}
        <List>
          {renderMenu(props.menuElements)}
        </List>
      </Drawer>
      <div className={classes.content}>
        {props.children}
      </div>
    </div>
  )
}

export default connector(menuDrawer)
