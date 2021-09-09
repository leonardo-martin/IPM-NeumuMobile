import React, { FC, ReactElement } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import SignIn from '../pages/signin'
import SignUpScreen from '../pages/signup'
import RegisterDateScreen from '../pages/signup/registerDate.screen'
import RegisterEmailScreen from '../pages/signup/registerEmail.screen'
import RecoveryPasswordScreen from '../pages/password'
import HeaderAuth from '../components/header/auth'

const { Navigator, Screen, Group } = createStackNavigator()

const AuthRoutes: FC = (): ReactElement => {

  return (
    <Navigator
      initialRouteName="SignIn"
      screenOptions={{
        headerShown: false
      }}
    >
      <Screen name="SignIn" component={SignIn} />
      <Group screenOptions={{
        headerShown: true,
        header: () => <HeaderAuth hasBackButton={true} />
      }}>
        <Screen name="SignUp" component={SignUpScreen} />
        <Screen name="RecoveryPasswd" component={RecoveryPasswordScreen} />
        <Screen name="RegisterEmail" component={RegisterEmailScreen} />
        <Screen name="RegisterDate" component={RegisterDateScreen} />
      </Group>
    </Navigator>
  )
}

export default AuthRoutes
