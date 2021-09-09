import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { Button } from '@ui-kitten/components'
import React, { FC, ReactElement } from 'react'
import { SafeAreaView, View } from 'react-native'
import { registerStyle } from './style'

const RegisterEmailScreen: FC<DrawerContentComponentProps> = ({
  navigation
}): ReactElement => {
  const registerEmail = () => navigation.navigate('SignIn')

  return (
    <>
      <SafeAreaView style={registerStyle.content}>
        <View style={registerStyle.content}>
          <View style={registerStyle.box}>
          <Button
            onPress={registerEmail}
            style={registerStyle.button}
            status="primary"
          >
            CONTINUAR
          </Button>
          </View>
        </View>
      </SafeAreaView>
    </>
  )
}

export default RegisterEmailScreen
