import DrawerContent from '@components/drawer'
import HeaderAdmin from '@components/header/admin'
import HeaderChatRoom from '@components/header/admin/chatRoom'
import { useDatepickerService } from '@hooks/useDatepickerService'
import DashboardScreen from '@pages/admin'
import AboutScreen from '@pages/admin/about'
import DetailsAboutScreen from '@pages/admin/about/details'
import AppointmentsScreen from '@pages/admin/appointments'
import DetailsAppointmentsScreen from '@pages/admin/appointments/extra/details-appointment'
import PatientDisplayAsDoctorScreen from '@pages/admin/appointments/extra/patient-display'
import ChatRoomScreen from '@pages/admin/chat'
import InformationAppScreen from '@pages/admin/configuration/about'
import ConfigurationScreen from '@pages/admin/configuration/home'
import NotificationScreen from '@pages/admin/configuration/notification'
import ShareInformationWithMedicalDoctorScreen from '@pages/admin/configuration/share-information'
import Terms from '@pages/admin/configuration/terms'
import DoctorProfileScreen from '@pages/admin/doctorProfile'
import HelpScreen from '@pages/admin/help'
import NewUserScreen from '@pages/admin/management/new-user'
import MessagesScreen from '@pages/admin/messages'
import ProfileScreen from '@pages/admin/profile'
import EditProfileScreen from '@pages/admin/profile/extra'
import PatientDiaryEntryScreen from '@pages/admin/profile/patient-diary-entry'
import PatientDocumentsScreen from '@pages/admin/profile/patient-documents'
import CreatePatientDocumentScreen from '@pages/admin/profile/patient-documents/extra/create-document.component'
import PatientGeneticMappingProgramScreen from '@pages/admin/profile/patient-genetic-mapping-program'
import AbrafeuFormScreen from '@pages/admin/profile/patient-genetic-mapping-program/extra/abrafeu-form.component'
import VisitAddressScreen from '@pages/admin/profile/visitAddress'
import ScheduleScreen from '@pages/admin/schedule'
import ConfirmationScheduleScreen from '@pages/admin/schedule/confirmation'
import FilterScheduleScreen from '@pages/admin/schedule/extra/filter-schedule'
import ScheduleSearchResultScreen from '@pages/admin/schedule/extra/search-result'
import PresentialScheduleScreen from '@pages/admin/schedule/patient-schedule'
import ProfessionalScheduleScreen from '@pages/admin/schedule/professional-schedule'
import ChangePasswordChoice from '@pages/changePassword'
import PasswordChangeConfirmationScreen from '@pages/changePassword/extra/change-confirmation'
import PasswordRequestSuccessfullyScreen from '@pages/changePassword/extra/request-successfully'
import ChangePasswordWithToken from '@pages/changePassword/password-with-token'
import ChangePasswordRequest from '@pages/changePassword/selected-password-change-mode'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Button } from '@ui-kitten/components'
import React, { FC, ReactElement } from 'react'
import { LocaleConfig } from 'react-native-calendars'
import TestingRoutes from './test.routes'

const { Navigator, Screen, Group } = createDrawerNavigator()

const AppRoutes: FC = (): ReactElement => {

  const { i18nConfig } = useDatepickerService()

  LocaleConfig.locales['pt-BR'] = {
    monthNames: i18nConfig.monthNames.long,
    monthNamesShort: i18nConfig.monthNames.short,
    dayNames: i18nConfig.dayNames.long,
    dayNamesShort: i18nConfig.dayNames.short,
    today: "Hoje"
  }
  LocaleConfig.defaultLocale = 'pt-BR'

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
        <Screen name="PasswordRequestSuccessfully" component={PasswordRequestSuccessfullyScreen} />
        <Screen name="PasswordChangeConfirmation" component={PasswordChangeConfirmationScreen} />

        <Screen name="PresentialSchedule" component={PresentialScheduleScreen} />
        <Screen name="ConfirmationSchedule" component={ConfirmationScheduleScreen} />
        <Screen name="ProfessionalSchedule" component={ProfessionalScheduleScreen} />

        <Screen name="GeneticMappingProgram" component={PatientGeneticMappingProgramScreen} />

        <Screen name="PatientDiaryEntry" component={PatientDiaryEntryScreen} />

        <Screen name="PatientDocuments" component={PatientDocumentsScreen} />

        <Screen name="Profile" component={ProfileScreen} />
        <Screen name="EditProfile" component={EditProfileScreen} />
        <Screen name="VisitAddress" component={VisitAddressScreen} />

        <Screen name="NewUser" component={NewUserScreen} />
        <Screen name="MessagesList" component={MessagesScreen} />
        <Screen name='DetailsAbout' component={DetailsAboutScreen} />
      </Group>

      <Group screenOptions={{
        swipeEnabled: false,
        headerShown: true,
        header: () => <HeaderAdmin />
      }}>
        <Screen name="ShareInformationWithMedicalDoctor" component={ShareInformationWithMedicalDoctorScreen} />
        <Screen name="PatientDisplayAsDoctor" component={PatientDisplayAsDoctorScreen} />
        <Screen name='AboutDNM' component={AboutScreen} />
        <Screen name="AbrafeuForm" component={AbrafeuFormScreen} />
        <Screen name="CreatePatientDocuments" component={CreatePatientDocumentScreen} />

        <Screen
          name="Schedule"
          component={ScheduleScreen}
        />
        <Screen
          name="FilterSchedule"
          component={FilterScheduleScreen}
        />
        <Screen
          name="ScheduleSearchResult"
          component={ScheduleSearchResultScreen}
        />
        <Screen
          name='DetailsAppointments'
          component={DetailsAppointmentsScreen}
        />
        <Screen
          name="MyAppointments"
          component={AppointmentsScreen}
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
        <Screen name="ChangePasswordWithToken" component={ChangePasswordWithToken} />
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

      {/* Rotas de Dev */}
      <Group screenOptions={{
        headerShown: false
      }}>
        <Screen name="AtosDevTest" component={TestingRoutes} />
      </Group>
    </Navigator>
  )
}

export default AppRoutes
