import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { Text, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components'
import { BackIcon } from '@components/header/icons'
import { confirmationScheduleStyle } from './styles'
import { CommonActions, useFocusEffect, useRoute } from '@react-navigation/native'
import { CreateAppointment } from '@models/Appointment'
import { BackHandler, View } from 'react-native'

const ConfirmationScheduleScreen: FC<DrawerContentComponentProps> = ({
    navigation
}): ReactElement => {

    const styles = useStyleSheet(confirmationScheduleStyle)
    const { params } = useRoute()
    const [appointment, setAppointment] = useState<CreateAppointment | undefined>(undefined)
    const actions = CommonActions.reset({
        index: 0,
        routes: [
            { name: 'Dashboard' },
        ],
    })

    useEffect(() => {
        const schedule = params as CreateAppointment
        setAppointment(schedule)
    }, [params])

    const renderBackAction = (): ReactElement => (
        <TopNavigationAction
            icon={BackIcon}
            onPress={() => navigation.dispatch(actions)}
        />
    )

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
        <>
            <SafeAreaLayout insets='top' level='1' style={styles.safeArea}>
                <TopNavigation
                    accessoryLeft={renderBackAction}
                />
                <View style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center', flex: 1, alignSelf: 'center' }}>
                    <Text style={{
                        flexShrink: 1, flexWrap: 'wrap', textAlign: 'center', padding: 25, fontSize: 18
                    }}>{JSON.stringify(appointment)}</Text>
                </View>
            </SafeAreaLayout>
        </>
    )
}

export default ConfirmationScheduleScreen
