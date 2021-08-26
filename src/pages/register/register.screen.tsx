import React from 'react'
import { SafeAreaView, View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import { HeaderComponent } from '../../components/header/header.component'
import { registerStyle } from './register.style'

interface RegisterScreenProps {
  navigation: any
}

export const RegisterScreen = (props: RegisterScreenProps) => {

  const [text, setText] = React.useState('')
  const registerName = () => props.navigation.navigate('RegisterEmail', { name: text })

  return (
    <SafeAreaView style={registerStyle.content}>

      <HeaderComponent
        title='Registro'
        navigation={props.navigation}
        hasBackButton={true} />
      <View style={registerStyle.content}>
        <View style={registerStyle.view}>
          <TextInput
            value={text}
            onChangeText={text => setText(text)}
            label='Qual seu nome completo?'
            style={registerStyle.text} />
          <Button
            onPress={registerName}
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

export default RegisterScreen