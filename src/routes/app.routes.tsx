import React, { FC, ReactElement } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Dashboard from '../pages/admin'

const { Navigator, Screen } = createStackNavigator()

const AppRoutes: FC = (): ReactElement => (
    <Navigator headerMode='none' initialRouteName='Dashboard'>
        <Screen name='Dashboard' component={Dashboard} />
    </Navigator>
)

export default AppRoutes