import LogoPedroMolina from '@assets/svg/logo.svg'
import SignUpOptDialog from '@components/dialog/signUpOptDialog'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import TitleNeumu from '@components/titleNeumu'
import toast from '@helpers/toast'
import { useAppDispatch } from '@hooks/redux'
import { useModal } from '@hooks/useModal'
import { LoginDto } from '@models/User'
import { useNavigation } from '@react-navigation/native'
import { AppStorage } from '@services/app-storage.service'
import { authLogin } from '@services/auth.service'
import { Button, CheckBox, Icon, IconProps, Input, Modal, Spinner, Text, useStyleSheet } from '@ui-kitten/components'
import { matchMessage, openMailTo } from '@utils/common'
import { ApprovalsMessageError } from 'models/Common'
import React, { FC, ReactElement, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, Platform, StatusBar, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Keychain from 'react-native-keychain'
import { loginStyle } from './style'

const _optionsKeychain: Keychain.Options = {
  service: 'sec_login', storage: Keychain.STORAGE_TYPE.RSA
}

const SignInScreen: FC = (): ReactElement => {

  const dispatch = useAppDispatch()

  const { ref } = useModal<Modal>()
  const styles = useStyleSheet(loginStyle)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [checked, setChecked] = useState<boolean>(false)

  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true)
  const navigation = useNavigation<any>()
  const form = useForm<LoginDto>()

  const getStoredUsernameAndPassword = async () => {
    const isRemember = await AppStorage.getItem('REMEMBER_ACCESS')
    if (isRemember === 'true') {

      try {
        const userCredentials = await Keychain.getGenericPassword(_optionsKeychain)
        if (userCredentials) {
          form.setValue('username', userCredentials.username)
          form.setValue('password', userCredentials.password)
        }
        setChecked(true)
      } catch (error) {
        setChecked(false)
      }
    }
    else {
      form.reset()
      await Keychain.resetGenericPassword(_optionsKeychain)
    }
  }

  useEffect(() => {
    getStoredUsernameAndPassword()
  }, [])

  const handleSignIn = async (data: LoginDto) => {
    Keyboard.dismiss()
    setIsLoading(!isLoading)
    try {
      const response = await dispatch(authLogin(data, checked))
      if (response) {
        const message = response.data?.message?.message
        let messageToast = ''
        if (message !== "" && message !== undefined) {

          if (message === ApprovalsMessageError.NOTVERIFIED || message === ApprovalsMessageError.REJECTED) {
            navigation.navigate('WaitingApprovals', {
              message: message
            })
          }
          const matchId = matchMessage(message)
          if (matchId === 2)
            messageToast = 'E-mail não verificado'
          else if (matchId === 1)
            messageToast = 'Usuário e/ou senha incorretos'

        } else {
          messageToast = 'Usuário e/ou senha incorretos'
        }
        setIsLoading(false)
        toast.danger({ message: messageToast, duration: 2000 })
      }
    } catch (error) {
      setIsLoading(false)
      toast.danger({ message: 'Ocorreu um erro inesperado.', duration: 2000 })
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
    <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} onPress={!isLoading ? toggleSecureEntry : undefined} pack='eva' />
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

  const onCheckedChange = (isChecked: boolean) => {
    setChecked(isChecked)
  }




  return (
    <>
      <StatusBar hidden={Platform.OS === 'ios' ? true : false} backgroundColor='transparent' translucent />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        contentContainerStyle={{ flexGrow: 1 }}>
        <SafeAreaLayout level='1' style={styles.safeArea}>
          <View style={styles.content}>
            <View style={styles.boxTitle}>
              <LogoPedroMolina width="140" height="150" />
              <Text style={styles.title}>Seja bem vindo ao</Text>
              <TitleNeumu category="h3" />
            </View>
            <View style={styles.box}>
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
                }}
                render={({ field: { onChange, onBlur, value, ref, name } }) => (
                  <Input
                    size='small'
                    style={styles.input}
                    label="E-mail / CPF *"
                    keyboardType="default"
                    testID={name}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value ? value.toLowerCase() : value}
                    returnKeyType="next"
                    ref={ref}
                    maxLength={40}
                    onSubmitEditing={() => form.setFocus('password')}
                    autoCapitalize="none"
                    textContentType="username"
                    editable={!isLoading}
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
                    maxLength={20}
                    autoCapitalize="none"
                    textContentType="password"
                    editable={!isLoading}
                  />
                )}
                name="password"
                defaultValue=""
              />
              {form.formState.errors.password && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{form.formState.errors.password?.message}</Text>}
              <View style={styles.containerCheckbox}>
                <CheckBox
                  disabled={isLoading}
                  status='primary'
                  checked={checked} onChange={onCheckedChange}>
                  {evaProps => <Text style={[evaProps?.style, styles.checkboxText]}>Memorizar acesso</Text>}
                </CheckBox>

                <View style={styles.containerRecoveryPassword}>
                  <TouchableOpacity disabled={isLoading} onPress={recoveryPasswd}>
                    <Text
                      style={styles.textRecoveryPassword}
                      category="label"
                      testID="recoveryButton">
                      Alterar senha
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.containerButtons}>
                <Button
                  accessoryLeft={isLoading ? LoadingIndicator : undefined}
                  style={styles.button}
                  onPress={isLoading ? undefined : form.handleSubmit(handleSignIn)}
                  status="primary">
                  {isLoading ? '' : 'Acessar'.toUpperCase()}
                </Button>
                <Button
                  onPress={isLoading ? undefined : registerName}
                  style={styles.button}
                  testID="RegisterButton"
                  status="warning">
                  {'Cadastre-se'.toUpperCase()}
                </Button>
              </View>
            </View>
            <SignUpOptDialog
              ref={ref}
              onActionButton={register}
              onVisible={setVisibleModal}
              visible={visibleModal}
            />
          </View>
        </SafeAreaLayout>
        <SafeAreaLayout insets='bottom'>
          <TouchableOpacity
            onPress={isLoading ? undefined : openMailTo}>
            <View style={styles.containerContact}>
              <Text style={styles.contactText}>Fale Conosco</Text>
              <Icon name='mail'
                size={20}
                style={styles.icon} />
            </View>
          </TouchableOpacity>
        </SafeAreaLayout>
      </KeyboardAwareScrollView>

    </>
  )
}

export default SignInScreen
