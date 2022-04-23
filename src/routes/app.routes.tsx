import DrawerContent from '@components/drawer'
import HeaderAdmin from '@components/header/admin'
import HeaderChatRoom from '@components/header/admin/chatRoom'
import DashboardScreen from '@pages/admin'
import AppointmentsScreen from '@pages/admin/appointments'
import ChatRoomScreen from '@pages/admin/chat'
import ConfigurationScreen from '@pages/admin/configuration/home'
import InformationAppScreen from '@pages/admin/configuration/infos'
import NotificationScreen from '@pages/admin/configuration/notification'
import Terms from '@pages/admin/configuration/terms'
import DoctorProfileScreen from '@pages/admin/doctorProfile'
import HelpScreen from '@pages/admin/help'
import MessagesScreen from '@pages/admin/messages'
import ProfileScreen from '@pages/admin/profile'
import EditProfileScreen from '@pages/admin/profile/extra'
import PatientGeneticMappingProgramScreen from '@pages/admin/profile/patient-genetic-mapping-program'
import PatientDiaryEntryScreen from '@pages/admin/profile/patient-diary-entry'
import PatientExamsScreen from '@pages/admin/profile/patient-exams'
import ScheduleScreen from '@pages/admin/schedule'
import ConfirmationScheduleScreen from '@pages/admin/schedule/confirmation'
import ChoiceScheduleScreen from '@pages/admin/schedule/extra/filter-schedule'
import PresentialScheduleScreen from '@pages/admin/schedule/presential'
import ChangePasswordChoice from '@pages/changePassword'
import ChangePasswordRequest from '@pages/changePassword/changePasswordSpecific'
import ChangePasswordConfirm from '@pages/changePassword/confirmation'
import { createDrawerNavigator } from '@react-navigation/drawer'
import React, { FC, ReactElement } from 'react'

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
        <Screen name="GeneticMappingProgram" component={PatientGeneticMappingProgramScreen} />
        <Screen
          name="PresentialSchedule"
          component={PresentialScheduleScreen}
        />
        <Screen
          name="ConfirmationSchedule"
          component={ConfirmationScheduleScreen}
        />
        <Screen name="ChangePasswordConfirmation" component={ChangePasswordConfirm} />

        <Screen name="MyNotes" component={PatientDiaryEntryScreen} />
        <Screen name="MyExams" component={PatientExamsScreen} />
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
