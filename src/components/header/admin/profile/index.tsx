import React, { FC, ReactElement } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Layout, Text, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components'
import { headerStyle } from '../style'
import { BackIcon, ReceiptIcon } from '@components/header/icons'

const HeaderProfile: FC = (): ReactElement => {
  const { goBack, navigate } = useNavigation<any>()
  const route = useRoute()
  const styles = useStyleSheet(headerStyle)

  const renderLeftIcon = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={goBack}
    />
  )

  const renderRigthIcon = () => (
    <TopNavigationAction
      icon={ReceiptIcon}
      onPress={() => navigate('MyNotes')}
    />
  )

  return (
    <Layout level="1" style={styles.layout}>
      <TopNavigation
        alignment="center"
        title={evaProps => <Text {...evaProps}>Meu Perfil</Text>}
        accessoryLeft={renderLeftIcon}
        accessoryRight={route.name === 'Profile' ? renderRigthIcon : undefined}
      />
    </Layout>
  )
}

export default HeaderProfile
