import React, { FC, ReactElement } from 'react'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { Text } from '@ui-kitten/components'
import { View } from 'react-native'
import { chatRoomStyle } from './style'
import { useRoute } from '@react-navigation/native'
import { SafeAreaLayout } from '@components/safeAreaLayout'

const ChatRoomScreen: FC<DrawerContentComponentProps> = ({
  navigation
}): ReactElement => {

  const route = useRoute()
  const { params }: any = route

  return (
    <>
      <SafeAreaLayout style={chatRoomStyle.safeArea}>
        <View style={chatRoomStyle.container}>
          <Text>Chat Screen: {params?.id}</Text>
        </View>
      </SafeAreaLayout>
    </>
  )
}

export default ChatRoomScreen
