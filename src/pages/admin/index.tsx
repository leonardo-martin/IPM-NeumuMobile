import React, { FC, ReactElement } from 'react'
import { StatusBar, View } from 'react-native'
import { Text, Card, Icon } from '@ui-kitten/components'
import { dashboardStyle } from './style'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { SafeAreaLayout } from '@components/safeAreaLayout'

const DashboardScreen: FC<DrawerContentComponentProps> = ({
  navigation
}): ReactElement => {
  const gotToProfile = () => navigation.jumpTo('Profile')
  const gotToSchedule = () => navigation.jumpTo('Schedule')
  const gotToAppointments = () => navigation.jumpTo('MyAppointments')

  return (
    <>
      <SafeAreaLayout style={dashboardStyle.safeArea}>
        <View style={dashboardStyle.content}>
          <StatusBar barStyle="dark-content" backgroundColor={'transparent'} translucent={true} />
          <View style={dashboardStyle.cardContainer}>
            <Text category="h5" status='basic' style={dashboardStyle.text}>
              Como podemos te ajudar?
            </Text>
            <View style={dashboardStyle.cardGroupPrimary}>
              <Card onPress={gotToSchedule}>
                <View style={dashboardStyle.cardDefault}>
                  <Icon name="calendar-outline" color='#D55F0A' size={50} pack='ionicons' />
                  <Text category="h6" style={dashboardStyle.cardText}>
                    Quero agendar uma consulta
                  </Text>
                </View>
              </Card>
            </View>
            <View style={dashboardStyle.cardGroupSecondary}>
              <Card style={dashboardStyle.card} onPress={gotToProfile}>
                <View style={dashboardStyle.cardDefault}>
                  <Icon name='prescription' size={40} pack='fontisto' color='#3171AC' />
                </View>
                <Text category="h6" style={dashboardStyle.cardText}>
                  Meu perfil
                </Text>
              </Card>
              <Card style={dashboardStyle.card} onPress={gotToAppointments}>
                <View style={dashboardStyle.cardDefault}>
                  <Icon name='stethoscope' size={40} pack='font-awesome' color='#3171AC' />
                </View>
                <Text category="h6" style={dashboardStyle.cardText}>
                  Minhas consultas
                </Text>
              </Card>
            </View>
            <View style={dashboardStyle.cardGroupSecondary}>
              <Card style={dashboardStyle.card}>
                <View style={dashboardStyle.cardDefault}>
                  <Icon
                    name="information-circle-outline"
                    size={40}
                    color={'#3171AC'}
                    pack='ionicons'
                  />
                </View>
                <Text category="h6" style={dashboardStyle.cardText}>
                  Sobre
                </Text>
              </Card>
              <Card style={dashboardStyle.card}>
                <View style={dashboardStyle.cardDefault}>
                  <Icon name="help-circle-outline" size={40} color={'#3171AC'} pack='ionicons' />
                </View>
                <Text category="h6" style={dashboardStyle.cardText}>
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
