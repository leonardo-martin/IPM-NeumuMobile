import React, { FC, ReactElement, useCallback, useState } from 'react'
import { DrawerActions, useFocusEffect, useNavigation } from '@react-navigation/native'
import { Layout, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components'
import { useDrawerStatus } from '@react-navigation/drawer'
import { headerStyle } from './style'
import TitleNeumu from '@components/titleNeumu'
import { BackIcon, ChatIcon, MenuIcon } from '../icons'

const HeaderAdmin: FC = (): ReactElement => {
  const { goBack, dispatch, canGoBack, navigate } = useNavigation<any>()
  const styles = useStyleSheet(headerStyle)
  const [accessoryLeft, setAccessoryLeft] = useState<JSX.Element>()

  const isDrawerOpen = useDrawerStatus() === 'open'

  useFocusEffect(
    useCallback(() => {
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
      setAccessoryLeft(renderLeftIcon)
    }, [isDrawerOpen])
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
        accessoryLeft={accessoryLeft}
        accessoryRight={
          !canGoBack() || isDrawerOpen ? renderChatIcon : undefined
        }
      />
    </Layout>
  )
}

export default HeaderAdmin
