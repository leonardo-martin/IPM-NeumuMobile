import { SafeAreaLayout } from '@components/safeAreaLayout'
import RNWebView from '@components/webView'
import { FRONT_END_URL } from '@constants/uri'
import { useAppSelector } from '@hooks/redux'
import { useFocusEffect } from '@react-navigation/native'
import { HttpService } from '@services/http.service'
import { useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement, useCallback, useRef } from 'react'
import WebView from 'react-native-webview'
import { RootState } from 'store'
import { abrafeuFormStyle } from './abrafeu-form.style'

const AbrafeuFormScreen: FC = (): ReactElement => {

    const styles = useStyleSheet(abrafeuFormStyle)

    const webView = useRef<WebView>(null)
    const { payload } = useAppSelector((state: RootState) => state.auth)
    const { ids } = useAppSelector((state: RootState) => state.user)

    useFocusEffect(
        useCallback(() => {
            if (payload?.accessToken) {
                HttpService.setCookie(FRONT_END_URL, {
                    name: 'auth.token',
                    value: `${payload?.accessToken}`,
                    path: '/',
                    expires: undefined
                })
                webView.current?.reload()
            }
        }, [payload])
    )

    return (
        <SafeAreaLayout level='1' style={styles.safeArea}>

            {payload && ids?.patientId && (
                <RNWebView
                    ref={webView}
                    source={{
                        uri: `${FRONT_END_URL}/admin/abrafeu/${ids?.patientId}`
                    }}
                />
            )}

        </SafeAreaLayout>
    )
}

export default AbrafeuFormScreen