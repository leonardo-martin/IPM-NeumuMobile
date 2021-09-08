import React, { FC, ReactElement } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import SignIn from '../pages/signin'
import SignUpScreen from '../pages/signup'
import RegisterDateScreen from '../pages/signup/registerDate.screen'
import RegisterEmailScreen from '../pages/signup/registerEmail.screen'
import RecoveryPasswordScreen from '../pages/password'

const { Navigator, Screen } = createStackNavigator()

const AuthRoutes: FC = (): ReactElement => (
  <Navigator
    initialRouteName="SignIn"
    screenOptions={{
      headerShown: false
    }}
  >
    <Screen name="SignIn" component={SignIn} />
    <Screen name="SignUp" component={SignUpScreen} />
    <Screen name="RecoveryPasswd" component={RecoveryPasswordScreen} />
    <Screen name="RegisterEmail" component={RegisterEmailScreen} />
    <Screen name="RegisterDate" component={RegisterDateScreen} />
  </Navigator>
)

export default AuthRoutes
