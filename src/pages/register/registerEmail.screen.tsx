import React from 'react'
import { SafeAreaView, Text, View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import { HeaderComponent } from '../../components/header/header.component'
import { registerStyle } from './register.style'

interface RegisterEmailScreenProps {
  route: any
  navigation: any
}

export const RegisterEmailScreen = (props: RegisterEmailScreenProps) => {

  const registerEmail = () => props.navigation.navigate('RegisterDate')

  return (
    <SafeAreaView style={registerStyle.content}>

      <HeaderComponent
        title='Registro'
        navigation={props.navigation}
        hasBackButton={true} />
      <View style={registerStyle.content}>
        <View style={registerStyle.view}>
          <Text>{props.route.params.name}</Text>
          <TextInput
            label='Qual seu email?'
            style={registerStyle.text} />
          <Button
            onPress={registerEmail}
            style={registerStyle.continuedButton}
            color='#3171AC'
            mode='contained'>
            Continuar
          </Button>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default RegisterEmailScreen