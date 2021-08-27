import React, { FC, ReactElement, useState } from 'react'
import { SafeAreaView, View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import HeaderComponent from '../../components/header'
import { NavigationProps } from '../../models/Navigation'
import { registerStyle } from './style'

const SignUpScreen: FC<NavigationProps> = ({ navigation }): ReactElement => {

  const [text, setText] = useState('')
  const registerName = () => navigation.navigate('RegisterEmail', { name: text })

  return (
    <SafeAreaView style={registerStyle.content}>

      <HeaderComponent
        title='Registro'
        navigation={navigation}
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

export default SignUpScreen