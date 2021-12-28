import React, { ReactElement } from 'react'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { Avatar, DrawerGroup, Layout, Text, DrawerItem, Drawer } from '@ui-kitten/components'
import { ImageBackground, View } from 'react-native'
import { drawerStyle } from './style'
import { useAuth } from '@contexts/auth'
import Icon from 'react-native-vector-icons/Ionicons'
import HouseIcon from '@assets/svg/house.svg'
import PhoneIcon from '@assets/svg/phone.svg'
import { AppInfoService } from '@services/app-info.service'
import { SafeAreaLayout } from '@components/safeAreaLayout'

const _VERSION: string = AppInfoService.getVersion()
const iconColorDefault = '#404040'
const iconSizeDefault = 20

const DrawerContent = (props: DrawerContentComponentProps): ReactElement => {
  const { currentUser, signOut } = useAuth()

  const CalendarIcon = () => (
    <Icon name='calendar-outline' size={iconSizeDefault} color={iconColorDefault} />
  )

  const renderHeader = (): ReactElement => (
    <SafeAreaLayout insets='top' level='2'>
      <Layout style={drawerStyle.header} level='2'>
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
      </Layout>
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
          accessoryLeft={() => <Icon name='home-outline' size={iconSizeDefault} color={iconColorDefault} />}
        />
        <DrawerGroup title='Agendar consulta'
          onLongPress={() => props.navigation.navigate('Schedule')}
          accessoryLeft={CalendarIcon}
        >
          <DrawerItem
            style={drawerStyle.drawerItemGroup}
            title='Virtual (teleconsulta)'
            onPress={() => props.navigation.navigate('PresentialSchedule')}
            accessoryLeft={() => (
              <PhoneIcon width={iconSizeDefault} height={iconSizeDefault} fill={iconColorDefault} />
            )}
          />
          <DrawerItem
            style={drawerStyle.drawerItemGroup}
            title='Presencial'
            onPress={() => props.navigation.navigate('PresentialSchedule')}
            accessoryLeft={() => (
              <HouseIcon width={iconSizeDefault} height={iconSizeDefault} fill={iconColorDefault} />
            )}
          />
        </DrawerGroup>
        <DrawerItem
          style={drawerStyle.drawerItem}
          title='Meu Perfil'
          onPress={() => props.navigation.navigate('Profile')}
          accessoryLeft={() => (
            <Icon name='person-outline' size={iconSizeDefault} color={iconColorDefault} />
          )}
        />
        <DrawerItem
          style={drawerStyle.drawerItem}
          title='Configurações'
          onPress={() => props.navigation.navigate('Configuration')}
          accessoryLeft={() => (
            <Icon name='settings-outline' size={iconSizeDefault} color={iconColorDefault} />
          )}
        />
        <DrawerItem
          style={drawerStyle.drawerItem}
          title='Sair'
          onPress={signOut}
          accessoryLeft={() => (
            <Icon name='log-out-outline' size={iconSizeDefault} color={iconColorDefault} />
          )}
        />
      </Drawer>
    </View>
  )
}

export default DrawerContent
