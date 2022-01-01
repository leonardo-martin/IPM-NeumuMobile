import React, { FC, ReactElement } from 'react'

// DRAWER
import { createDrawerNavigator } from '@react-navigation/drawer'
import DrawerContent from '@components/drawer'

// HEADER
import HeaderAdmin from '@components/header/admin'
import HeaderChatRoom from '@components/header/admin/chatRoom'

// SCENES
import DashboardScreen from '@pages/admin'
import ProfileScreen from '@pages/admin/profile'
import ScheduleScreen from '@pages/admin/schedule'
import ChoiceScheduleScreen from 'pages/admin/schedule/extra'
import PresentialScheduleScreen from 'pages/admin/schedule/presential'
import DoctorProfileScreen from '@pages/admin/doctorProfile'
import ConfigurationScreen from '@pages/admin/configuration/home'
import InformationAppScreen from '@pages/admin/configuration/infos'
import MessagesScreen from '@pages/admin/messages'
import ChatRoomScreen from '@pages/admin/chat'
import EditProfileScreen from '@pages/admin/profile/extra'
import AppointmentsScreen from '@pages/admin/appointments'

const { Navigator, Screen, Group } = createDrawerNavigator()

const AppRoutes: FC = (): ReactElement => {

  return (
    <Navigator
      backBehavior="history"
      drawerContent={props => <DrawerContent {...props} />}
      initialRouteName="Dashboard"
    >
      <Group screenOptions={{
        swipeEnabled: true,
        headerShown: true,
        header: () => <HeaderAdmin />
      }}>
        <Screen
          name="Dashboard"
          component={DashboardScreen}
        />
      </Group>

      <Group screenOptions={{
        swipeEnabled: false,
        headerShown: true,
        header: () => <HeaderAdmin />
      }}>
        <Screen
          name="Schedule"
          component={ScheduleScreen}
        />
        <Screen
          name="ChoiceSchedule"
          component={ChoiceScheduleScreen}
        />
        <Screen
          name="Profile"
          component={ProfileScreen}
        />
        <Screen
          name="EditProfile"
          component={EditProfileScreen}
        />
        <Screen
          name="MyAppointments"
          component={AppointmentsScreen}
        />
        <Screen
          name="MessagesList"
          component={MessagesScreen}
        />
        <Screen
          name="PresentialSchedule"
          component={PresentialScheduleScreen}
        />
        <Screen
          name="DoctorProfile"
          component={DoctorProfileScreen}
        />
        <Screen
          name="Configuration"
          component={ConfigurationScreen}
        />
        <Screen
          name="InformationApp"
          component={InformationAppScreen}
        />
      </Group>

      <Group screenOptions={{
        swipeEnabled: false,
        headerShown: true,
        header: () => <HeaderChatRoom />
      }}>

        <Screen
          name="ChatRoom"
          component={ChatRoomScreen}
        />
      </Group>
    </Navigator>
  )
}

export default AppRoutes
