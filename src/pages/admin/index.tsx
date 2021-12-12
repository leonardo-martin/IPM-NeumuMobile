import React, { FC, ReactElement } from 'react'
import { SafeAreaView, StatusBar, View } from 'react-native'
import { Text, Card, Layout } from '@ui-kitten/components'
import { dashboardStyle } from './style'
import Icon from 'react-native-vector-icons/Ionicons'
import StethoscopeIcon from '../../assets/svg/stethoscope.svg'
import NotepadIcon from '../../assets/svg/notepad.svg'
import { DrawerContentComponentProps } from '@react-navigation/drawer'

const DashboardScreen: FC<DrawerContentComponentProps> = ({
  navigation
}): ReactElement => {
  const gotToProfile = () => navigation.jumpTo('Profile')
  const gotToSchedule = () => navigation.jumpTo('Schedule')
  const gotToAppointments = () => navigation.jumpTo('MyAppointments')

  return (
    <>
      <SafeAreaView style={dashboardStyle.content}>
        <StatusBar barStyle="dark-content" backgroundColor={'transparent'} translucent={true} />
        <Layout style={dashboardStyle.cardContainer} level="1">
          <Text category="h5" style={dashboardStyle.text}>
            Como podemos te ajudar?
          </Text>
          <View style={dashboardStyle.cardGroupPrimary}>
            <Card onPress={gotToSchedule}>
              <View style={dashboardStyle.cardDefault}>
                <Icon name="calendar-outline" size={60} color={'#D55F0A'} />
                <Text category="h6" style={dashboardStyle.cardText}>
                  Agendar consulta
                </Text>
              </View>
            </Card>
          </View>
          <View style={dashboardStyle.cardGroupSecondary}>
            <Card style={dashboardStyle.card} onPress={gotToProfile}>
              <View style={dashboardStyle.cardDefault}>
                <NotepadIcon width={40} height={40} fill={'#3171AC'} />
              </View>
              <Text category="h6" style={dashboardStyle.cardText}>
                Meu perfil
              </Text>
            </Card>
            <Card style={dashboardStyle.card} onPress={gotToAppointments}>
              <View style={dashboardStyle.cardDefault}>
                <StethoscopeIcon width={40} height={40} fill={'#3171AC'} />
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
                />
              </View>
              <Text category="h6" style={dashboardStyle.cardText}>
                Sobre
              </Text>
            </Card>
            <Card style={dashboardStyle.card}>
              <View style={dashboardStyle.cardDefault}>
                <Icon name="help-circle-outline" size={40} color={'#3171AC'} />
              </View>
              <Text category="h6" style={dashboardStyle.cardText}>
                Ajuda
              </Text>
            </Card>
          </View>
        </Layout>
      </SafeAreaView>
    </>
  )
}

export default DashboardScreen
