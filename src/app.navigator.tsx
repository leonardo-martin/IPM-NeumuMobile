import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { LoginScreen } from './pages/login/login.screen'
import { RegisterScreen } from './pages/register/register.screen'
import RegisterDateScreen from './pages/register/registerDate.screen'
import RegisterEmailScreen from './pages/register/registerEmail.screen'

const { Navigator, Screen } = createStackNavigator()

const AppNavigator = () => (
    <NavigationContainer>
        <Navigator headerMode='none' initialRouteName='Login'>
            <Screen name='Login' component={LoginScreen}></Screen>
            <Screen name='Register' component={RegisterScreen}></Screen>
            <Screen name='RegisterEmail' component={RegisterEmailScreen}></Screen>
            <Screen name='RegisterDate' component={RegisterDateScreen}></Screen>
        </Navigator>
    </NavigationContainer>
)

export default AppNavigator