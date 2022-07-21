import { SafeAreaLayout } from '@components/safeAreaLayout'
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native'
import { Button, Text, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement, useCallback } from 'react'
import { BackHandler, View } from 'react-native'
import ConfettiCannon from 'react-native-confetti-cannon'
import { accountVerifiedStyle } from './style'

const AccountVerificationScreen: FC = (): ReactElement => {

    const styles = useStyleSheet(accountVerifiedStyle)
    const navigation = useNavigation<any>()
    const actions = CommonActions.reset({
        index: 0,
        routes: [
            { name: 'SignIn' },
        ],
    })

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                navigation.dispatch(actions)
                return true
            }
            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)
            return () => subscription.remove()
        }, [])
    )

    return (
        <SafeAreaLayout insets='top' level='3' style={styles.safeArea}>
            <ConfettiCannon fadeOut count={200} origin={{ x: -10, y: 0 }} />
            <View style={styles.container}>
                <Text style={styles.text}>{'Parabéns!!!\n\n'.toUpperCase() + 'O seu endereço de e-mail foi confirmado com sucesso.\n'}</Text>
                <Button
                    onPress={() => navigation.dispatch(actions)}
                    style={styles.button}
                    status='primary'>
                    {evaProps => <Text {...evaProps}>{'Login'.toUpperCase()}</Text>}
                </Button>
            </View>
        </SafeAreaLayout>
    )
}

export default AccountVerificationScreen