import React, { FC, ReactElement } from 'react'
import { Platform } from 'react-native'
import { DrawerActions, useNavigation, useRoute } from '@react-navigation/native'
import { Layout, TopNavigation, TopNavigationAction } from '@ui-kitten/components'
import { useDrawerStatus } from '@react-navigation/drawer'
import Icon from 'react-native-vector-icons/Ionicons'

import { headerStyle } from './style'
import TitleNeumu from '@components/titleNeumu'
import HeaderChatRoom from './chatRoom'

const HeaderAdmin: FC = (): ReactElement => {
  const { goBack, dispatch, canGoBack, navigate } = useNavigation<any>()
  const route = useRoute()

  const BackIcon = () => (
    <Icon name={Platform.OS === 'ios' ? 'chevron-back-outline' : Platform.OS === 'android' ? 'arrow-back-outline' : 'arrow-back-outline'} size={35} />
  )
  const MenuIcon = () => <Icon name="menu" size={35} />
  const ChatIcon = () => (
    <Icon name="chatbubbles" size={35} />
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
      onPress={() => navigate('MessagesList')}
    />
  )

  return (
    <Layout level="1" style={headerStyle.layout}>
      <TopNavigation
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
