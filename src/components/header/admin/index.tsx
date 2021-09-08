import React, { FC, ReactElement } from 'react'
import {
  Layout,
  TopNavigation,
  TopNavigationAction
} from '@ui-kitten/components'
import { headerStyle } from './style'
import TitleNeumu from '../../titleNeumu'
import { DrawerActions, useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useDrawerStatus } from '@react-navigation/drawer'

const HeaderAdmin: FC = (): ReactElement => {
  const { goBack, dispatch, canGoBack } = useNavigation()

  const BackIcon = () => (
    <Icon name="chevron-back-outline" size={35} color={'#404040'} />
  )
  const MenuIcon = () => <Icon name="menu" size={35} color={'#404040'} />
  const ChatIcon = () => (
    <Icon name="chatbubbles" size={35} color={'#404040'} />
  )

  const isDrawerOpen = useDrawerStatus() === 'open'

  const renderLeftIcon = () => (
    <TopNavigationAction
      icon={canGoBack() && !isDrawerOpen ? BackIcon : MenuIcon}
      onPress={() =>
        canGoBack() && !isDrawerOpen
          ? goBack()
          : dispatch(DrawerActions.toggleDrawer())
      }
    />
  )
  const renderChatIcon = () => (
    <TopNavigationAction
      icon={ChatIcon}
      onPress={() => console.log('navigate to chat screen')}
    />
  )

  return (
    <Layout level="1">
      <TopNavigation
        style={headerStyle.container}
        alignment="center"
        title={() => <TitleNeumu category="h6" />}
        accessoryLeft={renderLeftIcon}
        accessoryRight={
          !canGoBack() || isDrawerOpen ? renderChatIcon : undefined
        }
      />
    </Layout>
  )
}

export default HeaderAdmin
