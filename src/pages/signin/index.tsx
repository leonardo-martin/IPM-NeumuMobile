import React, { FC, ReactElement, useCallback, useState } from 'react'
import { View, KeyboardAvoidingView, ScrollView, StatusBar, Platform, Keyboard } from 'react-native'
import { Input, Text, Button, Icon, IconProps, Spinner, useStyleSheet, Modal } from '@ui-kitten/components'
import { useForm, Controller } from 'react-hook-form'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { SignInData } from '@models/User'
import { useAuth } from '@contexts/auth'
import TitleNeumu from '@components/titleNeumu'
import LogoPedroMolina from '@assets/svg/logo.svg'
import { matchMessage } from '@utils/common'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import toast from '@helpers/toast'
import { isJustNumber } from '@utils/mask'
import RegisterModal from 'components/modal/registerModal'
import { loginStyle } from './style'
import { useModal } from '@hooks/useModal'

const SignInScreen: FC = (): ReactElement => {

  const { ref } = useModal<Modal>()
  const styles = useStyleSheet(loginStyle)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [visibleModal, setVisibleModal] = useState<boolean>(false)

  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true)
  const { signIn } = useAuth()
  const navigation = useNavigation<any>()
  const form = useForm<SignInData>()

  useFocusEffect(
    useCallback(() => {
      form.reset()
      setIsLoading(false)
    }, [])
  )

  const handleSignIn = async (data: SignInData) => {
    Keyboard.dismiss()
    setIsLoading(!isLoading)
    try {
      const response = await signIn(data)
      if (response) {
        const message = response.data?.message?.message
        let messageToast = ''
        if (message !== "" && message !== undefined) {
          const matchId = matchMessage(message)
          if (matchId === 2)
            messageToast = 'E-mail não verificado'
          else if (matchId === 1)
            messageToast = 'Usuário e/ou senha incorretos'

        } else {
          messageToast = 'Usuário e/ou senha incorretos'
        }
        setIsLoading(false)
        toast.danger({ message: messageToast, duration: 1000 })
      }
    } catch (error) {
      setIsLoading(false)
      toast.danger({ message: 'Ocorreu um erro inesperado.', duration: 1000 })
    }
  }

  const registerName = () => {
    setVisibleModal(true)
  }
  const recoveryPasswd = () => navigation.navigate('ChangePasswordChoice')

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry)
  }

  const renderIconRightPassword = (props: IconProps) => (
    <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} onPress={toggleSecureEntry} pack='eva' />
  )

  const LoadingIndicator = () => (
    <Spinner size='small' status='basic' />
  )

  const register = (selected: number | undefined) => {
    navigation.navigate('SignUp', {
      type: selected
    })
    setVisibleModal(!visibleModal)
  }

  return (
    <>
      <StatusBar hidden={Platform.OS === 'ios' ? true : false} backgroundColor='transparent' translucent />
      <SafeAreaLayout level='1' style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps='handled'>
          <View style={styles.content}>
            <View style={styles.boxTitle}>
              <LogoPedroMolina width="140" height="150" />
              <Text style={styles.title}>Seja bem vindo ao</Text>
              <TitleNeumu category="h3" />
            </View>
            <View style={styles.box}>
              <KeyboardAvoidingView behavior='position'>
                <Controller
                  control={form.control}
                  rules={{
                    required: {
                      value: true,
                      message: 'Campo obrigatório'
                    },
                    minLength: {
                      value: 5,
                      message: `Mín. 5 caracteres`
                    },
                    validate: (e) => e !== "" ? (isJustNumber(e) ? false : true) : true
                  }}
                  render={({ field: { onChange, onBlur, value, ref, name } }) => (
                    <Input
                      size='small'
                      style={styles.input}
                      label="Usuário / CPF / E-mail *"
                      keyboardType="default"
                      testID={name}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      returnKeyType="next"
                      ref={ref}
                      maxLength={40}
                      onSubmitEditing={() => form.setFocus('password')}
                      autoCapitalize="none"
                    />
                  )}
                  name="username"
                  defaultValue=""
                />
                {form.formState.errors.username?.type === 'required' && <Text category='s2' style={styles.text}>{form.formState.errors.username?.message}</Text>}
                {form.formState.errors.username?.type === 'minLength' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{form.formState.errors.username?.message}</Text>}
                {form.formState.errors.username?.type === 'validate' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>Necessário ao menos 1 letra</Text>}
                <Controller
                  control={form.control}
                  rules={{
                    required: {
                      value: true,
                      message: 'Campo obrigatório'
                    },
                    minLength: {
                      value: 8,
                      message: `Mín. 8 caracteres`
                    },
                  }}
                  render={({ field: { onChange, onBlur, value, ref, name } }) => (
                    <Input
                      size='small'
                      style={styles.input}
                      label="Senha *"
                      keyboardType='default'
                      testID={name}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      accessoryRight={renderIconRightPassword}
                      secureTextEntry={secureTextEntry}
                      returnKeyType="send"
                      underlineColorAndroid="transparent"
                      onSubmitEditing={form.handleSubmit(handleSignIn)}
                      ref={ref}
                      maxLength={40}
                      autoCapitalize="none"
                    />
                  )}
                  name="password"
                  defaultValue=""
                />
                {form.formState.errors.password && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{form.formState.errors.password?.message}</Text>}
              </KeyboardAvoidingView>
              <View style={styles.containerRecoveryPassword}>
                <Text
                  style={styles.textRecoveryPassword}
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
                  <Text status='primary' style={styles.textHere}>aqui</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.containerButtons}>
                <Button
                  accessoryLeft={isLoading ? LoadingIndicator : undefined}
                  disabled={isLoading}
                  style={styles.button}
                  onPress={form.handleSubmit(handleSignIn)}
                  status="primary"
                >
                  ACESSAR
                </Button>
                <Button
                  onPress={registerName}
                  style={styles.button}
                  testID="RegisterButton"
                  status="warning"
                >
                  CADASTRE-SE
                </Button>
              </View>
            </View>
            <RegisterModal
              ref={ref}
              onActionButton={register}
              onVisible={setVisibleModal}
              visible={visibleModal}
            />
          </View>
        </ScrollView>
      </SafeAreaLayout>
    </>
  )
}

export default SignInScreen
