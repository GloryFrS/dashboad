import { MouseEvent } from 'react'

interface rightButton {
  icon: string,
  action: (event: MouseEvent) => void
}

export interface MenuItem {
  divider?: boolean,
  icon?: string,
  title: string,
  route?: string,
  itmes: Array<MenuItem>
  rightButton?: rightButton
}

export interface OpenMenuProfileProps {
  user: any,
  widthMenu: number
}

export interface MenuDrawerProps {
  menuElements: Array<MenuItem>
  headerClose: any
  headerOpen: any
  DrawerWidth?: number
  children: any
}
