import React, { FC, ReactElement, useCallback, useState, forwardRef, ForwardedRef } from 'react'
import { BackHandler, Platform, View } from 'react-native'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { WebView, WebViewNavigation, WebViewProps } from 'react-native-webview'
import { WebViewSource, WebViewSourceUri } from 'react-native-webview/lib/WebViewTypes'
import { Spinner, useStyleSheet } from '@ui-kitten/components'
import { webViewStyle } from './style'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { useCombinedRefs } from '@hooks/useCombinedRefs'
import { html } from './data'

const isAndroid = Platform.OS === 'android'

interface RNWebViewProps extends WebViewProps {
  ref: ForwardedRef<WebView>
}

const RNWebView: FC<RNWebViewProps> = forwardRef<WebView, React.PropsWithChildren<WebViewProps>>(({ ...props }, ref): ReactElement => {

  const combinedRef = useCombinedRefs(ref, ref)
  const styles = useStyleSheet(webViewStyle)
  const navigation = useNavigation()
  const route = useRoute()
  const { params } = route
  const [back, setBack] = useState<boolean>(false)
  const [source, setSource] = useState<WebViewSource>()

  useFocusEffect(
    useCallback(() => {
      setSource(params ? params as WebViewSourceUri : props.source)
      const onBackPress = () => {
        if (back) combinedRef.current.goBack()
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

      if (url.includes('?errors=true')) combinedRef.current.stopLoading()
    },
    [],
  )

  return (
    <>
      <SafeAreaLayout style={styles.safeArea}>
        <WebView
          {...{ ...props, ref: combinedRef }}
          source={source ? source : props.source}
          renderLoading={() => (
            <View style={styles.spinnerView}>
              <Spinner size='giant' status='primary' />
            </View>
          )}
          scrollEnabled={!isAndroid}
          onNavigationStateChange={onNavigationStateChange}
        />
      </SafeAreaLayout>
    </>
  )
})

RNWebView.defaultProps = {
  source: {
    html: html
  },
  originWhitelist: ['*'],
  startInLoadingState: true,
  allowsBackForwardNavigationGestures: true,
  showsVerticalScrollIndicator: true
}

export default RNWebView
