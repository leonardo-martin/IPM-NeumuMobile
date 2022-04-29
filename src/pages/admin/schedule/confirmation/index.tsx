import LocalCalendarDialog from '@components/dialog/localCalendarDialog'
import { BackIcon } from '@components/header/icons'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { useModal } from '@hooks/useModal'
import { EventCalendar } from '@models/Calendar'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { CommonActions, useFocusEffect, useRoute } from '@react-navigation/native'
import { addCalendarEvent } from '@services/calendar.service'
import { Button, Modal, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { BackHandler, View } from 'react-native'
import { Calendar } from "react-native-calendar-events"
import { confirmationScheduleStyle } from './styles'

const ConfirmationScheduleScreen: FC<DrawerContentComponentProps> = ({
    navigation
}): ReactElement => {

    const [isVisibleCalendars, setIsVisibleCalendars] = useState(false)
    const openLocalCalendarModal = () => setIsVisibleCalendars(true)
    const closeLocalCalendarModal = () => setIsVisibleCalendars(false)
    const { ref } = useModal<Modal>()

    const styles = useStyleSheet(confirmationScheduleStyle)
    const { params } = useRoute()
    const [event, setEvent] = useState<EventCalendar | undefined>()
    const actions = CommonActions.reset({
        index: 0,
        routes: [
            { name: 'Dashboard' },
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

    useEffect(() => {
        setEvent(params as EventCalendar)
    }, [params])

    const renderBackAction = (): ReactElement => (
        <TopNavigationAction
            icon={BackIcon}
            onPress={() => navigation.dispatch(actions)}
        />
    )

    const saveEvent = async (calendar: Calendar) => {
        if (event) {
            await addCalendarEvent(event, calendar, event.title)
            closeLocalCalendarModal()
        }
    }

    return (
        <>
            <SafeAreaLayout insets='top' level='1' style={styles.safeArea}>
                <TopNavigation
                    accessoryLeft={renderBackAction}
                />
                <View style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center', flex: 1, alignSelf: 'center' }}>
                    <Button status='primary' onPress={openLocalCalendarModal}>Adicionar ao calendário</Button>
                    <LocalCalendarDialog
                        ref={ref}
                        openModal={openLocalCalendarModal}
                        isVisible={isVisibleCalendars}
                        closeModal={closeLocalCalendarModal}
                        handleCalendarSelected={saveEvent}
                        label={'Meus Calendários (Disponíveis)'}
                    />
                </View>
            </SafeAreaLayout>
        </>
    )
}

export default ConfirmationScheduleScreen
