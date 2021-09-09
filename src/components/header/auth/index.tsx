import React, { FC, ReactElement } from 'react'
import {
  Layout,
  TopNavigation,
  TopNavigationAction
} from '@ui-kitten/components'
import TitleNeumu from '../../titleNeumu'
import { headerStyle } from './style'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Ionicons'


const HeaderAuth: FC = (): ReactElement => {
  const { goBack } = useNavigation()

  const BackIcon = () => (
    <Icon name="chevron-back-outline" size={35} color={'#404040'} />
  )

  const renderBackAction = () => (
    <TopNavigationAction onPress={goBack} icon={BackIcon} />
  )

  return (
    <>
      <Layout level="1" style={headerStyle.layout}>
        <TopNavigation
          style={headerStyle.container}
          alignment="center"
          title={() => <TitleNeumu category="h6" />}
          accessoryLeft={renderBackAction}
        />
      </Layout>
    </>
  )
}

export default HeaderAuth
