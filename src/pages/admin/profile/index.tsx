import { useRoute } from '@react-navigation/native'
import { Text } from '@ui-kitten/components'
import React, { FC, ReactElement } from 'react'
import { SafeAreaView, View } from 'react-native'
import { profileStyle } from './style'

const ProfileScreen: FC = (): ReactElement => {
  const route = useRoute()
  const { params }: any = route

  return (
    <SafeAreaView style={profileStyle.content}>
      <View style={profileStyle.content}>
        <Text style={profileStyle.text}>
          {`Profile ${JSON.stringify(params?.user)}`}
        </Text>
      </View>
    </SafeAreaView>
  )
}

export default ProfileScreen
