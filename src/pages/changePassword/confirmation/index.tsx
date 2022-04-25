import { SafeAreaLayout } from '@components/safeAreaLayout'
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native'
import { Button, Text, useStyleSheet } from '@ui-kitten/components'
import { useAppSelector } from '@hooks/redux'
import React, { FC, ReactElement, useCallback } from 'react'
import { BackHandler, Image, ImageStyle, StyleProp, View } from 'react-native'
import { RootState } from 'store'
import { changePasswdConfirmStyle } from './style'
import { TouchableOpacity } from 'react-native-gesture-handler'


const ChangePasswordConfirm: FC = (): ReactElement => {

    const { isAuthenticated } = useAppSelector((state: RootState) => state.auth)
    const styles = useStyleSheet(changePasswdConfirmStyle)
    const navigation = useNavigation<any>()
    const actions = CommonActions.reset({
        index: 0,
        routes: [
            { name: !isAuthenticated ? 'SignIn' : 'Dashboard' },
        ],
    })

    const navigate = () => navigation.dispatch(actions)
    const changeWithToken = () => navigation.navigate('ChangePasswordWithToken')

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
                    <View style={[styles.item, { flex: .9 }]}>
                        <Image source={require('../../../assets/confirmation/communcation.png')}
                            style={styles.image as StyleProp<ImageStyle>} />
                        <View style={styles.title}>
                            <Text style={[styles.description, { fontSize: 16 }]}>Enviado um link para o e-mail de cadastro com as instruções. Verifique sua caixa de entrada.</Text>
                        </View>
                    </View>
                    <View style={{ flex: .1 }}>
                        <Button
                            status='primary'
                            appearance='outline'
                            onPress={navigate}>Início</Button>
                        <View style={[styles.viewDetails, { flexDirection: 'row' }]}>
                            <Text category='c1' style={styles.message}>Já recebeu o TOKEN? Clique</Text>
                            <TouchableOpacity
                                onPress={changeWithToken}>
                                <Text category='c1' style={[styles.boldText, { textTransform: 'uppercase' }]}>{" "}aqui</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaLayout>
        </>
    )
}

export default ChangePasswordConfirm