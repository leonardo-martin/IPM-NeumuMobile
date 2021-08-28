import React, { FC, ReactElement, useState } from 'react'
import { SafeAreaView, View } from 'react-native'
import HeaderComponent from '../../components/header'
import { registerStyle } from './style'
import { Input, Button, Text } from '@ui-kitten/components'
import { useNavigation } from '@react-navigation/native'
import { RegisterEmailScreenProp } from '../../routes/auth.routes'

const SignUpScreen: FC = (): ReactElement => {

  const [text, setText] = useState('')
  const navigation = useNavigation<RegisterEmailScreenProp>()
  const registerName = () => navigation.navigate('RegisterEmail', { name: text })

  return (
    <>
      <HeaderComponent
        hasBackButton={true} />
      <SafeAreaView style={registerStyle.content}>
        <View style={registerStyle.box}>
          <Text category='h4' style={registerStyle.label}>Qual o seu nome completo?</Text>
          <Input
            value={text}
            onChangeText={text => setText(text)}
            style={registerStyle.input} />
          <Button
            onPress={registerName}
            style={registerStyle.button}
            status='primary'>
            CONTINUAR
          </Button>
        </View>
      </SafeAreaView>
    </>
  )
}

export default SignUpScreen