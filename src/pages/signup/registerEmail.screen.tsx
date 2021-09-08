import React, { FC, ReactElement, useState } from 'react'
import { SafeAreaView, View } from 'react-native'
import HeaderAuth from '../../components/header/auth'
import { registerStyle } from './style'
import { Input, Button, Text } from '@ui-kitten/components'
import { DrawerContentComponentProps } from '@react-navigation/drawer'

const RegisterEmailScreen: FC<DrawerContentComponentProps> = ({navigation}): ReactElement => {

  const [text, setText] = useState('')
  const registerEmail = () => navigation.navigate('RegisterDate', { date: text })

  return (
    <>
      <HeaderAuth
        hasBackButton={true} />
      <SafeAreaView style={registerStyle.content}>
        <View style={registerStyle.box}>
          <Text category='h4' style={registerStyle.label}>Qual seu email?</Text>
          <Input
            value={text}
            onChangeText={text => setText(text)}
            style={registerStyle.input} />
          <Button
            onPress={registerEmail}
            style={registerStyle.button}
            status='primary'>
            CONTINUAR
          </Button>
        </View>
      </SafeAreaView>
    </>
  )
}

export default RegisterEmailScreen