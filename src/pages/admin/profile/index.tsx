import React, { FC, ReactElement } from 'react'
import { ImageStyle, StyleProp, TouchableOpacity, View } from 'react-native'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { Avatar, Button, Icon, IconProps, Text, useStyleSheet } from '@ui-kitten/components'
import { useAuth } from '@contexts/auth'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import ListComponent from '@components/list'
import { BOOTDEY_URI } from '@constants/uri'
import { profileStyle } from './style'
import { data } from './data'
import HeaderProfile from '@components/header/admin/profile'

const ProfileScreen: FC<DrawerContentComponentProps> = ({
  navigation
}): ReactElement => {

  const { currentUser, signOut } = useAuth()
  const styles = useStyleSheet(profileStyle)

  const renderIconDocumentAttach = (props: IconProps) => (
    <Icon {...props} style={styles.iconExam} name="document-attach-outline" size={15} pack='ionicons' />
  )

  const goToMyExams = () => {
    navigation.navigate('MyExams')
  }

  const renderFooterComponent = () => (
    <View style={styles.listFooter}>
      <Button
        onPress={goToMyExams}
        appearance='filled'
        status='success'
        accessoryLeft={renderIconDocumentAttach}
      >Meus Exames</Button>
    </View>
  )

  return (
    <>
      <HeaderProfile />
      <SafeAreaLayout level='2' style={styles.safeArea}>
        <View style={styles.contentContainer}>
          <Avatar style={styles.avatar as StyleProp<ImageStyle>}
            shape='round'
            source={{ uri: BOOTDEY_URI + '/img/Content/avatar/avatar6.png' }}
          />
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
          ListFooterComponent={renderFooterComponent}
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
