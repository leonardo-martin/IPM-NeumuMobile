import { BackIcon, ReceiptIcon } from '@components/header/icons'
import { useAppSelector } from '@hooks/redux'
import { EUserRole } from '@models/UserRole'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Layout, Text, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement } from 'react'
import { RootState } from 'store'
import { headerStyle } from '../style'

const HeaderProfile: FC = (): ReactElement => {

  const { goBack, navigate } = useNavigation<any>()
  const route = useRoute()
  const styles = useStyleSheet(headerStyle)
  const { sessionUser } = useAppSelector((state: RootState) => state.auth)

  const renderLeftIcon = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={goBack}
    />
  )

  const renderRigthIcon = () => (
    <TopNavigationAction
      icon={ReceiptIcon}
      onPress={() => navigate('PatientDiaryEntry')}
    />
  )

  return (
    <Layout level="1" style={styles.layout}>
      <TopNavigation
        alignment="center"
        title={evaProps => <Text {...evaProps}>Meu Perfil</Text>}
        accessoryLeft={renderLeftIcon}
        accessoryRight={
          route.name === 'Profile' && sessionUser?.userRole.find(e => e.id === EUserRole.patient) ? renderRigthIcon : undefined}
      />
    </Layout>
  )
}

export default HeaderProfile
