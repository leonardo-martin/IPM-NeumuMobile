import { useNavigation } from '@react-navigation/native'
import React, { FC, ReactElement } from 'react'
import { SafeAreaView, View } from 'react-native'
import HeaderComponent from '../../components/header'
import { registerStyle } from './style'

const RegisterEmailScreen: FC = (): ReactElement => {

  const navigation = useNavigation()

  return (
    <>
      <HeaderComponent
        hasBackButton={true} />
      <SafeAreaView style={registerStyle.content}>
        <View style={registerStyle.content}>
          <View style={registerStyle.box}>
          </View>
        </View>
      </SafeAreaView>
    </>
  )
}

export default RegisterEmailScreen