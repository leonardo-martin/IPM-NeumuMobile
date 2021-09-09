import React, { FC, ReactElement, useState } from 'react'
import { SafeAreaView, View } from 'react-native'
import HeaderAuth from '../../components/header/auth'
import { registerStyle } from './style'
import { Input, Button, Text } from '@ui-kitten/components'
import { DrawerContentComponentProps } from '@react-navigation/drawer'

const SignUpScreen: FC<DrawerContentComponentProps> = ({
  navigation
}): ReactElement => {
  const [text, setText] = useState('')
  const registerName = () =>
    navigation.navigate('RegisterEmail', { name: text })

  return (
    <>
      <SafeAreaView style={registerStyle.content}>
        <View style={registerStyle.box}>
          <Text category="h4" style={registerStyle.label}>
            Qual o seu nome completo?
          </Text>
          <Input
            value={text}
            onChangeText={text => setText(text)}
            style={registerStyle.input}
          />
          <Button
            onPress={registerName}
            style={registerStyle.button}
            status="primary"
          >
            CONTINUAR
          </Button>
        </View>
      </SafeAreaView>
    </>
  )
}

export default SignUpScreen
