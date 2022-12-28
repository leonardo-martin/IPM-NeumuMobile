import { SafeAreaLayout } from '@components/safeAreaLayout'
import { Text, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement } from 'react'
import { ScrollView, View } from 'react-native'
import { helpStyle } from './style'

const HelpScreen: FC = (): ReactElement => {

  const styles = useStyleSheet(helpStyle)
  return (
    <SafeAreaLayout insets='top' style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.contentContainerScrollView}>
        <View style={{
          flex:1, justifyContent: 'center'
        }}>
          <Text style={{ textAlign: 'center' }}>A definir...</Text>
        </View>
      </ScrollView>
    </SafeAreaLayout>
  )
}

export default HelpScreen