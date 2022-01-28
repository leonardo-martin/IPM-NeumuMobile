import React, { FC, ReactElement } from 'react'
import { ScrollView, View } from 'react-native'
import { Text, useStyleSheet } from '@ui-kitten/components'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { helpStyle } from './style'
import { SafeAreaLayout } from '@components/safeAreaLayout'

const HelpScreen: FC<DrawerContentComponentProps> = ({
  navigation
}): ReactElement => {

  const styles = useStyleSheet(helpStyle)
  return (
    <SafeAreaLayout insets='top' style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.contentContainerScrollView}>
        <View style={{
          flex:1, justifyContent: 'center'
        }}>
          <Text style={{ textAlign: 'center' }}>Help me!</Text>
        </View>
      </ScrollView>
    </SafeAreaLayout>
  )
}

export default HelpScreen