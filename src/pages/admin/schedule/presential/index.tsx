import React, { FC, ReactElement } from 'react'
import { Layout } from '@ui-kitten/components'
import { SafeAreaView } from 'react-native'
import { scheduleStyle } from './style'
import { DrawerContentComponentProps } from '@react-navigation/drawer'

const PresentialScreen: FC<DrawerContentComponentProps> = ({
  navigation,
  state
}): ReactElement => {
  return (
    <>
      <SafeAreaView style={scheduleStyle.content}>
        <Layout style={scheduleStyle.cardContainer} level="1"></Layout>
      </SafeAreaView>
    </>
  )
}

export default PresentialScreen
