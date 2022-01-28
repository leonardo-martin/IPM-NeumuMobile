import React, { ReactElement } from 'react'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { Avatar, DrawerGroup, Text, DrawerItem, Drawer, IconProps, Icon } from '@ui-kitten/components'
import { ImageBackground, View } from 'react-native'
import { drawerStyle } from './style'
import { useAuth } from '@contexts/auth'
import { AppInfoService } from '@services/app-info.service'
import { SafeAreaLayout } from '@components/safeAreaLayout'

const _VERSION: string = AppInfoService.getVersion()
const iconSizeDefault = 20

const DrawerContent = (props: DrawerContentComponentProps): ReactElement => {
  const { currentUser, signOut } = useAuth()

  const CalendarIcon = (props: IconProps) => (
    <Icon {...props} name='calendar-outline' size={iconSizeDefault} pack='ionicons' />
  )

  const renderHeader = (): ReactElement => (
    <SafeAreaLayout insets='top' level='2'>
      <View style={drawerStyle.profileContainer}>
        <Avatar
          size='giant'
          source={{ uri: 'https://bootdey.com/img/Content/avatar/avatar6.png' }}
          ImageComponent={ImageBackground}
        />
        <Text style={drawerStyle.profileName} category='h6'>
          {currentUser?.user}
        </Text>
      </View>
    </SafeAreaLayout>
  )

  const renderFooter = () => (
    <SafeAreaLayout insets='bottom'>
      <React.Fragment>
        <View style={drawerStyle.footer}>
          <Text>{`Versão ${_VERSION}`}</Text>
        </View>
      </React.Fragment>
    </SafeAreaLayout>
  )

  return (
    <View style={drawerStyle.drawerContent}>
      <Drawer
        header={renderHeader}
        footer={renderFooter} >
        <DrawerItem
          style={drawerStyle.drawerItem}
          title='Inicio'
          onPress={() => props.navigation.navigate('Dashboard')}
          accessoryLeft={(props: IconProps) => <Icon {...props} name='home-outline' size={iconSizeDefault} pack='ionicons' />}
        />
        <DrawerGroup title='Agendamento de Consulta'
          onLongPress={() => props.navigation.navigate('Schedule')}
          accessoryLeft={CalendarIcon}
        >
          <DrawerItem
            style={drawerStyle.drawerItem}
            title='Virtual (teleconsulta)'
            onPress={() => props.navigation.navigate('ChoiceSchedule')}
          />
          <DrawerItem
            style={drawerStyle.drawerItem}
            title='Presencial'
            onPress={() => props.navigation.navigate('ChoiceSchedule')}
          />
        </DrawerGroup>
        <DrawerItem
          style={drawerStyle.drawerItem}
          title='Minhas Consultas'
          onPress={() => props.navigation.navigate('MyAppointments')}
          accessoryLeft={(props: IconProps) => (
            <Icon {...props} name='stethoscope' size={iconSizeDefault} pack='font-awesome' />
          )}
        />
        <DrawerItem
          style={drawerStyle.drawerItem}
          title='Meu Perfil'
          onPress={() => props.navigation.navigate('Profile')}
          accessoryLeft={(props: IconProps) => (
            <View style={{ paddingHorizontal: 3 }}>
              <Icon {...props} name='prescription' size={iconSizeDefault} pack='fontisto' />
            </View>
          )}
        />
        <DrawerItem
          style={drawerStyle.drawerItem}
          title='Configurações'
          onPress={() => props.navigation.navigate('Configuration')}
          accessoryLeft={(props: IconProps) => (
            <Icon {...props} name='settings-outline' size={iconSizeDefault} pack='ionicons' />
          )}
        />
        <DrawerItem
          style={drawerStyle.drawerItem}
          title='Ajuda'
          onPress={() => props.navigation.navigate('Help')}
          accessoryLeft={(props: IconProps) => (
            <Icon {...props} name="help-circle-outline" size={iconSizeDefault} pack='ionicons' />
          )}
        />
        <DrawerItem
          style={drawerStyle.drawerItem}
          title='Sair'
          onPress={signOut}
          accessoryLeft={(props: IconProps) => (
            <Icon {...props} name='log-out-outline' size={iconSizeDefault} pack='ionicons' />
          )}
        />
      </Drawer>
    </View>
  )
}

export default DrawerContent
