import React, { FC, ReactElement, useState } from 'react'
import { SafeAreaView, View, TouchableWithoutFeedback, Alert } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { loginStyle } from './style'
import { SignInData } from '../../models/User'
import { useAuth } from '../../contexts/auth'
import { Input, Text, Button, Icon, IconProps } from '@ui-kitten/components'
import TitleNeumu from '../../components/titleNeumu'
import { useNavigation } from '@react-navigation/native'
import { RecoveryPasswordScreenProp, SignUpScreenProp } from '../../routes/auth.routes'

const SignInScreen: FC = (): ReactElement => {

    const [secureTextEntry, setSecureTextEntry] = useState(true)
    const { signIn } = useAuth()
    const navigationSignUp = useNavigation<SignUpScreenProp>()
    const navigationRecovery = useNavigation<RecoveryPasswordScreenProp>()

    const { control, handleSubmit, formState: { errors } } = useForm<SignInData>()

    const handleSignIn = async (data: SignInData) => {
        const response = await signIn(data)
        if (response) {
            Alert.alert(
                'Erro',
                'Houve um problema para realizar o acesso',
                [
                    { text: 'OK' }
                ]
            )
        }
    }

    const registerName = () => navigationSignUp.navigate('SignUp')
    const recoveryPasswd = () => navigationRecovery.navigate('RecoveryPasswd')

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
            <View style={loginStyle.boxTitle}>
                <Text style={loginStyle.title}>Seja bem vindo ao</Text>
                <TitleNeumu category='h3'/>
            </View>
            <View style={loginStyle.box}>
                <Controller
                    control={control}
                    rules={{
                        required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            style={loginStyle.input}
                            label='Usuário *'
                            keyboardType='default'
                            testID='username'
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name='username'
                    defaultValue='thiagosantana'
                />
                {errors.username?.type === 'required' && <Text category='label' style={loginStyle.text}>This is required</Text>}
                <Controller
                    control={control}
                    rules={{
                        required: true,
                        minLength: 8,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            style={loginStyle.input}
                            label='Senha *'
                            testID='password'
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            accessoryRight={renderIconRightPassword}
                            secureTextEntry={secureTextEntry} />
                    )}
                    name='password'
                    defaultValue='123456789'
                />
                {errors.password?.type === 'required' && <Text category='label' style={loginStyle.text}>This is required</Text>}
                {errors.password?.type === 'minLength' && <Text category='label' style={loginStyle.text}>Min. 8 characters.</Text>}
                <View style={loginStyle.containerRecoveryPassword}>
                    <Text
                        style={loginStyle.text}
                        category='label'
                        testID='recoveryButton'>
                        Esqueceu a senha? Clique{' '}
                        <Text
                            category='label'
                            testID='hereBtn'
                            status='info'
                            style={loginStyle.textHere}
                            onPress={recoveryPasswd}>
                            aqui
                        </Text>
                        !
                    </Text>
                </View>
                <View style={loginStyle.containerButtons}>
                    <Button
                        style={loginStyle.button}
                        onPress={handleSubmit(handleSignIn)}
                        status='primary'>
                        ACESSAR
                    </Button>
                    <Button
                        onPress={registerName}
                        style={loginStyle.button}
                        testID='RegisterButton'
                        status='warning'>
                        CADASTRE-SE
                    </Button>
                </View>
            </View>
        </SafeAreaView>
    )

}

export default SignInScreen