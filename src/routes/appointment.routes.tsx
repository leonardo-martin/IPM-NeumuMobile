import React, { FC, ReactElement } from 'react'
import { createMaterialTopTabNavigator, MaterialTopTabBarProps } from '@react-navigation/material-top-tabs'
import AppointmentsTabBar from 'pages/admin/appointments/extra/appointment-tabBar'
import AppointmentTabItemScreen from 'pages/admin/appointments/extra/appointment-item'

const TopTab = createMaterialTopTabNavigator()

const AppointmentsRoutes: FC = (): ReactElement => {

    return (
        <TopTab.Navigator tabBar={(props: MaterialTopTabBarProps) => <AppointmentsTabBar {...props} />} >
            <TopTab.Screen name='Ativos' component={AppointmentTabItemScreen} />
            <TopTab.Screen name='Encerrados' component={AppointmentTabItemScreen} />
        </TopTab.Navigator>
    )
}

export default AppointmentsRoutes
