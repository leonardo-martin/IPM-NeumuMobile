import React, { FC, ReactElement, useCallback, useRef, useState } from 'react'
import { BackHandler, Platform, View } from 'react-native'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { WebView, WebViewNavigation } from 'react-native-webview'
import { WebViewSourceUri } from 'react-native-webview/lib/WebViewTypes'
import { Spinner, useStyleSheet } from '@ui-kitten/components'
import { webViewStyle } from './style'
import { SafeAreaLayout } from 'components/safeAreaLayout'

const isAndroid = Platform.OS === 'android'

const RNWebView: FC<WebViewSourceUri> = (props): ReactElement => {

  const styles = useStyleSheet(webViewStyle)
  const navigation = useNavigation()
  const route = useRoute()
  const { params } = route
  const ref = useRef<WebView>(null)
  const [back, setBack] = useState<boolean>(false)
  const [source, setSource] = useState<WebViewSourceUri | undefined>(undefined)

  useFocusEffect(
    useCallback(() => {
      setSource(params ? params as WebViewSourceUri : props)
      const onBackPress = () => {
        if (back) ref.current?.goBack()
        else navigation.goBack()
        return true
      }
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => subscription.remove()
    }, [back, params])
  )

  const onNavigationStateChange = useCallback(
    ({ url, canGoBack }: WebViewNavigation) => {
      setBack(canGoBack)

      if (url.includes('?errors=true')) {
        ref.current?.stopLoading()
      }
    },
    [],
  )

  return (
    <>
      <SafeAreaLayout insets='top' style={styles.safeArea}>
        <WebView
          ref={ref}
          source={{ uri: source ? source.uri : props.uri }}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.spinnerView}>
              <Spinner size='giant' status='primary' />
            </View>
          )}
          allowsBackForwardNavigationGestures
          scrollEnabled={!isAndroid}
          showsVerticalScrollIndicator
          onNavigationStateChange={onNavigationStateChange}
        />
      </SafeAreaLayout>
    </>
  )
}

RNWebView.defaultProps = {
  uri: 'https://www.google.com.br'
}

export default RNWebView
