import React, { FC, ReactElement, useState, useEffect } from 'react'
import { View, KeyboardAvoidingView, StatusBar } from 'react-native'
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
  const [visibleToast, setVisibleToast] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
        const message = response?.response?.data?.message?.message
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
      <StatusBar barStyle="dark-content" backgroundColor={'transparent'} translucent={true} />
      <SafeAreaLayout level='1' style={styles.content}>
        <View style={styles.viewContent}>
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
                  required: true
                }}
                render={({ field: { onChange, onBlur, value, ref, name } }) => (
                  <Input
                    style={styles.input}
                    label="Usuário *"
                    keyboardType="default"
                    testID={name}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    returnKeyType="next"
                    ref={ref}
                    onSubmitEditing={() => setFocus('password')}
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
                render={({ field: { onChange, onBlur, value, ref, name } }) => (
                  <Input
                    style={styles.input}
                    label="Senha *"
                    keyboardType={!secureTextEntry ? 'visible-password' : 'default'}
                    testID={name}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    accessoryRight={renderIconRightPassword}
                    secureTextEntry={secureTextEntry}
                    returnKeyType="send"
                    underlineColorAndroid="transparent"
                    ref={ref}
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
            <View style={styles.containerRecoveryPassword}>
              <Text
                style={styles.text}
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
      </SafeAreaLayout>
    </>
  )
}

export default SignInScreen
