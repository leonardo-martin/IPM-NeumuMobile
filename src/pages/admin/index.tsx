import React, { FC, ReactElement } from 'react'
import { SafeAreaView, View } from 'react-native'
import { Text, Card, Layout } from '@ui-kitten/components'
import { dashboardStyle } from './style'
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { DashboardScreenProp } from '../../routes/app.routes'
import StethoscopeIcon from '../../assets/svg/stethoscope.svg'
import NotepadIcon from '../../assets/svg/notepad.svg'

const DashboardScreen: FC = (): ReactElement => {
  const navigation = useNavigation<DashboardScreenProp>()
  const gotToProfile = () => navigation.navigate('Profile')
  const gotToSchedule = () => navigation.navigate('Schedule')

  return (
    <SafeAreaView style={dashboardStyle.content}>
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
          <Card style={dashboardStyle.card}>
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
  )
}

export default DashboardScreen
