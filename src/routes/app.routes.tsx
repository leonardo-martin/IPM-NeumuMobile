import React, { FC, ReactElement } from 'react'
import {
  createDrawerNavigator,
  DrawerContentComponentProps
} from '@react-navigation/drawer'
import DashboardScreen from '../pages/admin'
import { StackNavigationProp } from '@react-navigation/stack'
import { ParamListBase } from '@react-navigation/native'
import DrawerContent from '../components/drawer'
import ProfileScreen from '../pages/admin/profile'
import Icon from 'react-native-vector-icons/Ionicons'

import { useAuth } from '../contexts/auth'
import { StyleSheet } from 'react-native'

export type DashboardScreenProp = StackNavigationProp<
  ParamListBase,
  'Dashboard'
>

export type ProfileScreenProp = StackNavigationProp<ParamListBase, 'Profile'>

const { Navigator, Screen } = createDrawerNavigator()

const AppRoutes: FC = (): ReactElement => {
  const { currentUser, signOut } = useAuth()

  return (
    <Navigator
      drawerContent={(props: DrawerContentComponentProps) => (
        <DrawerContent {...props} signOut={signOut} />
      )}
      initialRouteName='Dashboard'
      screenOptions={{
        headerShown: false,
        swipeEnabled: true
      }}
    >
      <Screen
        name='Dashboard'
        component={DashboardScreen}
        initialParams={{ user: currentUser }}
        options={{
          drawerLabel: 'Inicio',
          drawerIcon: () => (
            <Icon name='home-outline' size={20} color={'#404040'} />
          ),
          drawerItemStyle: style.drawerItem
        }}
      />
      <Screen
        name='Profile'
        component={ProfileScreen}
        initialParams={{ user: currentUser }}
        options={{
          drawerLabel: 'Meu Perfil',
          drawerIcon: () => (
            <Icon name='person-outline' size={20} color={'#404040'} />
          ),
          drawerItemStyle: style.drawerItem
        }}
      />
    </Navigator>
  )
}

export default AppRoutes

const style = StyleSheet.create({
  drawerItem: {
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50
  }
})
