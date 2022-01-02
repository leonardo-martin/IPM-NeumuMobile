import React, { FC, ReactElement, useCallback, useRef } from 'react'
import { BackHandler, StatusBar, View } from 'react-native'
import { Modalize } from 'react-native-modalize'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { Text, Card, Icon, useStyleSheet } from '@ui-kitten/components'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { useFocusEffect } from '@react-navigation/native'
import { dashboardStyle } from './style'

const DashboardScreen: FC<DrawerContentComponentProps> = ({
  navigation
}): ReactElement => {
  const gotToProfile = () => navigation.jumpTo('Profile')
  const gotToSchedule = () => navigation.jumpTo('Schedule')
  const gotToAppointments = () => navigation.jumpTo('MyAppointments')

  const styles = useStyleSheet(dashboardStyle)
  const modalizeRef = useRef<Modalize>(null)

  const handleClose = () => {
    modalizeRef.current?.close()
  }

  const exitApp = () => {
    BackHandler.exitApp()
  }

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        modalizeRef.current?.open()
        return true
      }
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => subscription.remove()
    }, [])
  )

  return (
    <SafeAreaLayout insets='bottom' level='1' style={styles.safeArea}>
      <View style={styles.content}>
        <StatusBar barStyle="dark-content" backgroundColor='transparent' translucent />
        <View style={styles.cardContainer}>
          <Text category="h5" status='basic' style={styles.text}>
            Como podemos te ajudar?
          </Text>
          <View style={styles.cardGroupPrimary}>
            <Card onPress={gotToSchedule}>
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
            <Card style={styles.card} onPress={gotToProfile}>
              <View style={styles.cardDefault}>
                <Icon style={styles.iconPrimary} name='prescription' size={40} pack='fontisto' />
              </View>
              <Text category="h6" style={styles.cardText}>
                Meu perfil
              </Text>
            </Card>
            <Card style={styles.card} onPress={gotToAppointments}>
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
            <Card style={styles.card}>
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

      <Modalize ref={modalizeRef} snapPoint={300} adjustToContentHeight={true}>
        <SafeAreaLayout level='2' style={styles.safeAreaModalize}>
          <View style={styles.contentModalize}>
            <Text style={styles.textConfirmExit}>Deseja realmente sair do aplicativo?</Text>
            <TouchableOpacity style={styles.contentButton} activeOpacity={0.75} onPress={exitApp}>
              <Text style={styles.contentButtonText}>{'Sim'.toUpperCase()}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.contentButton, styles.buttonOutline]} activeOpacity={0.75} onPress={handleClose}>
              <Text style={[styles.contentButtonText, styles.buttonTextOutline]}>{'Não'.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaLayout>
      </Modalize>

    </SafeAreaLayout>
  )
}

export default DashboardScreen