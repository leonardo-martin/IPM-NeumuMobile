import React, { FC, ReactElement, useState, useEffect } from 'react'
import { View, KeyboardAvoidingView, ScrollView, StatusBar, Platform } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { loginStyle } from './style'
import { SignInData } from '@models/User'
import { useAuth } from '@contexts/auth'
import { Input, Text, Button, Icon, IconProps, Spinner, useStyleSheet } from '@ui-kitten/components'
import TitleNeumu from '@components/titleNeumu'
import LogoPedroMolina from '@assets/svg/logo.svg'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Toast from '@components/toast'
import { matchMessage } from '@utils/common'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaLayout } from '@components/safeAreaLayout'

const SignInScreen: FC = (): ReactElement => {

  const styles = useStyleSheet(loginStyle)
  const [visibleToast, setVisibleToast] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [message, setMessage] = useState<string>('')
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true)
  const { signIn } = useAuth()
  const navigation = useNavigation<any>()

  const { control, handleSubmit, setFocus, formState: { errors } } = useForm<SignInData>()

  const handleSignIn = async (data: SignInData) => {
    setIsLoading(!isLoading)
    try {
      const response = await signIn(data)
      if (response) {
        const message = response.data?.message?.message
        if (message !== "" && message !== undefined) {
          const matchId = matchMessage(message)
          if (matchId === 2)
            setMessage('E-mail não verificado')
          else if (matchId === 1)
            setMessage('Usuário e/ou senha incorretos')

        } else {
          setMessage('Usuário e/ou senha incorretos')
        }
        setVisibleToast(true)
      }
    } catch (error) {
      setMessage(error as string)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => setVisibleToast(false), [visibleToast])

  const registerName = () => navigation.navigate('SignUp')
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

  return (
    <>
      <StatusBar hidden={Platform.OS === 'ios' ? true : false} backgroundColor='transparent' translucent />
      <SafeAreaLayout level='1' style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.boxTitle}>
              <LogoPedroMolina width="140" height="150" />
              <Text style={styles.title}>Seja bem vindo ao</Text>
              <TitleNeumu category="h3" />
            </View>
            <View style={styles.box}>
              <KeyboardAvoidingView behavior='position'>
                <Controller
                  control={control}
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
                      label="Usuário *"
                      keyboardType="default"
                      testID={name}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      returnKeyType="next"
                      ref={ref}
                      maxLength={40}
                      onSubmitEditing={() => setFocus('password')}
                      autoCapitalize="none"
                    />
                  )}
                  name="username"
                  defaultValue=""
                />
                {errors.username && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{errors.username?.message}</Text>}
                <Controller
                  control={control}
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
                      onSubmitEditing={handleSubmit(handleSignIn)}
                      ref={ref}
                      maxLength={40}
                      autoCapitalize="none"
                    />
                  )}
                  name="password"
                  defaultValue=""
                />
                {errors.password && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{errors.password?.message}</Text>}
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
              <Toast visible={visibleToast} message={message} />
              <View style={styles.containerButtons}>
                <Button
                  accessoryLeft={isLoading ? LoadingIndicator : undefined}
                  disabled={isLoading}
                  style={styles.button}
                  onPress={handleSubmit(handleSignIn)}
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
          </View>
        </ScrollView>
      </SafeAreaLayout>
    </>
  )
}

export default SignInScreen
