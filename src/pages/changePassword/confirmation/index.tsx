import React, { FC, ReactElement, useCallback } from 'react'
import { BackHandler, Image, ImageStyle, StyleProp, View } from 'react-native'

import { SafeAreaLayout } from '@components/safeAreaLayout'
import { Button, Text, useStyleSheet } from '@ui-kitten/components'
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native'
import { useAuth } from '@contexts/auth'
import { changePasswdConfirmStyle } from './style'

const ChangePasswordConfirm: FC = (): ReactElement => {

    const { isAuthenticated } = useAuth()
    const styles = useStyleSheet(changePasswdConfirmStyle)
    const navigation = useNavigation<any>()
    const actions = CommonActions.reset({
        index: 0,
        routes: [
            { name: !isAuthenticated ? 'SignIn' : 'Dashboard' },
        ],
    })

    const navigate = () => navigation.dispatch(actions)

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                navigate()
                return true
            }
            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)
            return () => subscription.remove()
        }, [])
    )

    return (
        <>
            <SafeAreaLayout level='1' style={styles.safeArea}>
                <View style={styles.content}>
                    <View style={styles.item}>
                        <Image source={require('../../../assets/confirmation/communcation.png')}
                            style={styles.image as StyleProp<ImageStyle>} />
                    </View>
                    <View style={styles.viewDetails}>
                        <Text style={styles.description}>Enviado um link ao seu e-mail para redefinição da senha. Verifique sua caixa de entrada.</Text>
                    </View>
                    <Button
                        status='primary'
                        appearance='ghost'
                        onPress={navigate}
                    >Início</Button>
                </View>
            </SafeAreaLayout>
        </>
    )
}

export default ChangePasswordConfirm