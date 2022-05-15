import { UserDoctorData, UserPatientData } from '@models/User'
import { useNavigation } from '@react-navigation/native'
import { Layout, Text, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Alert, Keyboard, TouchableOpacity } from 'react-native'
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

  const { goBack } = useNavigation()
  const styles = useStyleSheet(headerStyle)

  const renderBackAction = () => (
    <TopNavigationAction
      onPress={back}
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

  const back = () => {
    if (props.active > 0) {
      props.onBack()
    } else {
      Keyboard.dismiss()
      Alert.alert("Deseja sair do cadastro?", "Todos os dados serão perdidos", [
        {
          text: "Não",
          onPress: () => null,
          style: "cancel"
        },
        { text: "Sim", onPress: () => goBack() }
      ])
    }
  }

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
