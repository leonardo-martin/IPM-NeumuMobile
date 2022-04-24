import FloatingPlusButton from '@components/floatingButton/plusButton'
import HeaderAdmin from '@components/header/admin'
import ModalizeFixed from '@components/modalize'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { useAppSelector } from '@hooks/redux'
import { useModal } from '@hooks/useModal'
import { EUserRole } from '@models/UserRole'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { useFocusEffect } from '@react-navigation/native'
import { RootState } from '@store/index'
import { Card, Icon, Text, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement, useCallback, useState } from 'react'
import { BackHandler, StatusBar, View } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { Modalize } from 'react-native-modalize'
import { Host, Portal } from 'react-native-portalize'
import { dashboardStyle } from './style'

const DashboardScreen: FC<DrawerContentComponentProps> = ({
  navigation
}): ReactElement => {

  const [visibleFloatingButton, setVisibleFloatingButton] = useState<boolean>(true)

  const styles = useStyleSheet(dashboardStyle)
  const { ref } = useModal<Modalize>()
  const { sessionUser } = useAppSelector((state: RootState) => state.auth)

  const exitApp = () => {
    ref.current?.close()
    BackHandler.exitApp()
  }

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        ref.current?.open()
        setVisibleFloatingButton(false)
        return true
      }
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => subscription.remove()
    }, [])
  )

  const goToProfile = () => navigation.jumpTo('Profile')
  const goToSchedule = () => {
    sessionUser?.userRole.find(e => e.id === EUserRole.patient) ?
      navigation.jumpTo('Schedule') : navigation.jumpTo('ProfessionalSchedule')
  }
  const goToAppointments = () => navigation.jumpTo('MyAppointments')
  const goToHelpMe = () => navigation.jumpTo('Help')

  return (
    <Host>
      <HeaderAdmin />
      <StatusBar barStyle="dark-content" backgroundColor='transparent' translucent />
      <SafeAreaLayout insets='top' level='1' style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.title}>
            <Text category="h5" status='basic' style={styles.text}>
              {sessionUser?.userRole.find(e => e.id === EUserRole.patient) ? (
                'Como podemos te ajudar?'
              ) : 'Seja bem vindo ao TeleNeumu!'}
            </Text>
          </View>
          <View style={styles.content}>
            {sessionUser?.userRole.find(e => e.id === EUserRole.patient) && (
              <View style={styles.cardGroupPrimary}>
                <Card onPress={goToSchedule}>
                  <View style={styles.cardDefault}>
                    <Icon style={styles.iconOrange} name="calendar-outline" size={50} pack='ionicons' />
                    <Text category="h6" style={[styles.cardText, {
                      marginHorizontal: -8, flex: 1
                    }]}>
                      Quero agendar uma consulta
                    </Text>
                  </View>
                </Card>
              </View>
            )}
            {sessionUser?.userRole.find(e => e.id === EUserRole.medicalDoctor) && (
              <View style={styles.cardGroupPrimary}>
                <Card onPress={goToSchedule}>
                  <View style={styles.cardDefault}>
                    <Icon style={styles.iconOrange} name="clock" size={50} pack='font-awesome' />
                    <Text category="h6" style={[styles.cardText, {
                      marginHorizontal: -8, flex: 1
                    }]}>
                      Meus Horários
                    </Text>
                  </View>
                </Card>
              </View>
            )}
            <View style={styles.cardGroupSecondary}>
              <Card style={styles.card} onPress={goToProfile}>
                <View style={styles.cardDefault}>
                  <Icon style={styles.iconPrimary} name='prescription' size={40} pack='fontisto' />
                </View>
                <Text category="h6" style={styles.cardText}>
                  Meu perfil
                </Text>
              </Card>
              {sessionUser?.userRole.find(e => e.id === EUserRole.patient) && (
                <Card style={styles.card} onPress={goToAppointments}>
                  <View style={styles.cardDefault}>
                    <Icon style={styles.iconPrimary} name='stethoscope' size={40} pack='font-awesome' />
                  </View>
                  <Text category="h6" style={styles.cardText}>Minhas Consultas</Text>
                </Card>
              )}
              {sessionUser?.userRole.find(e => e.id === EUserRole.medicalDoctor) && (
                <Card style={styles.card} onPress={goToAppointments}>
                  <View style={styles.cardDefault}>
                    <Icon style={styles.iconPrimary} name='calendar-week' size={40} pack='font-awesome' />
                  </View>
                  <Text category="h6" style={styles.cardText}>Agenda</Text>
                </Card>
              )}
            </View>
            {sessionUser?.userRole.find(e => e.id === EUserRole.patient) && (
              <View style={styles.cardGroupSecondary}>
                <Card style={styles.card}>
                  <View style={styles.cardDefault}>
                    <Icon
                      style={styles.iconPrimary}
                      name="information-circle-outline"
                      size={40}
                      pack='ionicons'
                    />
                  </View>
                  <Text category="h6" style={styles.cardText}>
                    Sobre
                  </Text>
                </Card>
                <Card style={styles.card} onPress={goToHelpMe}>
                  <View style={styles.cardDefault}>
                    <Icon style={styles.iconPrimary} name="help-circle-outline" size={40} pack='ionicons' />
                  </View>
                  <Text category="h6" style={styles.cardText}>
                    Ajuda
                  </Text>
                </Card>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaLayout>
      <Portal>
        <ModalizeFixed
          ref={ref}
          alwaysOpen={0}
          snapPoint={300}
          onClosed={() => setVisibleFloatingButton(true)}
          adjustToContentHeight={true}
          withHandle={false}>
          <Text style={styles.textConfirmExit}>Deseja realmente sair do aplicativo?</Text>
          <TouchableOpacity style={styles.contentButton} activeOpacity={0.75} onPress={exitApp}>
            <Text style={styles.contentButtonText}>{'Sim'.toUpperCase()}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.contentButton, styles.buttonOutline]} activeOpacity={0.75} onPress={() => ref.current?.close()}>
            <Text style={[styles.contentButtonText, styles.buttonTextOutline]}>{'Não'.toUpperCase()}</Text>
          </TouchableOpacity>
        </ModalizeFixed>
      </Portal>
      {
        sessionUser?.userRole.find(e => e.id === EUserRole.patient) && (
          <Portal>
            <FloatingPlusButton containerStyle={{
              bottom: 80,
              right: 60,
              opacity: visibleFloatingButton ? 1 : 0
            }} />
          </Portal>
        )

      }
    </Host >
  )
}

export default DashboardScreen