import { SafeAreaLayout } from '@components/safeAreaLayout'
import { useCombinedRefs } from '@hooks/useCombinedRefs'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { Spinner, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ForwardedRef, forwardRef, ReactElement, useCallback, useState } from 'react'
import { ActivityIndicator, BackHandler, Platform, View } from 'react-native'
import { WebView, WebViewNavigation, WebViewProps } from 'react-native-webview'
import { WebViewErrorEvent, WebViewNavigationEvent } from 'react-native-webview/lib/WebViewTypes'
import { html } from './data'
import { webViewStyle } from './style'

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
  const [loading, setLoading] = useState<boolean>(false)

  useFocusEffect(
    useCallback(() => {
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

      if (url.includes('?message=success')) combinedRef.current.stopLoading()
      if (url.includes('?errors=true')) combinedRef.current.stopLoading()
    },
    [],
  )

  function LoadingIndicatorView() {
    return (
      <View style={styles.spinnerView}>
        <Spinner size='giant' status='primary' />
      </View>
    )
  }

  return (
    <>
      <SafeAreaLayout style={styles.safeArea}>
        <WebView
          {...{ ...props, ref: combinedRef }}
          source={props.source}
          onLoadStart={(event: WebViewNavigationEvent) => {
            setLoading(event.nativeEvent.loading)
          }}
          onLoadEnd={(event: WebViewNavigationEvent | WebViewErrorEvent) => {
            setLoading(event.nativeEvent.loading)
          }}
          scrollEnabled={!isAndroid}
          onNavigationStateChange={onNavigationStateChange}
        />
        {loading && LoadingIndicatorView()}
      </SafeAreaLayout>
    </>
  )
})

RNWebView.defaultProps = {
  source: {
    html: html
  },
  originWhitelist: ['*'],
  startInLoadingState: false,
  allowsBackForwardNavigationGestures: true,
  showsVerticalScrollIndicator: true,
  domStorageEnabled: true,
  javaScriptEnabled: true
}

export default RNWebView
