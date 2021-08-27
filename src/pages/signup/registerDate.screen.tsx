import React, { FC, ReactElement } from 'react'
import { SafeAreaView, View } from 'react-native'
import HeaderComponent from '../../components/header'
import { NavigationProps } from '../../models/Navigation'
import { registerStyle } from './style'

const RegisterEmailScreen: FC<NavigationProps> = ({ navigation }): ReactElement => {

  return (
    <SafeAreaView style={registerStyle.content}>
      <HeaderComponent
        title='Registro'
        navigation={navigation}
        hasBackButton={true} />
      <View style={registerStyle.content}>
        <View style={registerStyle.view}>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default RegisterEmailScreen