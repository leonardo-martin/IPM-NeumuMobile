import React, { FC, ReactElement } from 'react'
import { SafeAreaView, Text, View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import HeaderComponent from '../../components/header'
import { NavigationProps } from '../../models/Navigation'
import { registerStyle } from './style'

const RegisterEmailScreen: FC<NavigationProps> = ({ navigation, route }): ReactElement => {

  const registerEmail = () => navigation.navigate('RegisterDate')

  return (
    <SafeAreaView style={registerStyle.content}>

      <HeaderComponent
        title='Registro'
        navigation={navigation}
        hasBackButton={true} />
      <View style={registerStyle.content}>
        <View style={registerStyle.view}>
          <Text>{route.params.name}</Text>
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