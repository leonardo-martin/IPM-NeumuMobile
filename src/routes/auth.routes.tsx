import React, { FC, ReactElement } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import SignIn from '../pages/signin'
import SignUpScreen from '../pages/signup'
import RegisterDateScreen from '../pages/signup/registerDate.screen'
import RegisterEmailScreen from '../pages/signup/registerEmail.screen'

const { Navigator, Screen } = createStackNavigator()

const AuthRoutes: FC = (): ReactElement => (
    <Navigator headerMode='none' initialRouteName='SignIn'>
        <Screen name="SignIn" component={SignIn} />
        <Screen name='SignUp' component={SignUpScreen}></Screen>
        <Screen name='RegisterEmail' component={RegisterEmailScreen}></Screen>
        <Screen name='RegisterDate' component={RegisterDateScreen}></Screen>
    </Navigator>
)

export default AuthRoutes