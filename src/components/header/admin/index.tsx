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

const HeaderAdmin: FC = (): ReactElement => {
  const navigation = useNavigation()

  const MenuIcon = () => (
    <Icon name='menu' size={35} color={'#404040'} />
  )
  const ChatIcon = () => (
    <Icon name='chatbubbles' size={35} color={'#404040'} />
  )

  const renderSidebarIcon = () => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
    />
  )
  const renderChatIcon = () => (
    <TopNavigationAction
      icon={ChatIcon}
      onPress={() => console.log('navigate to chat screen')}
    />
  )

  return (
    <Layout level='1'>
      <TopNavigation
        style={headerStyle.container}
        alignment='center'
        title={() => <TitleNeumu category='h6' />}
        accessoryLeft={renderSidebarIcon}
        accessoryRight={renderChatIcon}
      />
    </Layout>
  )
}

export default HeaderAdmin
