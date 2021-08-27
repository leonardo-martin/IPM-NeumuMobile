import React, { FC, ReactElement } from 'react'
import { SafeAreaView, View } from 'react-native'
import { Button, Card, TextInput, Text } from 'react-native-paper'
import { useForm, Controller } from 'react-hook-form'
import { loginStyle } from './style'
import { SignInData } from '../../models/User'
import { useAuth } from '../../contexts/auth'
import { NavigationProps } from '../../models/Navigation'

const SignInScreen: FC<NavigationProps> = ({ navigation }): ReactElement => {

    const { signIn } = useAuth()
    const { control, handleSubmit, formState: { errors } } = useForm<SignInData>()

    const handleSignIn = (data: SignInData) => {
        signIn(data)
    }
    const registerName = () => navigation.navigate('SignUp')

    return (
        <SafeAreaView style={loginStyle.content}>
            <View style={loginStyle.view}>
                <Card>
                    <Card.Content>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={loginStyle.text}
                                    label='Username'
                                    keyboardType='default'
                                    testID='username'
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value} />
                            )}
                            name='username'
                            defaultValue='thiagosantana'
                        />
                        {errors.username?.type === 'required' && <Text>This is required.</Text>}
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                                minLength: 8,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={loginStyle.text}
                                    label='Password'
                                    secureTextEntry={true}
                                    testID='password'
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value} />
                            )}
                            name='password'
                            defaultValue='123456789'
                        />
                        {errors.password?.type === 'required' && <Text>This is required.</Text>}
                        {errors.password?.type === 'minLength' && <Text>Min. 8 characters.</Text>}
                        <Button
                            uppercase={false}
                            color='#000000'
                            testID='recoveryButton'>
                            Esqueceu a senha?
                        </Button>
                        <Button
                            style={loginStyle.loginButton}
                            color='#3171AC'
                            mode='contained'
                            onPress={handleSubmit(handleSignIn)}>
                            Login
                        </Button>
                        <Button
                            onPress={registerName}
                            style={loginStyle.registerButton}
                            color='#D55F0A'
                            mode='contained'
                            testID='RegisterButton'>
                            Cadastre-se
                        </Button>
                    </Card.Content>
                </Card>
            </View>
        </SafeAreaView>
    )

}

export default SignInScreen