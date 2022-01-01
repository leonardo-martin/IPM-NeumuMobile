import React, { FC, ReactElement } from 'react'
import { Card, Text } from '@ui-kitten/components'
import { View } from 'react-native'
import { scheduleStyle } from './style'
import PhoneIcon from '@assets/svg/phone.svg'
import HouseIcon from '@assets/svg/house.svg'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { SafeAreaLayout } from '@components/safeAreaLayout'

const ScheduleScreen: FC<DrawerContentComponentProps> = ({
  navigation
}): ReactElement => {

  return (
    <>
      <SafeAreaLayout style={scheduleStyle.safeArea}>
        <View style={scheduleStyle.content}>
          <View style={scheduleStyle.cardContainer}>
            <Text category="h5" style={scheduleStyle.text}>
              Como prefere sua consulta?
            </Text>
            <View style={scheduleStyle.cardGroupPrimary}>
              <Card style={scheduleStyle.card}>
                <View style={scheduleStyle.cardDefault}>
                  <PhoneIcon width={40} height={40} fill={'#D55F0A'} />
                  <Text category="h6" style={scheduleStyle.cardText}>
                    Quero uma consulta virtual (teleconsulta)
                  </Text>
                </View>
              </Card>
            </View>
            <View style={scheduleStyle.cardGroupPrimary}>
              <Card
                style={scheduleStyle.card}
                onPress={() => navigation.jumpTo('ChoiceSchedule')}
              >
                <View style={scheduleStyle.cardDefault}>
                  <HouseIcon width={40} height={40} fill={'#D55F0A'} />
                  <Text category="h6" style={scheduleStyle.cardText}>
                  Quero uma consulta presencial
                  </Text>
                </View>
              </Card>
            </View>
          </View>
        </View>
      </SafeAreaLayout>
    </>
  )
}

export default ScheduleScreen
