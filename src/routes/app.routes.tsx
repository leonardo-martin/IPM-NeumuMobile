import React, { FC, ReactElement } from 'react'
import {
  createDrawerNavigator,
  DrawerContentComponentProps
} from '@react-navigation/drawer'
import DashboardScreen from '@pages/admin'
import DrawerContent from '@components/drawer'
import ProfileScreen from '@pages/admin/profile'

import ScheduleScreen from '@pages/admin/schedule'
import PresentialScreen from '@pages/admin/schedule/presential'
import HeaderAdmin from '@components/header/admin'
import DoctorsScheduleScreen from '@pages/admin/schedule/doctorsSchedule'
import DoctorProfileScreen from '@pages/admin/doctorProfile'
import ConfigurationScreen from '@pages/admin/configuration/home'
import AppointmentScreen from '@pages/admin/appointments'
import InformationAppScreen from '@pages/admin/configuration/infos'
import MessagesScreen from '@pages/admin/messages'
import ChatRoomScreen from '@pages/admin/chat'
import EditProfileScreen from 'pages/admin/profile/extra'

const { Navigator, Screen, Group } = createDrawerNavigator()

const AppRoutes: FC = (): ReactElement => {

  return (
    <Navigator
      backBehavior="history"
      drawerContent={props => <DrawerContent {...props} />}
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
      <Group screenOptions={{
        swipeEnabled: false
      }}>
        <Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            drawerLabel: 'Meu Perfil'
          }}
        />
        <Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{
            drawerLabel: 'Editar Perfil'
          }}
        />
      </Group>

      <Screen
        name="MyAppointments"
        component={AppointmentScreen}
        options={{
          swipeEnabled: false,
          drawerLabel: 'Minhas consultas'
        }}
      />

      <Group screenOptions={{
        swipeEnabled: false
      }}>
        <Screen
          name="MessagesList"
          component={MessagesScreen}
          options={{
            swipeEnabled: false,
            drawerLabel: 'Mensagens'
          }}
        />
        <Screen
          name="ChatRoom"
          component={ChatRoomScreen}
          options={{
            swipeEnabled: false,
            drawerLabel: 'Bate-papo',
          }}
        />
      </Group>

      <Group screenOptions={{
        swipeEnabled: false
      }}>
        <Screen
          name="DoctorsSchedule"
          component={DoctorsScheduleScreen}
          options={{
            drawerLabel: 'Agenda do Médico'
          }}
        />
        <Screen
          name="DoctorProfile"
          component={DoctorProfileScreen}
          options={{
            drawerLabel: 'Perfil do Médico'
          }}
        />
      </Group>


      <Group screenOptions={{
        swipeEnabled: false
      }}>
        <Screen
          name="Configuration"
          component={ConfigurationScreen}
          options={{
            drawerLabel: 'Configurações'
          }}
        />

        <Screen
          name="InformationApp"
          component={InformationAppScreen}
          options={{
            drawerLabel: 'Informações do Aplicativo'
          }}
        />
      </Group>

    </Navigator>
  )
}

export default AppRoutes
