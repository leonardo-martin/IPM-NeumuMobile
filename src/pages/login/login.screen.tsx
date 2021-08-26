import React from 'react'
import { SafeAreaView, View } from 'react-native'
import { Button, Card, TextInput } from 'react-native-paper'
import { loginStyle } from './login.style'

interface LoginScreenProps {
    navigation: any
}

export const LoginScreen = (props: LoginScreenProps) => {

    const registerName = () => props.navigation.navigate('Register')

    return (
        <SafeAreaView style={loginStyle.content}>
            <View style={loginStyle.view}>
                <Card>
                    <Card.Content>
                        <TextInput
                            style={loginStyle.text}
                            label='E-mail:'
                            keyboardType='email-address'
                            testID='email' />
                        <TextInput
                            style={loginStyle.text}
                            label='Senha:'
                            secureTextEntry={true}
                            testID='password' />
                        <Button
                            uppercase={false}
                            color='#000000'
                            testID='recoveryButton'>
                            Esqueceu a senha?
                        </Button>
                        <Button
                            style={loginStyle.loginButton}
                            color='#3171AC'
                            mode='contained'>
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