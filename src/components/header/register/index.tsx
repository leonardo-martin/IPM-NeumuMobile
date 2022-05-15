import { UserDoctorData, UserPatientData } from '@models/User'
import { Layout, Text, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { TouchableOpacity } from 'react-native'
import { BackIcon } from '../icons'
import { headerStyle } from './style'

type UserDataType = UserPatientData | UserDoctorData

interface HeaderProps {
  active: number
  numberScreens: number
  form: UseFormReturn<UserDataType, any>
  onNext: () => any
  onBack: () => any
  onFinish: () => any
}

const RegisterHeader: FC<HeaderProps> = ({ ...props }): ReactElement => {

  const styles = useStyleSheet(headerStyle)

  const renderBackAction = () => (
    <TopNavigationAction
      onPress={props.onBack}
      icon={BackIcon} />
  )

  const renderNextAction = () => (
    <TouchableOpacity
      onPress={props.form.handleSubmit((props.numberScreens - 1) === props.active
        ? props.onFinish : props.onNext)}
      style={styles.containerAction}>
      <Text status={(props.numberScreens - 1) === props.active ? 'success' : 'primary'}
        style={styles.label}>{(props.numberScreens - 1) === props.active ? 'Cadastrar' : 'Avançar'}</Text>
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
