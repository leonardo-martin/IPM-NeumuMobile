import { BackIcon, ReceiptIcon } from '@components/header/icons'
import { useAppSelector } from '@hooks/redux'
import { EUserRole } from '@models/UserRole'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Layout, Text, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement } from 'react'
import { TouchableOpacity } from 'react-native'
import { RootState } from 'store'
import { headerStyle } from '../style'

interface HeaderProfileProps {
  showSaveButton?: boolean
  actionSaveButton?: () => void
  disableSaveButton?: boolean
}

const HeaderProfile: FC<HeaderProfileProps> = ({ ...props }): ReactElement => {
  const { showSaveButton, disableSaveButton, actionSaveButton } = props
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

  const renderSaveButton = () => (
    <TouchableOpacity
      disabled={disableSaveButton}
      onPress={actionSaveButton}
      style={styles.containerAction}>
      <Text status={'primary'}
        style={styles.label}>Salvar</Text>
    </TouchableOpacity>
  )

  return (
    <Layout level="1" style={styles.layout}>
      <TopNavigation
        alignment="center"
        title={evaProps => <Text {...evaProps}>Meu Perfil</Text>}
        accessoryLeft={renderLeftIcon}
        accessoryRight={
          route.name === 'Profile' && sessionUser?.userRole.find(e => e.id === EUserRole.patient) ? renderRigthIcon :
            showSaveButton ? renderSaveButton : undefined}
      />
    </Layout>
  )
}

export default HeaderProfile
