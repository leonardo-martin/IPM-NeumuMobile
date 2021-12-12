import React, { ReactElement } from 'react'
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem
} from '@react-navigation/drawer'
import { Avatar, Layout, Text } from '@ui-kitten/components'
import { ImageBackground, View } from 'react-native'
import { drawerStyle } from './style'
import { useAuth } from '../../contexts/auth'
import Icon from 'react-native-vector-icons/Ionicons'

const DrawerContent = (props: DrawerContentComponentProps): ReactElement => {
  const { currentUser, signOut } = useAuth()

  return (
    <View style={drawerStyle.drawerContent}>
      <DrawerContentScrollView {...props}>
        <Layout style={drawerStyle.header}>
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
        <DrawerItem
          style={drawerStyle.drawerItem}
          label='Inicio'
          onPress={() => props.navigation.navigate('Dashboard')}
          icon={() => <Icon name='home-outline' size={20} color={'#404040'} />}
        />
        <DrawerItem
          style={drawerStyle.drawerItem}
          label='Agendar consulta'
          onPress={() => props.navigation.navigate('Schedule')}
          icon={() => (
            <Icon name='calendar-outline' size={20} color={'#404040'} />
          )}
        />
        <DrawerItem
          style={drawerStyle.drawerItem}
          label='Meu Perfil'
          onPress={() => props.navigation.navigate('Profile')}
          icon={() => (
            <Icon name='person-outline' size={20} color={'#404040'} />
          )}
        />
        <DrawerItem
          style={drawerStyle.drawerItem}
          label='Configurações'
          onPress={() => props.navigation.navigate('Configuration')}
          icon={() => (
            <Icon name='settings-outline' size={20} color={'#404040'} />
          )}
        />
        <DrawerItem
          style={drawerStyle.drawerItem}
          label='Sair'
          onPress={signOut}
          icon={() => (
            <Icon name='log-out-outline' size={20} color={'#404040'} />
          )}
        />
      </DrawerContentScrollView>
    </View>
  )
}

export default DrawerContent
