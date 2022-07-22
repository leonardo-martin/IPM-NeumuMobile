import { SafeAreaLayout } from '@components/safeAreaLayout'
import { CommonActions, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { Button, Text, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { BackHandler, View } from 'react-native'
import ConfettiCannon from 'react-native-confetti-cannon'
import { accountVerificationStyle } from '../style'

interface AccountVerificationParams {
    type: 'email' | 'underage'
}

const AccountVerificationScreen: FC = (): ReactElement => {

    const styles = useStyleSheet(accountVerificationStyle)
    const route = useRoute()
    const [params, setParams] = useState<AccountVerificationParams>()

    useEffect(() => {
        setParams(route.params as AccountVerificationParams)
    }, [route.params])

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

    const selector = () => {
        switch (params?.type) {
            case 'email':
                return emailAccount()                
            case 'underage':
                return underagePermission()
            default:
                return <></>
        }
    }

    const emailAccount = (): ReactElement => (
        <Text style={styles.text}>
            {'Parabéns!!!\n\n'.toUpperCase() + 'O seu endereço de e-mail foi confirmado com sucesso.\n'}
        </Text>
    )

    const underagePermission = (): ReactElement => (
        <Text style={styles.text}>
            {'Tudo certo, foi concedido a permissão ao seu paciente.\n'}
        </Text>
    )

    return (
        <SafeAreaLayout insets='top' level='3' style={styles.safeArea}>
            <ConfettiCannon fadeOut count={200} origin={{ x: -10, y: 0 }} />
            <View style={styles.container}>
                {params?.type && selector()}
                <Button
                    onPress={() => navigation.dispatch(actions)}
                    style={styles.button}
                    status='primary'>
                    {evaProps => <Text {...evaProps}>{'Início'.toUpperCase()}</Text>}
                </Button>
            </View>
        </SafeAreaLayout>
    )
}

export default AccountVerificationScreen