import React, { FC, ReactElement } from 'react'
import { Layout, Text, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components'
import { useNavigation } from '@react-navigation/native'
import { UseFormReturn } from 'react-hook-form'
import { TouchableOpacity } from 'react-native'

import { UserDoctorData, UserPatientData } from '@models/User'
import { BackIcon } from '../icons'
import { headerStyle } from './style'

type UserDataType = UserPatientData | UserDoctorData

interface HeaderProps {
  active: number
  numberScreens: number
  form: UseFormReturn<UserDataType, any>
  onNext: () => void
  onBack: () => void
  onFinish: () => void
}

const RegisterHeader: FC<HeaderProps> = ({ ...props }): ReactElement => {

  const { goBack } = useNavigation()
  const styles = useStyleSheet(headerStyle)

  const renderBackAction = () => (
    <TopNavigationAction
      onPress={props.active === 0 ? goBack : props.onBack}
      icon={BackIcon} />
  )

  const renderNextAction = () => (
    <TouchableOpacity
      onPress={props.form.handleSubmit((props.numberScreens - 1) === props.active
        ? props.onFinish : props.onNext)}
      style={styles.containerAction}>
      <Text status={(props.numberScreens - 1) === props.active ? 'success' : 'primary'}
        style={styles.label}>{(props.numberScreens - 1) === props.active ? 'Cadastrar' : 'Próximo'}</Text>
    </TouchableOpacity>
  )

  return (
    <>
      <Layout level='1' style={styles.layout}>
        <TopNavigation
          style={styles.topNavigation}
          alignment="center"
          accessoryLeft={renderBackAction}
          accessoryRight={renderNextAction}
        />
      </Layout>
    </>
  )
}

export default RegisterHeader
