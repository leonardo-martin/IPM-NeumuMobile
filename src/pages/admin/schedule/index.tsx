import React, { FC, ReactElement } from 'react'
import { Card, Layout, Text } from '@ui-kitten/components'
import { SafeAreaView, View } from 'react-native'
import { scheduleStyle } from './style'
import PhoneIcon from '../../../assets/svg/phone.svg'
import HouseIcon from '../../../assets/svg/house.svg'

const ScheduleScreen: FC = (): ReactElement => {
  return (
    <SafeAreaView style={scheduleStyle.content}>
      <Layout style={scheduleStyle.cardContainer} level="1">
        <Text category="h5" style={scheduleStyle.text}>
          Como prefere sua consulta?
        </Text>
        <View style={scheduleStyle.cardGroupPrimary}>
          <Card style={scheduleStyle.card}>
            <View style={scheduleStyle.cardDefault}>
              <PhoneIcon width={40} height={40} fill={'#D55F0A'} />
              <Text category="h6" style={scheduleStyle.cardText}>
                Virtual (teleconsulta)
              </Text>
            </View>
          </Card>
        </View>
        <View style={scheduleStyle.cardGroupPrimary}>
          <Card style={scheduleStyle.card}>
            <View style={scheduleStyle.cardDefault}>
              <HouseIcon width={40} height={40} fill={'#D55F0A'} />
              <Text category="h6" style={scheduleStyle.cardText}>
                Presencial
              </Text>
            </View>
          </Card>
        </View>
      </Layout>
    </SafeAreaView>
  )
}

export default ScheduleScreen
