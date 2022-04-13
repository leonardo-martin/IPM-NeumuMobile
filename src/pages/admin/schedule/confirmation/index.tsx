import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { BackHandler, View } from 'react-native'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { Button, Modal, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components'
import { CommonActions, useFocusEffect, useRoute } from '@react-navigation/native'
import { Calendar } from "react-native-calendar-events"
import { useModal } from '@hooks/useModal'
import { BackIcon } from '@components/header/icons'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import LocalCalendarModalComponent from '@components/modal/localCalendarModal'
import { addCalendarEvent } from '@services/calendar.service'
import { EventCalendar } from '@models/Calendar'
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
            const eventId = await addCalendarEvent(event, calendar, event.title)
            console.log(eventId)
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
                    <LocalCalendarModalComponent
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
