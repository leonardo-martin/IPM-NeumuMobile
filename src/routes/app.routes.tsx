import React, { FC, ReactElement } from 'react'
import {
  createDrawerNavigator,
  DrawerContentComponentProps
} from '@react-navigation/drawer'
import DashboardScreen from '../pages/admin'
import DrawerContent from '../components/drawer'
import ProfileScreen from '../pages/admin/profile'

import { useAuth } from '../contexts/auth'
import ScheduleScreen from '../pages/admin/schedule'
import PresentialScreen from '../pages/admin/schedule/presential'
import HeaderAdmin from '../components/header/admin'

const { Navigator, Screen } = createDrawerNavigator()

const AppRoutes: FC = (): ReactElement => {
  const { currentUser } = useAuth()

  return (
    <Navigator
      backBehavior="history"
      drawerContent={(props: DrawerContentComponentProps) => (
        <DrawerContent {...props} />
      )}
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: true,
        header: () => <HeaderAdmin />
      }}
    >
      <Screen
        name="Dashboard"
        component={DashboardScreen}
        initialParams={{ user: currentUser }}
        options={{
          swipeEnabled: true,
          drawerLabel: 'Inicio'
        }}
      />
      <Screen
        name="Schedule"
        component={ScheduleScreen}
        initialParams={{ user: currentUser }}
        options={{
          swipeEnabled: false,
          drawerLabel: 'Agendar consulta'
        }}
      />

      <Screen
        name="PresentialSchedule"
        component={PresentialScreen}
        initialParams={{ user: currentUser }}
        options={{
          swipeEnabled: false,
          drawerLabel: 'Consulta Presencial'
        }}
      />
      <Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ user: currentUser }}
        options={{
          swipeEnabled: false,
          drawerLabel: 'Meu Perfil'
        }}
      />
    </Navigator>
  )
}

export default AppRoutes
