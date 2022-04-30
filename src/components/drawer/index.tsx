import HouseIcon from '@assets/svg/house.svg'
import PhoneIcon from '@assets/svg/phone.svg'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { useAppDispatch, useAppSelector } from '@hooks/redux'
import { EUserRole } from '@models/UserRole'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { AppInfoService } from '@services/app-info.service'
import { logout } from '@store/ducks/auth'
import { RootState } from '@store/index'
import { Avatar, Divider, Drawer, DrawerGroup, DrawerItem, Icon, IconProps, IndexPath, Text, useTheme } from '@ui-kitten/components'
import { toInitials } from '@utils/common'
import React, { ReactElement } from 'react'
import { ImageBackground, View } from 'react-native'
import { drawerStyle } from './style'

const _VERSION: string = AppInfoService.getVersion() + '.' + AppInfoService.getBuildNumber()
const iconSizeDefault = 20

const DrawerContent = (props: DrawerContentComponentProps): ReactElement => {

  const dispatch = useAppDispatch()
  const { sessionUser } = useAppSelector((state: RootState) => state.auth)
  const { profile } = useAppSelector((state: RootState) => state.profile)

  const theme = useTheme()
  const selectedIndex = new IndexPath(0)

  const navigate = (name: string): void => {
    props.navigation.navigate(name)
  }

  const CalendarIcon = (props: IconProps) => (
    <Icon {...props} name='calendar-outline' size={iconSizeDefault} pack='ionicons' />
  )

  const renderHeader = (): ReactElement => (
    <SafeAreaLayout insets='top' level='2'>
      <View style={drawerStyle.profileContainer}>
        <Avatar
          size='giant'
          source={require('../../assets/profile/profile.png')}
          ImageComponent={ImageBackground}
        />
        <Text style={drawerStyle.profileName} category='h6'>
          {toInitials(profile?.name)}
        </Text>
      </View>
    </SafeAreaLayout>
  )

  const renderFooter = () => (
    <SafeAreaLayout insets='bottom'>
      <React.Fragment>
        <View style={drawerStyle.footer}>
          <Text category={'label'}>v{_VERSION}</Text>
        </View>
      </React.Fragment>
    </SafeAreaLayout>
  )

  return (
    <View style={drawerStyle.drawerContent}>
      <Drawer
        selectedIndex={selectedIndex}
        ItemSeparatorComponent={() => <Divider />}
        header={renderHeader}
        footer={renderFooter} >
        <DrawerItem
          style={drawerStyle.drawerItem}
          title='Inicio'
          onPress={() => navigate('Dashboard')}
          accessoryLeft={(props: IconProps) => <Icon {...props} name='home-outline' size={iconSizeDefault} pack='ionicons' />}
        />
        {sessionUser?.userRole.find(e => e.id === EUserRole.patient) ?
          <>
            <DrawerGroup title='Agendamento de Consulta'
              onLongPress={() => navigate('Schedule')}
              accessoryLeft={CalendarIcon}
            >
              <DrawerItem
                style={drawerStyle.drawerItem}
                title='Virtual (teleconsulta)'
                onPress={() => navigate('FilterSchedule')}
                accessoryLeft={(props: IconProps) => <PhoneIcon {...props} width={iconSizeDefault} height={iconSizeDefault} fill={theme['color-basic-600']} />}
              />
              <DrawerItem
                style={drawerStyle.drawerItem}
                title='Presencial'
                onPress={() => navigate('FilterSchedule')}
                accessoryLeft={(props: IconProps) => <HouseIcon {...props} width={iconSizeDefault} height={iconSizeDefault} fill={theme['color-basic-600']} />}

              />
            </DrawerGroup>
            <Divider />
            <DrawerItem
              style={drawerStyle.drawerItem}
              title='Minhas Consultas'
              // onPress={() => navigate('MyAppointments')}
              accessoryLeft={(props: IconProps) => (
                <Icon {...props} name='stethoscope' size={iconSizeDefault} pack='font-awesome' />
              )}
            />
          </>
          :
          sessionUser?.userRole.find(e => e.id === EUserRole.medicalDoctor) ?
            <DrawerItem
              style={[drawerStyle.drawerItem, { paddingStart: 10 }]}
              title='Agenda'
              // onPress={() => navigate('MyAppointments')}
              accessoryLeft={(props: IconProps) => (
                <Icon {...props} name='calendar-week' size={iconSizeDefault} pack='font-awesome' />
              )}
            />
            :
            <></>}
        <DrawerItem
          style={drawerStyle.drawerItem}
          title='Meu Perfil'
          onPress={() => navigate('Profile')}
          accessoryLeft={(props: IconProps) => (
            <View style={{ paddingHorizontal: 3 }}>
              <Icon {...props} name='prescription' size={iconSizeDefault} pack='fontisto' />
            </View>
          )}
        />
        <DrawerItem
          style={drawerStyle.drawerItem}
          title='Configurações'
          onPress={() => navigate('Configuration')}
          accessoryLeft={(props: IconProps) => (
            <Icon {...props} name='settings-outline' size={iconSizeDefault} pack='ionicons' />
          )}
        />
        <DrawerItem
          style={drawerStyle.drawerItem}
          title='Ajuda'
          onPress={() => navigate('Help')}
          accessoryLeft={(props: IconProps) => (
            <Icon {...props} name="help-circle-outline" size={iconSizeDefault} pack='ionicons' />
          )}
        />
        <DrawerItem
          style={drawerStyle.drawerItem}
          title='Sair'
          onPress={() => dispatch(logout())}
          accessoryLeft={(props: IconProps) => (
            <Icon {...props} name='log-out-outline' size={iconSizeDefault} pack='ionicons' />
          )}
        />
      </Drawer>
    </View >
  )
}

export default DrawerContent
