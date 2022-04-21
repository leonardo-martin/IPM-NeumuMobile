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
import ChoiceScheduleScreen from '@pages/admin/schedule/extra/filter-schedule'
import PresentialScheduleScreen from '@pages/admin/schedule/presential'
import DoctorProfileScreen from '@pages/admin/doctorProfile'
import ConfigurationScreen from '@pages/admin/configuration/home'
import InformationAppScreen from '@pages/admin/configuration/infos'
import MessagesScreen from '@pages/admin/messages'
import ChatRoomScreen from '@pages/admin/chat'
import EditProfileScreen from '@pages/admin/profile/extra'
import AppointmentsScreen from '@pages/admin/appointments'
import NotificationScreen from '@pages/admin/configuration/notification'
import ConfirmationScheduleScreen from '@pages/admin/schedule/confirmation'
import HelpScreen from '@pages/admin/help'
import ChangePasswordChoice from '@pages/changePassword'
import ChangePasswordRequest from '@pages/changePassword/changePasswordSpecific'
import Terms from '@pages/admin/configuration/terms'
import ChangePasswordConfirm from '@pages/changePassword/confirmation'
import MyExamsScreen from '@pages/admin/profile/myExams'
import MyNotesScreen from '@pages/admin/profile/myNotes'
import GeneticMappingProgramScreen from '@pages/admin/profile/mappingProgram'

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
        headerShown: false,
      }}>
        <Screen
          name="Dashboard"
          component={DashboardScreen}
        />
      </Group>

      <Group screenOptions={{
        swipeEnabled: false,
        headerShown: false,
      }}>
        <Screen
          name="PresentialSchedule"
          component={PresentialScheduleScreen}
        />
        <Screen
          name="ConfirmationSchedule"
          component={ConfirmationScheduleScreen}
        />
        <Screen name="ChangePasswordConfirmation" component={ChangePasswordConfirm} />

        <Screen name="MyNotes" component={MyNotesScreen} />
        <Screen name="MyExams" component={MyExamsScreen} />
        <Screen
          name="Profile"
          component={ProfileScreen}
        />
        <Screen
          name="EditProfile"
          component={EditProfileScreen}
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
          name="MyAppointments"
          component={AppointmentsScreen}
        />
        <Screen
          name="MessagesList"
          component={MessagesScreen}
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
          name="Notification"
          component={NotificationScreen}
        />
        <Screen
          name="InformationApp"
          component={InformationAppScreen}
        />
        <Screen name="GeneticMappingProgram" component={GeneticMappingProgramScreen} />
        <Screen name="ChangePasswordChoice" component={ChangePasswordChoice} />
        <Screen name="ChangePasswordRequest" component={ChangePasswordRequest} />
        <Screen name="TermsAndConditions" component={Terms} />
        <Screen name="Help" component={HelpScreen} />
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
