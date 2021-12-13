import React, { FC, ReactElement, useState, createRef } from 'react'
import {
  SafeAreaView,
  View,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  StatusBar
} from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { loginStyle } from './style'
import { SignInData } from '@models/User'
import { useAuth } from '@contexts/auth'
import { Input, Text, Button, Icon, IconProps, Modal, Card } from '@ui-kitten/components'
import TitleNeumu from '@components/titleNeumu'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import LogoPedroMolina from '@assets/svg/logo.svg'
import { TouchableOpacity } from 'react-native-gesture-handler'

const SignInScreen: FC<DrawerContentComponentProps> = ({
  navigation
}): ReactElement => {

  const [visible, setVisible] = useState<boolean>(false)
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true)
  const { signIn } = useAuth()

  const inputPasswordRef = createRef<any>()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<SignInData>()

  const handleSignIn = async (data: SignInData) => {
    const response = await signIn(data)
    if (response) {
      setVisible(true)
    }
  }

  const registerName = () => navigation.navigate('SignUp')
  const recoveryPasswd = () => navigation.navigate('RecoveryPasswd')

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry)
  }

  const renderIconRightPassword = (props: IconProps) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  )

  return (
    <SafeAreaView style={loginStyle.content}>
      <StatusBar barStyle="dark-content" backgroundColor={'transparent'} translucent={true} />
      <View style={loginStyle.boxTitle}>
        <LogoPedroMolina width="140" height="150" />
        <Text style={loginStyle.title}>Seja bem vindo ao</Text>
        <TitleNeumu category="h3" />
      </View>
      <View style={loginStyle.box}>
        <KeyboardAvoidingView behavior='position'>
          <Controller
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                style={loginStyle.input}
                label="Usuário *"
                keyboardType="default"
                testID="username"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                returnKeyType="next"
                autoFocus={true}
                onSubmitEditing={() => inputPasswordRef.current.focus()}
                autoCapitalize="none"

              />
            )}
            name="username"
            defaultValue="pacienttest"
          />
          {errors.username?.type === 'required' && (
            <Text category="s2" style={[loginStyle.text, { paddingBottom: 10 }]}>
              Campo obrigatório
            </Text>
          )}
          <Controller
            control={control}
            rules={{
              required: true,
              minLength: 8
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                style={loginStyle.input}
                label="Senha *"
                testID="password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                accessoryRight={renderIconRightPassword}
                secureTextEntry={secureTextEntry}
                returnKeyType="send"
                underlineColorAndroid="transparent"
                ref={inputPasswordRef}
              />
            )}
            name="password"
            defaultValue="pacienttest"
          />
          {errors.password?.type === 'required' && (
            <Text category="s2" style={[loginStyle.text, { paddingBottom: 10 }]}>
              Campo obrigatório
            </Text>
          )}
          {errors.password?.type === 'minLength' && (
            <Text category="s2" style={[loginStyle.text, { paddingBottom: 10 }]}>
              Min. 8 characters.
            </Text>
          )}
        </KeyboardAvoidingView>
        <View style={loginStyle.containerRecoveryPassword}>
          <Text
            style={loginStyle.text}
            category="label"
            testID="recoveryButton"
          >
            Esqueceu a senha? Clique{' '}
          </Text>
          <TouchableOpacity
            hitSlop={{
              left: 15,
              right: 15,
              top: 15,
              bottom: 15
            }}
            onPress={recoveryPasswd}
          >
            <Text status='info' style={loginStyle.textHere}>aqui</Text>
          </TouchableOpacity>
        </View>
        <Modal
          visible={visible}
          backdropStyle={loginStyle.backdrop}
          onBackdropPress={() => setVisible(false)}>
          <Card disabled={true}>
            <View style={{ paddingVertical: 20, paddingHorizontal: 20 }}>
              <Text category="label" style={{ fontSize: 18, fontWeight: '400' }} >Usuário e/ou senha incorretos</Text>
            </View>
            <TouchableOpacity
              style={loginStyle.buttonModal}
              onPress={() => setVisible(false)}
              hitSlop={{
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
              }}>
              <Text status='primary' style={[loginStyle.textModal, { fontSize: 18 }]}>OK</Text>
            </TouchableOpacity>
          </Card>
        </Modal>
        <View style={loginStyle.containerButtons}>
          <Button
            style={loginStyle.button}
            onPress={handleSubmit(handleSignIn)}
            status="primary"
          >
            ACESSAR
          </Button>
          <Button
            onPress={registerName}
            style={loginStyle.button}
            testID="RegisterButton"
            status="warning"
          >
            CADASTRE-SE
          </Button>
        </View>
      </View>
    </SafeAreaView >
  )
}

export default SignInScreen
