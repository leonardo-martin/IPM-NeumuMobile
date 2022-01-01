import React, { FC, ReactElement } from 'react'
import { Platform } from 'react-native'
import { DrawerActions, useNavigation } from '@react-navigation/native'
import { Icon, IconProps, Layout, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components'
import { useDrawerStatus } from '@react-navigation/drawer'
import { headerStyle } from './style'
import TitleNeumu from '@components/titleNeumu'

const HeaderAdmin: FC = (): ReactElement => {
  const { goBack, dispatch, canGoBack, navigate } = useNavigation<any>()
  const styles = useStyleSheet(headerStyle)

  const BackIcon = (props: IconProps) => (
    <Icon {...props} style={styles.icon} name={Platform.OS === 'ios' ? 'arrow-ios-back-outline' : Platform.OS === 'android' ? 'arrow-back-outline' : 'arrow-back-outline'} size={30} pack='ionicons' />
  )
  const MenuIcon = (props: IconProps) => (
    <Icon {...props} style={styles.icon} name="menu-outline" size={30} pack='ionicons' />
  )
  const ChatIcon = (props: IconProps) => (
    <Icon {...props} style={styles.icon} name="chatbubbles" size={30} pack='ionicons' />
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
    <Layout level="1" style={styles.layout}>
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
