import React, { FC, ReactElement } from 'react'
import { StatusBar, View } from 'react-native'
import { Text, Card, Icon, useStyleSheet } from '@ui-kitten/components'
import { dashboardStyle } from './style'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { SafeAreaLayout } from '@components/safeAreaLayout'

const DashboardScreen: FC<DrawerContentComponentProps> = ({
  navigation
}): ReactElement => {
  const gotToProfile = () => navigation.jumpTo('Profile')
  const gotToSchedule = () => navigation.jumpTo('Schedule')
  const gotToAppointments = () => navigation.jumpTo('MyAppointments')

  const styles = useStyleSheet(dashboardStyle)

  return (
    <>
      <SafeAreaLayout insets='bottom' level='1' style={styles.safeArea}>
        <View style={styles.content}>
          <StatusBar barStyle="dark-content" backgroundColor={'transparent'} translucent={true} />
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
      </SafeAreaLayout>
    </>
  )
}

export default DashboardScreen
