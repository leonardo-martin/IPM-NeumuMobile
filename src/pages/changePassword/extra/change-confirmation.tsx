import { SafeAreaLayout } from '@components/safeAreaLayout'
import { useAppDispatch, useAppSelector } from '@hooks/redux'
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native'
import { logout } from '@store/ducks/auth'
import { Button, Text, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement, useCallback } from 'react'
import { BackHandler, Image, ImageStyle, StyleProp, View } from 'react-native'
import { RootState } from 'store'
import { changePasswdConfirmStyle } from './change-confirmation.style'

const PasswordChangeConfirmationScreen: FC = (): ReactElement => {

    const { isAuthenticated } = useAppSelector((state: RootState) => state.auth)
    const dispatch = useAppDispatch()
    const styles = useStyleSheet(changePasswdConfirmStyle)
    const navigation = useNavigation<any>()
    const actions = CommonActions.reset({
        index: 0,
        routes: [
            { name: !isAuthenticated ? 'SignIn' : 'Dashboard' },
        ],
    })

    const navigate = () => {
        if (isAuthenticated) dispatch(logout())
        else navigation.dispatch(actions)
    }

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
                    <View style={[styles.item, { flex: 1 }]}>
                        <Image source={require('../../../assets/confirmation/success-password.png')}
                            style={styles.image as StyleProp<ImageStyle>} />
                        <View style={styles.title}>
                            <Text style={[styles.description, { fontSize: 18 }]}>Parabéns! Sua senha foi alterada com sucesso</Text>
                        </View>
                        <Button
                            status='primary'
                            appearance='outline'
                            onPress={navigate}>Início</Button>
                    </View>

                </View>
            </SafeAreaLayout>
        </>
    )
}

export default PasswordChangeConfirmationScreen