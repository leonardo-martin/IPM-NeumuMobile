import React, { FC, ReactElement } from 'react'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { Avatar, Text } from '@ui-kitten/components'
import { ImageBackground, TouchableOpacity, View } from 'react-native'
import { profileStyle } from './style'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useAuth } from '@contexts/auth'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { data } from './data'
import ListComponent from '@components/list'

const ProfileScreen: FC<DrawerContentComponentProps> = ({
  navigation
}): ReactElement => {
  const { currentUser, signOut } = useAuth()

  return (
    <>
      <SafeAreaLayout level='2' style={profileStyle.safeArea}>
        <View style={profileStyle.contentContainer}>
          <Avatar style={profileStyle.avatar}
            shape='round'
            source={{ uri: 'https://bootdey.com/img/Content/avatar/avatar6.png' }}
            ImageComponent={ImageBackground} />
          <View style={profileStyle.body}>
            <View style={profileStyle.bodyContent}>
              <Text style={profileStyle.profileName}>@{currentUser ? currentUser.user : ''}</Text>
              <Text style={profileStyle.info} status='primary'>
                <Ionicons name="location-outline" size={15} color={'#3171AC'} />
                Londrina, Paraná - Brasil
              </Text>
              <Text style={profileStyle.description}></Text>
            </View>
          </View>
        </View>
        <ListComponent
          data={data}
        />
        <View style={profileStyle.footer}>
          <TouchableOpacity
            style={profileStyle.buttonContainer}
            onPress={signOut}
            hitSlop={{
              left: 10,
              right: 10,
              top: 10,
              bottom: 10
            }}
          >
            <Text status='danger' style={profileStyle.textFooter}>Desconectar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaLayout>
    </>
  )
}

export default ProfileScreen
