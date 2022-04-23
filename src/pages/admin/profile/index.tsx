import HeaderProfile from '@components/header/admin/profile'
import ListComponent from '@components/list'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { useAppDispatch, useAppSelector } from '@hooks/redux'
import { EUserRole } from '@models/UserRole'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { logout } from '@store/ducks/auth'
import { RootState } from '@store/index'
import { Avatar, Button, Icon, IconProps, Text, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement } from 'react'
import { ImageStyle, StyleProp, TouchableOpacity, View } from 'react-native'
import { patientBaseData, specialistBaseData } from './data'
import { profileStyle } from './style'

const ProfileScreen: FC<DrawerContentComponentProps> = ({
  navigation
}): ReactElement => {

  const dispatch = useAppDispatch()
  const { sessionUser } = useAppSelector((state: RootState) => state.auth)
  const styles = useStyleSheet(profileStyle)

  const renderIconDocumentAttach = (props: IconProps) => (
    <Icon {...props} style={styles.iconExam} name="document-attach-outline" size={15} pack='ionicons' />
  )

  const goToMyExams = () => {
    navigation.navigate('PatientExams')
  }

  const renderFooterComponent = () => (
    <>
      <View style={styles.listFooter}>
        <Button
          onPress={goToMyExams}
          appearance='filled'
          status='success'
          accessoryLeft={renderIconDocumentAttach}>Meus Exames</Button>
      </View>
      {exitComponent()}
    </>
  )

  const exitComponent = () => (
    <View style={styles.listFooter}>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => dispatch(logout())}>
        <Text status='danger' category='label' style={styles.textFooter}>Sair</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <>
      <HeaderProfile />
      <SafeAreaLayout level='2' style={styles.safeArea}>
        <ListComponent
          data={sessionUser?.userRole.find(e => e.id === EUserRole.patient) ? patientBaseData : specialistBaseData}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <>
              <View style={styles.contentContainer}>
                <Avatar style={styles.avatar as StyleProp<ImageStyle>}
                  shape='round'
                  source={require('../../../assets/profile/profile.png')} />
                <View style={styles.body}>
                  <View style={styles.bodyContent}>
                    <Text style={styles.profileName}>@{sessionUser ? sessionUser.user : ''}</Text>
                    {/* <View style={styles.viewLocation}>
                      <Icon style={styles.icon} name="location-outline" size={15} pack='ionicons' />
                      <Text status='info'>São Paulo, SP - Brasil</Text>
                    </View> */}
                    <Text style={styles.description}></Text>
                  </View>
                </View>
              </View>
            </>
          )}
          ListFooterComponent={
            sessionUser?.userRole.find(e => e.id === EUserRole.patient) ? renderFooterComponent
              : exitComponent}
          renderItem={undefined} />
      </SafeAreaLayout>
    </>
  )
}

export default ProfileScreen
