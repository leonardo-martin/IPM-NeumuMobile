import React, { FC, ReactElement } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import DashboardScreen from '../pages/admin'
import { StackNavigationProp } from '@react-navigation/stack'
import { ParamListBase } from '@react-navigation/native'

export type DashboardScreenProp = StackNavigationProp<ParamListBase, 'Dashboard'>

const { Navigator, Screen } = createDrawerNavigator()

const AppRoutes: FC = (): ReactElement => (
    <Navigator
        initialRouteName='Dashboard' screenOptions={{
            headerShown: false
        }}
    >
        <Screen name='Dashboard' component={DashboardScreen} />
    </Navigator>
)

export default AppRoutes