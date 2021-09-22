import React, { FC, ReactElement } from 'react'
import {
  createDrawerNavigator,
  DrawerContentComponentProps
} from '@react-navigation/drawer'
import DashboardScreen from '../pages/admin'
import DrawerContent from '../components/drawer'
import ProfileScreen from '../pages/admin/profile'

import ScheduleScreen from '../pages/admin/schedule'
import PresentialScreen from '../pages/admin/schedule/presential'
import HeaderAdmin from '../components/header/admin'
import DoctorsScheduleScreen from '../pages/admin/schedule/doctorsSchedule'
import DoctorProfileScreen from '../pages/admin/doctorProfile'

const { Navigator, Screen, Group } = createDrawerNavigator()

const AppRoutes: FC = (): ReactElement => {

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
        options={{
          swipeEnabled: true,
          drawerLabel: 'Inicio'
        }}
      />
      <Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          swipeEnabled: false,
          drawerLabel: 'Agendar consulta'
        }}
      />

      <Screen
        name="PresentialSchedule"
        component={PresentialScreen}
        options={{
          swipeEnabled: false,
          drawerLabel: 'Consulta Presencial'
        }}
      />
      <Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          swipeEnabled: false,
          drawerLabel: 'Meu Perfil'
        }}
      />

      <Group>
        <Screen
          name="DoctorsSchedule"
          component={DoctorsScheduleScreen}
          options={{
            swipeEnabled: false,
            drawerLabel: 'Agenda do Médico'
          }}
        />
        <Screen
          name="DoctorProfile"
          component={DoctorProfileScreen}
          options={{
            swipeEnabled: false,
            drawerLabel: 'Perfil do Médico'
          }}
        />
      </Group>
    </Navigator>
  )
}

export default AppRoutes
