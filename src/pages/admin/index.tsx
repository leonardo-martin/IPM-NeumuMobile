import React, { FC, ReactElement, useCallback } from 'react'
import { BackHandler, StatusBar, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { Text, Card, Icon, useStyleSheet } from '@ui-kitten/components'
import { Host, Portal } from 'react-native-portalize'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { useFocusEffect } from '@react-navigation/native'
import ModalizeFixed from '@components/modalize'
import HeaderAdmin from '@components/header/admin'
import { useModalize } from '@hooks/useModalize'
import { dashboardStyle } from './style'

const DashboardScreen: FC<DrawerContentComponentProps> = ({
  navigation
}): ReactElement => {
  const goToProfile = () => navigation.jumpTo('Profile')
  const goToSchedule = () => navigation.jumpTo('Schedule')
  const goToAppointments = () => navigation.jumpTo('MyAppointments')
  const goToHelpMe = () => navigation.jumpTo('Help')


  const styles = useStyleSheet(dashboardStyle)
  const { ref, open, close } = useModalize()

  const exitApp = () => {
    close()
    BackHandler.exitApp()
  }

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        open()
        return true
      }
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => subscription.remove()
    }, [])
  )

  return (
    <Host>
      <HeaderAdmin />
      <StatusBar barStyle="dark-content" backgroundColor='transparent' translucent />
      <SafeAreaLayout insets='bottom' level='1' style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.cardContainer}>
            <Text category="h5" status='basic' style={styles.text}>
              Como podemos te ajudar?
            </Text>
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
            <View style={styles.cardGroupSecondary}>
              <Card style={styles.card} onPress={goToProfile}>
                <View style={styles.cardDefault}>
                  <Icon style={styles.iconPrimary} name='prescription' size={40} pack='fontisto' />
                </View>
                <Text category="h6" style={styles.cardText}>
                  Meu perfil
                </Text>
              </Card>
              <Card style={styles.card} onPress={goToAppointments}>
                <View style={styles.cardDefault}>
                  <Icon style={styles.iconPrimary} name='stethoscope' size={40} pack='font-awesome' />
                </View>
                <Text category="h6" style={styles.cardText}>
                  Minhas consultas
                </Text>
              </Card>
            </View>
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
              <Card style={styles.card}  onPress={goToHelpMe}>
                <View style={styles.cardDefault}>
                  <Icon style={styles.iconPrimary} name="help-circle-outline" size={40} pack='ionicons' />
                </View>
                <Text category="h6" style={styles.cardText}>
                  Ajuda
                </Text>
              </Card>
            </View>
          </View>
        </View>
      </SafeAreaLayout>
      <Portal>
        <ModalizeFixed
          ref={ref}
          snapPoint={300}
          adjustToContentHeight={true}
          withHandle={false}>
          <Text style={styles.textConfirmExit}>Deseja realmente sair do aplicativo?</Text>
          <TouchableOpacity style={styles.contentButton} activeOpacity={0.75} onPress={exitApp}>
            <Text style={styles.contentButtonText}>{'Sim'.toUpperCase()}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.contentButton, styles.buttonOutline]} activeOpacity={0.75} onPress={close}>
            <Text style={[styles.contentButtonText, styles.buttonTextOutline]}>{'Não'.toUpperCase()}</Text>
          </TouchableOpacity>
        </ModalizeFixed>
      </Portal>
    </Host>
  )
}

export default DashboardScreen