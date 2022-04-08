import React, { FC, ReactElement } from 'react'
import { Layout, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components'
import TitleNeumu from '@components/titleNeumu'
import { headerStyle } from './style'
import { useNavigation } from '@react-navigation/native'
import { BackIcon } from '../icons'

const HeaderAuth: FC = (): ReactElement => {
  const { goBack } = useNavigation()
  const styles = useStyleSheet(headerStyle)

  const renderBackAction = () => (
    <TopNavigationAction onPress={goBack} icon={BackIcon} />
  )

  return (
    <>
      <Layout level='1' style={styles.layout}>
        <TopNavigation
          style={styles.topNavigation}
          alignment="center"
          title={() => <TitleNeumu category="h6" />}
          accessoryLeft={renderBackAction}
        />
      </Layout>
    </>
  )
}

export default HeaderAuth
