import React, { FC, ReactElement } from 'react'
import { DrawerActions, useNavigation } from '@react-navigation/native'
import { Layout, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components'
import { useDrawerStatus } from '@react-navigation/drawer'
import { headerStyle } from './style'
import TitleNeumu from '@components/titleNeumu'
import { BackIcon, ChatIcon, MenuIcon } from '../icons/icons'

const HeaderAdmin: FC = (): ReactElement => {
  const { goBack, dispatch, canGoBack, navigate } = useNavigation<any>()
  const styles = useStyleSheet(headerStyle)

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
