import { FC } from 'react'
import { List } from '@mui/material'
import { SidebarItemsType } from 'types'
import { SidebarLinkItem } from 'UI'
import { correctionName } from 'utils'
import s from './SidebarLeftList.module.scss'

interface SidebarLeftListProps {
  sidebarItems: SidebarItemsType[]
}

const SidebarLeftList: FC<SidebarLeftListProps> = ({ sidebarItems }) => {
  return (
    <List className={s.list}>
      {sidebarItems.map(({ title, id, picture }) => (
        <SidebarLinkItem
          key={id}
          label={correctionName(title)}
          icon={picture}
          linkTo={`/home/${title.toLowerCase()}`}
          className={s.listItem}
        />
      ))}
    </List>
  )
}

export default SidebarLeftList
