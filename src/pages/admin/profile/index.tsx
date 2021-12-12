import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { Avatar, Text } from '@ui-kitten/components'
import React, { FC, ReactElement } from 'react'
import { ImageBackground, SafeAreaView, TouchableOpacity, View } from 'react-native'
import { profileStyle } from './style'
import Icon from 'react-native-vector-icons/Ionicons'
import ListComponent from '../../../components/menuList'
import { useAuth } from '../../../contexts/auth'

const ProfileScreen: FC<DrawerContentComponentProps> = ({
  navigation
}): ReactElement => {
  const { currentUser, signOut } = useAuth()

  return (
    <>
      <SafeAreaView style={profileStyle.content}>
        <Avatar style={profileStyle.avatar}
          shape='round'
          source={{ uri: 'https://bootdey.com/img/Content/avatar/avatar6.png' }}
          ImageComponent={ImageBackground} />
        <View style={profileStyle.body}>
          <View style={profileStyle.bodyContent}>
            <Text style={profileStyle.profileName}>@{currentUser ? currentUser.user : ''}</Text>
            <Text style={profileStyle.info} status='primary'>
              <Icon name="location-outline" size={15} color={'#3171AC'} />
              Londrina, Paraná - Brasil
            </Text>
            <Text style={profileStyle.description}></Text>
          </View>
        </View>
        <ListComponent data={[
          {
            id: 1,
            title: 'Editar Perfil',
            accessoryLeft: () => (
              <Icon name="person-circle-outline" size={20} color={"#000"} />
            )
          }
        ]}
          scrollEnabled={false}
          divider={true}
        />

      </SafeAreaView>
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
    </>
  )
}

export default ProfileScreen
