import HouseIcon from '@assets/svg/house.svg'
import PhoneIcon from '@assets/svg/phone.svg'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { useNavigation } from '@react-navigation/native'
import { Card, Text, useStyleSheet, useTheme } from '@ui-kitten/components'
import React, { FC, ReactElement } from 'react'
import { ScrollView, View } from 'react-native'
import { scheduleStyle } from './style'

const ScheduleScreen: FC = (): ReactElement => {

  const styles = useStyleSheet(scheduleStyle)
  const navigation = useNavigation<any>()
  const theme = useTheme()

  const goTo = (type: number) => navigation.jumpTo('FilterSchedule', { type })

  return (
    <>
      <SafeAreaLayout style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.content}>
            <View style={styles.cardContainer}>
              <Text category="h5" style={styles.text}>
                Como prefere sua consulta?
              </Text>
              <View style={[styles.cardGroupPrimary, styles.shadowCard]}>
                <Card
                  style={styles.card}
                  onPress={() => goTo(0)}>
                  <View style={styles.cardDefault}>
                    <PhoneIcon width={40} height={40} fill={theme['color-warning-default']} />
                    <Text style={styles.cardText}>
                      Quero uma consulta virtual (teleconsulta)
                    </Text>
                  </View>
                </Card>
              </View>
              <View style={[styles.cardGroupPrimary, styles.shadowCard]}>
                <Card
                  style={styles.card}
                  onPress={() => goTo(1)}>
                  <View style={styles.cardDefault}>
                    <HouseIcon width={40} height={40} fill={theme['color-warning-default']} />
                    <Text style={styles.cardText}>
                      Quero uma consulta presencial
                    </Text>
                  </View>
                </Card>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaLayout>
    </>
  )
}

export default ScheduleScreen
