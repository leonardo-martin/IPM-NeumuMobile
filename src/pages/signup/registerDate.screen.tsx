import { DrawerContentComponentProps } from '@react-navigation/drawer'
import React, { FC, ReactElement } from 'react'
import { SafeAreaView, View } from 'react-native'
import HeaderAuth from '../../components/header/auth'
import { registerStyle } from './style'

const RegisterEmailScreen: FC<DrawerContentComponentProps> = ({
  navigation
}): ReactElement => {
  return (
    <>
      <HeaderAuth hasBackButton={true} />
      <SafeAreaView style={registerStyle.content}>
        <View style={registerStyle.content}>
          <View style={registerStyle.box}></View>
        </View>
      </SafeAreaView>
    </>
  )
}

export default RegisterEmailScreen
