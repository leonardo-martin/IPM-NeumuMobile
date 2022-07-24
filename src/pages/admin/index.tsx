import FloatingPlusButton from '@components/floatingButton/plusButton'
import HeaderAdmin from '@components/header/admin'
import ModalizeFixed from '@components/modalize'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { useAppDispatch, useAppSelector } from '@hooks/redux'
import { useModal } from '@hooks/useModal'
import { EUserRole } from '@models/UserRole'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { useFocusEffect } from '@react-navigation/native'
import { getUserDetails, getUserRelatedIds } from '@services/user.service'
import { setProfile } from '@store/ducks/profile'
import { setUser } from '@store/ducks/user'
import { RootState } from '@store/index'
import { Card, Icon, Text, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { BackHandler, StatusBar, View } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { Modalize } from 'react-native-modalize'
import { Host, Portal } from 'react-native-portalize'
import { dashboardStyle } from './style'

const DashboardScreen: FC<DrawerContentComponentProps> = ({
  navigation
}): ReactElement => {
  const dispatch = useAppDispatch()

  const loadUser = async () => {
    const res = await getUserDetails()
    dispatch(setProfile(res.data))
    const response = await getUserRelatedIds()
    dispatch(setUser(response.data))
  }

  useEffect(() => {
    loadUser()
  }, [])

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
      <SafeAreaLayout level='1' style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ justifyContent: 'center', flex: 1 }}>
            <View style={styles.title}>
              <Text category="h5" status='basic' style={styles.text}>
                {sessionUser?.userRole.find(e => e.id === EUserRole.patient) ? (
                  'Como podemos te ajudar?'
                ) : 'Seja bem vindo ao TeleNeuMu!'}
              </Text>
            </View>
            <View style={styles.content}>
              {sessionUser?.userRole.find(e => e.id === EUserRole.patient) && (
                <View style={[styles.cardGroupPrimary, styles.shadowCard]}>
                  <Card style={styles.cardInline} onPress={goToSchedule}>
                    <View style={styles.cardDefault}>
                      <Icon style={styles.iconOrange} name="calendar-outline" size={50} pack='ionicons' />
                      <Text style={styles.cardText}>
                        Quero agendar uma consulta
                      </Text>
                    </View>
                  </Card>
                </View>
              )}
              {sessionUser?.userRole.find(e => e.id === EUserRole.medicalDoctor) && (
                <View style={[styles.cardGroupPrimary, styles.shadowCard]}>
                  <Card style={styles.cardInline} onPress={goToSchedule}>
                    <View style={styles.cardDefault}>
                      <Icon style={styles.iconOrange} name="clock" size={50} pack='font-awesome' />
                      <Text style={styles.cardText}>
                        Meus Horários
                      </Text>
                    </View>
                  </Card>
                </View>
              )}
              <View style={styles.cardGroupSecondary}>
                <Card style={[styles.card, styles.shadowCard]} onPress={goToProfile}>
                  <View style={styles.cardDefault}>
                    <Icon style={styles.iconPrimary} name='prescription' size={40} pack='fontisto' />
                  </View>
                  <Text style={styles.cardText}>
                    Meu perfil
                  </Text>
                </Card>
                <Card style={[styles.card, styles.shadowCard]}
                  onPress={goToAppointments}
                >
                  <View style={styles.cardDefault}>
                    <Icon
                      style={styles.iconPrimary}
                      name={sessionUser?.userRole.find(e => e.id === EUserRole.medicalDoctor) ? 'calendar-week' : 'stethoscope'}
                      size={40}
                      pack='font-awesome' />
                  </View>
                  <Text style={styles.cardText}>
                    {sessionUser?.userRole.find(e => e.id === EUserRole.patient) ? 'Minhas Consultas' : 'Agenda'}
                  </Text>
                </Card>
              </View>
              {sessionUser?.userRole.find(e => e.id === EUserRole.medicalDoctor) && (
                <View style={styles.cardGroupSecondary}>
                  <Card style={[styles.card, styles.shadowCard]}
                    onPress={() => navigation.jumpTo('NewUser')}>
                    <View style={styles.cardDefault}>
                      <Icon
                        style={styles.iconPrimary}
                        name="doctor"
                        size={40}
                        pack='fontisto'
                      />
                    </View>
                    <Text style={styles.cardText}>
                      Cadastrar
                    </Text>
                  </Card>
                </View>
              )}
              {/* {sessionUser?.userRole.find(e => e.id === EUserRole.patient) && (
                <View style={styles.cardGroupSecondary}>
                  <Card style={[styles.card, styles.shadowCard]}
                    onPress={() => navigation.jumpTo('AboutDNM')}>
                    <View style={styles.cardDefault}>
                      <Icon
                        style={styles.iconPrimary}
                        name="information-circle-outline"
                        size={40}
                        pack='ionicons'
                      />
                    </View>
                    <Text category="h6" style={styles.cardText}>
                      Informações
                    </Text>
                  </Card>
                  <Card style={[styles.card, styles.shadowCard]}
                    onPress={goToHelpMe}
                  >
                    <View style={styles.cardDefault}>
                      <Icon style={styles.iconPrimary} name="help-circle-outline" size={40} pack='ionicons' />
                    </View>
                    <Text category="h6" style={styles.cardText}>
                      Ajuda
                    </Text>
                  </Card>
                </View>
              )} */}
            </View>
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