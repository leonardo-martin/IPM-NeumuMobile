import React, { ReactElement } from 'react'
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList
} from '@react-navigation/drawer'
import { Avatar, Layout, Text } from '@ui-kitten/components'
import { View } from 'react-native'
import { drawerStyle } from './style'
import { useAuth } from '../../contexts/auth'
import Icon from 'react-native-vector-icons/Feather'

const DrawerContent = (props: any): ReactElement => {
  const { currentUser, signOut } = useAuth()

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <Layout style={drawerStyle.header}>
          <View style={drawerStyle.profileContainer}>
            <Avatar size='giant' source={require('../../assets/imagem.jpg')} />
            <Text style={drawerStyle.profileName} category='h6'>
              {currentUser?.user}
            </Text>
          </View>
        </Layout>
        <DrawerItemList {...props} />
        <DrawerItem
        style={drawerStyle.drawerItem}
          label='Sair'
          onPress={signOut}
          icon={() => <Icon name='log-out' size={20} color={'#404040'} />}
        />
      </DrawerContentScrollView>
    </View>
  )
}

export default DrawerContent
