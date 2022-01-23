import React, { FC, ReactElement } from 'react'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { Avatar, Icon, Text, useStyleSheet } from '@ui-kitten/components'
import { ImageBackground, ImageStyle, StyleProp, TouchableOpacity, View } from 'react-native'
import { profileStyle } from './style'
import { useAuth } from '@contexts/auth'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { data } from './data'
import ListComponent from '@components/list'

const ProfileScreen: FC<DrawerContentComponentProps> = ({
  navigation
}): ReactElement => {
  const { currentUser, signOut } = useAuth()
  const styles = useStyleSheet(profileStyle)
  return (
    <>
      <SafeAreaLayout level='2' style={styles.safeArea}>
        <View style={styles.contentContainer}>
          <Avatar style={styles.avatar as StyleProp<ImageStyle>}
            shape='round'
            source={{ uri: 'https://bootdey.com/img/Content/avatar/avatar6.png' }}
            ImageComponent={ImageBackground} />
          <View style={styles.body}>
            <View style={styles.bodyContent}>
              <Text style={styles.profileName}>@{currentUser ? currentUser.user : ''}</Text>
              <View style={styles.viewLocation}>
                <Icon style={styles.icon} name="location-outline" size={15} pack='ionicons' />
                <Text status='info'>São Paulo, SP - Brasil</Text>
              </View>
              <Text style={styles.description}></Text>
            </View>
          </View>
        </View>
        <ListComponent
          data={data}
        />
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={signOut}
            hitSlop={{
              left: 10,
              right: 10,
              top: 10,
              bottom: 10
            }}
          >
            <Text status='danger' category='label' style={styles.textFooter}>Sair</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaLayout>
    </>
  )
}

export default ProfileScreen
