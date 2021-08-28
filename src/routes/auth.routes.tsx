import React, { FC, ReactElement } from 'react'
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack'

import SignIn from '../pages/signin'
import SignUpScreen from '../pages/signup'
import RegisterDateScreen from '../pages/signup/registerDate.screen'
import RegisterEmailScreen from '../pages/signup/registerEmail.screen'
import RecoveryPasswordScreen from '../pages/password'
import { ParamListBase } from '@react-navigation/native'

export type SignInScreenProp = StackNavigationProp<ParamListBase, 'SignIn'>
export type SignUpScreenProp = StackNavigationProp<ParamListBase, 'SignUp'>
export type RecoveryPasswordScreenProp = StackNavigationProp<ParamListBase, 'RecoveryPasswd'>
export type RegisterEmailScreenProp = StackNavigationProp<ParamListBase, 'RegisterEmail'>
export type RegisterDateScreenProp = StackNavigationProp<ParamListBase, 'RegisterDate'>


const { Navigator, Screen } = createStackNavigator()

const AuthRoutes: FC = (): ReactElement => (
    <Navigator initialRouteName='SignIn' screenOptions={{
        headerShown: false
    }}>
        <Screen name='SignIn' component={SignIn} />
        <Screen name='SignUp' component={SignUpScreen}></Screen>
        <Screen name='RecoveryPasswd' component={RecoveryPasswordScreen}></Screen>
        <Screen name='RegisterEmail' component={RegisterEmailScreen}></Screen>
        <Screen name='RegisterDate' component={RegisterDateScreen}></Screen>
    </Navigator>
)

export default AuthRoutes